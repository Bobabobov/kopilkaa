"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, Pencil, Send, Trash2 } from "lucide-react";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";

import {
  storiesGlassCard,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";
import { UserSocialLinks } from "@/components/users/UserSocialLinks";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_AVATAR } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/time";
import {
  commentContainsLink,
  compareStoryCommentsByRank,
  STORY_COMMENT_MAX_LENGTH,
  STORY_COMMENT_MIN_LENGTH,
  STORY_COMMENT_NO_LINKS_ERROR,
  sanitizePlainTextComment,
} from "@/lib/stories/storyComments";
import {
  useStoryComments,
  type StoryCommentItem,
} from "@/hooks/stories/useStoryComments";

interface StoryCommentsSectionProps {
  storyId: string;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

interface ReplyTarget {
  commentId: string;
  userName: string;
}

interface CommentDraftState {
  sanitized: string;
  trimmedLength: number;
  hasLink: boolean;
  textOk: boolean;
}

const TEXTAREA_CLASS = cn(
  "flex min-h-[88px] w-full resize-y rounded-xl border border-[#abd1c6]/25 bg-[#001e1d] px-3 py-2.5 text-sm text-[#fffffe] shadow-sm transition-colors",
  "placeholder:text-[#abd1c6]/45",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/35 focus-visible:border-[#f9bc60]/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

function countThreadReplies(comment: StoryCommentItem): number {
  if (!comment.replies?.length) return 0;
  return comment.replies.reduce(
    (sum, reply) => sum + 1 + countThreadReplies(reply),
    0,
  );
}

function collectThreadCommentIds(comment: StoryCommentItem): string[] {
  const ids = [comment.id];
  for (const reply of comment.replies ?? []) {
    ids.push(...collectThreadCommentIds(reply));
  }
  return ids;
}

function formatReplyCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ответ`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ответа`;
  }
  return `${count} ответов`;
}

function getCommentDraftState(text: string): CommentDraftState {
  const sanitized = sanitizePlainTextComment(text);
  const trimmedLength = sanitized.length;
  const hasLink = trimmedLength > 0 && commentContainsLink(sanitized);
  const textOk =
    trimmedLength >= STORY_COMMENT_MIN_LENGTH &&
    trimmedLength <= STORY_COMMENT_MAX_LENGTH &&
    !hasLink;

  return { sanitized, trimmedLength, hasLink, textOk };
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

interface CommentComposerProps {
  id: string;
  text: string;
  placeholder: string;
  submitting: boolean;
  cooldownLeft: number | null;
  canSubmit: boolean;
  hasLink: boolean;
  trimmedLength: number;
  submitError: string | null;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

function CommentComposer({
  id,
  text,
  placeholder,
  submitting,
  cooldownLeft,
  canSubmit,
  hasLink,
  trimmedLength,
  submitError,
  onTextChange,
  onSubmit,
  onCancel,
  compact = false,
}: CommentComposerProps) {
  return (
    <div className={cn("space-y-3", compact && "mt-3")}>
      <div className="space-y-2">
        <Label htmlFor={id} className="sr-only">
          {placeholder}
        </Label>
        <textarea
          id={id}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={compact ? 2 : 3}
          maxLength={STORY_COMMENT_MAX_LENGTH}
          placeholder={placeholder}
          disabled={submitting || cooldownLeft !== null}
          className={cn(TEXTAREA_CLASS, compact && "min-h-[72px]")}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#abd1c6]/75">
          {trimmedLength}/{STORY_COMMENT_MAX_LENGTH}
          {" · "}без ссылок
        </p>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={submitting}
              className="text-[#abd1c6] hover:text-[#fffffe]"
            >
              Отмена
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(
              "rounded-xl font-semibold",
              canSubmit
                ? "bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] hover:opacity-90"
                : "bg-white/10 text-[#abd1c6]/60",
            )}
          >
            {submitting ? (
              <>
                <LucideIcons.Loader2 size="sm" className="animate-spin" />
                Отправка…
              </>
            ) : cooldownLeft !== null ? (
              <>Подождите {cooldownLeft} сек.</>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Отправить
              </>
            )}
          </Button>
        </div>
      </div>
      {hasLink && (
        <p className="text-sm text-[#e16162]">{STORY_COMMENT_NO_LINKS_ERROR}</p>
      )}
      {submitError && <p className="text-sm text-[#e16162]">{submitError}</p>}
    </div>
  );
}

interface CommentContentProps {
  comment: StoryCommentItem;
  compact?: boolean;
  canReply: boolean;
  isAuthenticated: boolean;
  isReplying: boolean;
  isEditing: boolean;
  replyText: string;
  editText: string;
  replyDraft: CommentDraftState;
  editDraft: CommentDraftState;
  canSubmitReply: boolean;
  canSaveEdit: boolean;
  submitting: boolean;
  mutating: boolean;
  cooldownLeft: number | null;
  submitError: string | null;
  actionError: string | null;
  onAuthRequired: () => void;
  onStartReply: (target: ReplyTarget) => void;
  onCancelReply: () => void;
  onReplyTextChange: (value: string) => void;
  onSubmitReply: (parentId: string) => void;
  onStartEdit: (comment: StoryCommentItem) => void;
  onCancelEdit: () => void;
  onEditTextChange: (value: string) => void;
  onSaveEdit: (commentId: string) => void;
  onDelete: (comment: StoryCommentItem) => void;
  onToggleLike: (commentId: string) => void;
}

function CommentContent({
  comment,
  compact = false,
  canReply,
  isAuthenticated,
  isReplying,
  isEditing,
  replyText,
  editText,
  replyDraft,
  editDraft,
  canSubmitReply,
  canSaveEdit,
  submitting,
  mutating,
  cooldownLeft,
  submitError,
  actionError,
  onAuthRequired,
  onStartReply,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  onStartEdit,
  onCancelEdit,
  onEditTextChange,
  onSaveEdit,
  onDelete,
  onToggleLike,
}: CommentContentProps) {
  const profileHref = `/profile/${comment.user.id}`;
  const showManageActions =
    (comment.canEdit || comment.canDelete) && !isEditing && !isReplying;

  return (
    <article className="flex gap-3">
      <Link
        href={profileHref}
        prefetch={false}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60"
      >
        <Avatar className={cn(compact ? "h-8 w-8" : "h-9 w-9")}>
          <AvatarImage
            src={comment.user.avatar || DEFAULT_AVATAR}
            alt={comment.user.name}
          />
          <AvatarFallback className="bg-[#004643] text-xs text-[#abd1c6]">
            {getInitials(comment.user.name)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1 space-y-2">
        {comment.replyTo && (
          <Link
            href={`/profile/${comment.replyTo.user.id}`}
            prefetch={false}
            className={cn(
              badgeVariants({ variant: "secondary" }),
              "max-w-full hover:bg-[#f9bc60]/15 hover:text-[#f9bc60]",
            )}
          >
            <MessageCircle className="h-3 w-3" />
            <span>В ответ {comment.replyTo.user.name}</span>
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href={profileHref}
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#fffffe] transition-colors hover:text-[#f9bc60]"
          >
            <span>{comment.user.name}</span>
          </Link>
          {comment.user.isSelf && (
            <Badge variant="default" className="text-[10px] uppercase">
              Вы
            </Badge>
          )}
          <span className="text-xs text-[#abd1c6]/70">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {comment.isEdited && (
            <Badge variant="muted" className="text-[10px] font-normal">
              изменён
            </Badge>
          )}
        </div>

        <UserSocialLinks
          vkLink={comment.user.vkLink}
          telegramLink={comment.user.telegramLink}
          youtubeLink={comment.user.youtubeLink}
          compact
        />

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              id={`story-comment-edit-${comment.id}`}
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              rows={compact ? 2 : 3}
              maxLength={STORY_COMMENT_MAX_LENGTH}
              disabled={mutating}
              className={TEXTAREA_CLASS}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#abd1c6]/75">
                {editDraft.trimmedLength}/{STORY_COMMENT_MAX_LENGTH}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancelEdit}
                  disabled={mutating}
                  className="text-[#abd1c6]"
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSaveEdit(comment.id)}
                  disabled={!canSaveEdit}
                  className={cn(
                    "rounded-xl font-semibold",
                    canSaveEdit
                      ? "bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d]"
                      : "bg-white/10 text-[#abd1c6]/60",
                  )}
                >
                  {mutating ? "Сохранение…" : "Сохранить"}
                </Button>
              </div>
            </div>
            {editDraft.hasLink && (
              <p className="text-sm text-[#e16162]">
                {STORY_COMMENT_NO_LINKS_ERROR}
              </p>
            )}
            {isEditing && actionError && (
              <p className="text-sm text-[#e16162]">{actionError}</p>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[#e8f4f0]">
            {comment.content}
          </p>
        )}

        {!isEditing && (
          <div className="flex flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 text-xs font-semibold hover:bg-white/5",
                comment.isLiked
                  ? "text-[#e16162]"
                  : "text-[#abd1c6] hover:text-[#e16162]",
              )}
              onClick={() => {
                if (!isAuthenticated) {
                  onAuthRequired();
                  return;
                }
                onToggleLike(comment.id);
              }}
              disabled={mutating}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  comment.isLiked && "fill-current",
                )}
              />
              {comment.likeCount ?? 0}
            </Button>
            {canReply && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-semibold text-[#abd1c6] hover:bg-white/5 hover:text-[#f9bc60]"
                onClick={() => {
                  if (!isAuthenticated) {
                    onAuthRequired();
                    return;
                  }
                  onStartReply({
                    commentId: comment.id,
                    userName: comment.user.name,
                  });
                }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Ответить
              </Button>
            )}
            {showManageActions && comment.canEdit && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-semibold text-[#abd1c6] hover:bg-white/5 hover:text-[#f9bc60]"
                onClick={() => onStartEdit(comment)}
                disabled={mutating}
              >
                <Pencil className="h-3.5 w-3.5" />
                Изменить
              </Button>
            )}
            {showManageActions && comment.canDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-semibold text-[#e16162]/85 hover:bg-[#e16162]/10 hover:text-[#e16162]"
                onClick={() => onDelete(comment)}
                disabled={mutating}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Удалить
              </Button>
            )}
          </div>
        )}

        {isReplying && (
          <CommentComposer
            id={`story-comment-reply-${comment.id}`}
            text={replyText}
            placeholder={`Ответ для ${comment.user.name}…`}
            submitting={submitting}
            cooldownLeft={cooldownLeft}
            canSubmit={canSubmitReply}
            hasLink={replyDraft.hasLink}
            trimmedLength={replyDraft.trimmedLength}
            submitError={isReplying ? submitError : null}
            onTextChange={onReplyTextChange}
            onSubmit={() => onSubmitReply(comment.id)}
            onCancel={onCancelReply}
            compact
          />
        )}
      </div>
    </article>
  );
}

interface CommentBranchSharedProps {
  canReply: boolean;
  isAuthenticated: boolean;
  replyingTo: ReplyTarget | null;
  editingId: string | null;
  replyText: string;
  editText: string;
  submitting: boolean;
  mutating: boolean;
  cooldownLeft: number | null;
  submitError: string | null;
  actionError: string | null;
  onAuthRequired: () => void;
  onStartReply: (target: ReplyTarget) => void;
  onCancelReply: () => void;
  onReplyTextChange: (value: string) => void;
  onSubmitReply: (parentId: string) => void;
  onStartEdit: (comment: StoryCommentItem) => void;
  onCancelEdit: () => void;
  onEditTextChange: (value: string) => void;
  onSaveEdit: (commentId: string) => void;
  onDelete: (comment: StoryCommentItem) => void;
  onToggleLike: (commentId: string) => void;
}

function CommentRepliesBranch({
  replies,
  depth = 1,
  ...sharedProps
}: CommentBranchSharedProps & {
  replies: StoryCommentItem[];
  depth?: number;
}) {
  const sortedReplies = [...replies].sort(compareStoryCommentsByRank);

  return (
    <div
      className={cn(
        "space-y-3",
        depth === 1 && "border-l-2 border-[#f9bc60]/20 pl-3",
        depth > 1 && "ml-1 border-l border-white/10 pl-3",
      )}
    >
      {sortedReplies.map((reply) => {
        const state = getBubbleState(
          reply.id,
          sharedProps.canReply,
          sharedProps.replyingTo,
          sharedProps.editingId,
          sharedProps.replyText,
          sharedProps.editText,
          sharedProps.submitting,
          sharedProps.mutating,
          sharedProps.cooldownLeft,
        );

        return (
          <div
            key={reply.id}
            className="rounded-xl border border-white/[0.08] bg-[#001e1d]/35 p-3"
          >
            <CommentContent
              comment={reply}
              compact
              isReplying={state.isReplying}
              isEditing={state.isEditing}
              replyDraft={state.replyDraft}
              editDraft={state.editDraft}
              canSubmitReply={state.canSubmitReply}
              canSaveEdit={state.canSaveEdit}
              {...sharedProps}
            />
            {reply.replies && reply.replies.length > 0 && (
              <CommentRepliesBranch
                replies={reply.replies}
                depth={depth + 1}
                {...sharedProps}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CommentSkeleton() {
  return (
    <Card variant="darkGlass" padding="sm">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[80%]" />
        </div>
      </div>
    </Card>
  );
}

interface CommentThreadBlockProps {
  comment: StoryCommentItem;
  canReply: boolean;
  isAuthenticated: boolean;
  replyingTo: ReplyTarget | null;
  editingId: string | null;
  replyText: string;
  editText: string;
  submitting: boolean;
  mutating: boolean;
  cooldownLeft: number | null;
  submitError: string | null;
  actionError: string | null;
  onAuthRequired: () => void;
  onStartReply: (target: ReplyTarget) => void;
  onCancelReply: () => void;
  onReplyTextChange: (value: string) => void;
  onSubmitReply: (parentId: string) => void;
  onStartEdit: (comment: StoryCommentItem) => void;
  onCancelEdit: () => void;
  onEditTextChange: (value: string) => void;
  onSaveEdit: (commentId: string) => void;
  onDelete: (comment: StoryCommentItem) => void;
  onToggleLike: (commentId: string) => void;
}

function getBubbleState(
  commentId: string,
  canReply: boolean,
  replyingTo: ReplyTarget | null,
  editingId: string | null,
  replyText: string,
  editText: string,
  submitting: boolean,
  mutating: boolean,
  cooldownLeft: number | null,
) {
  const isReplying = replyingTo?.commentId === commentId;
  const isEditing = editingId === commentId;
  const replyDraft = getCommentDraftState(replyText);
  const editDraft = getCommentDraftState(editText);
  const canSubmitReply =
    canReply && replyDraft.textOk && !submitting && cooldownLeft === null;
  const canSaveEdit = editDraft.textOk && !mutating;

  return {
    isReplying,
    isEditing,
    replyDraft,
    editDraft,
    canSubmitReply,
    canSaveEdit,
  };
}

function CommentThreadBlock({
  comment,
  canReply,
  isAuthenticated,
  replyingTo,
  editingId,
  replyText,
  editText,
  submitting,
  mutating,
  cooldownLeft,
  submitError,
  actionError,
  onAuthRequired,
  onStartReply,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  onStartEdit,
  onCancelEdit,
  onEditTextChange,
  onSaveEdit,
  onDelete,
  onToggleLike,
}: CommentThreadBlockProps) {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined,
  );
  const replyCount = countThreadReplies(comment);
  const hasReplies = (comment.replies?.length ?? 0) > 0;

  const threadCommentIds = useMemo(
    () => new Set(collectThreadCommentIds(comment)),
    [comment],
  );

  useEffect(() => {
    if (replyingTo && threadCommentIds.has(replyingTo.commentId)) {
      setAccordionValue("replies");
    }
  }, [replyingTo, threadCommentIds]);

  const rootState = getBubbleState(
    comment.id,
    canReply,
    replyingTo,
    editingId,
    replyText,
    editText,
    submitting,
    mutating,
    cooldownLeft,
  );

  const sharedContentProps = {
    canReply,
    isAuthenticated,
    replyText,
    editText,
    submitting,
    mutating,
    cooldownLeft,
    submitError,
    actionError,
    onAuthRequired,
    onStartReply,
    onCancelReply,
    onReplyTextChange,
    onSubmitReply,
    onStartEdit,
    onCancelEdit,
    onEditTextChange,
    onSaveEdit,
    onDelete,
    onToggleLike,
  };

  if (!hasReplies) {
    return (
      <Card variant="darkGlass" padding="sm">
        <CommentContent
          comment={comment}
          isReplying={rootState.isReplying}
          isEditing={rootState.isEditing}
          replyDraft={rootState.replyDraft}
          editDraft={rootState.editDraft}
          canSubmitReply={rootState.canSubmitReply}
          canSaveEdit={rootState.canSaveEdit}
          {...sharedContentProps}
        />
      </Card>
    );
  }

  const repliesOpen = accordionValue === "replies";

  return (
    <Card variant="darkGlass" padding="sm" className="space-y-1">
      <CommentContent
        comment={comment}
        isReplying={rootState.isReplying}
        isEditing={rootState.isEditing}
        replyDraft={rootState.replyDraft}
        editDraft={rootState.editDraft}
        canSubmitReply={rootState.canSubmitReply}
        canSaveEdit={rootState.canSaveEdit}
        {...sharedContentProps}
      />

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="replies" className="border-0">
          <AccordionTrigger className="py-2 text-xs font-semibold text-[#abd1c6] hover:text-[#f9bc60] hover:no-underline [&>svg]:text-[#f9bc60]">
            {repliesOpen
              ? `Скрыть ${formatReplyCount(replyCount)}`
              : `Показать ${formatReplyCount(replyCount)}`}
          </AccordionTrigger>
          <AccordionContent className="pb-0 pt-0">
            <Separator className="mb-3" />
            <CommentRepliesBranch
              replies={comment.replies ?? []}
              {...sharedContentProps}
              replyingTo={replyingTo}
              editingId={editingId}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export function StoryCommentsSection({
  storyId,
  isAuthenticated,
  onAuthRequired,
}: StoryCommentsSectionProps) {
  const { confirm, showToast } = useBeautifulNotifications();
  const {
    items,
    total,
    viewer,
    loading,
    submitting,
    mutating,
    error,
    submitError,
    actionError,
    submitComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
  } = useStoryComments(storyId);

  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number | null>(
    viewer.cooldownSecondsRemaining,
  );

  useEffect(() => {
    setCooldownLeft(viewer.cooldownSecondsRemaining);
  }, [viewer.cooldownSecondsRemaining]);

  useEffect(() => {
    if (cooldownLeft === null || cooldownLeft <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownLeft]);

  const rootDraft = getCommentDraftState(text);
  const canSubmitRoot =
    viewer.canComment &&
    rootDraft.textOk &&
    !submitting &&
    cooldownLeft === null;

  const statusMessage = useMemo(() => {
    if (!isAuthenticated && !viewer.isAuthenticated) {
      return {
        tone: "info" as const,
        title: "Войдите, чтобы комментировать",
        body: "Комментарии могут оставлять только зарегистрированные участники с одобренной историей.",
      };
    }
    if (viewer.isAuthenticated && !viewer.canComment) {
      return {
        tone: "warn" as const,
        title: "Комментарии пока недоступны",
        body: "Оставить комментарий можно после одобрения хотя бы одной опубликованной истории.",
      };
    }
    return null;
  }, [isAuthenticated, viewer.canComment, viewer.isAuthenticated]);

  const handleSubmitRoot = async () => {
    if (!viewer.canComment) return;
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    if (!canSubmitRoot) return;

    const ok = await submitComment(text);
    if (ok) setText("");
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!viewer.canComment || !isAuthenticated) return;
    const draft = getCommentDraftState(replyText);
    if (!draft.textOk || submitting || cooldownLeft !== null) return;

    const ok = await submitComment(replyText, parentId);
    if (ok) {
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleStartEdit = (comment: StoryCommentItem) => {
    setEditingId(comment.id);
    setEditText(comment.content);
    setReplyingTo(null);
    setReplyText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId: string) => {
    const draft = getCommentDraftState(editText);
    if (!draft.textOk || mutating) return;

    const ok = await updateComment(commentId, editText);
    if (ok) {
      setEditingId(null);
      setEditText("");
      showToast("success", "Комментарий обновлён");
    }
  };

  const handleDeleteComment = async (comment: StoryCommentItem) => {
    const nestedReplies = countThreadReplies(comment);
    const confirmed = await confirm(
      nestedReplies > 0
        ? `Удалить комментарий и ${formatReplyCount(nestedReplies)}?`
        : "Удалить этот комментарий?",
      "Удаление комментария",
    );
    if (!confirmed) return;

    const ok = await deleteComment(comment.id);
    if (ok) {
      if (editingId === comment.id) handleCancelEdit();
      if (replyingTo?.commentId === comment.id) {
        setReplyingTo(null);
        setReplyText("");
      }
      showToast("success", "Комментарий удалён");
    }
  };

  return (
    <section
      id="story-comments"
      className={cn(storiesGlassCard, "mt-8 p-5 sm:p-7")}
      aria-label="Комментарии"
    >
      <div className={storiesGlassShine} />

      <div className="relative space-y-6">
        <CardHeader className="mb-0">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bc60]/80">
              Обсуждение
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[#fffffe] sm:text-2xl">
                Комментарии
              </h2>
              {total > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {total}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {statusMessage ? (
          <Card
            variant="outline"
            padding="sm"
            className={cn(
              statusMessage.tone === "warn"
                ? "border-[#e16162]/40 bg-[#e16162]/10"
                : "border-[#f9bc60]/30 bg-[#f9bc60]/10",
            )}
          >
            <CardContent className="flex items-start gap-3">
              <LucideIcons.Info
                size="sm"
                className={
                  statusMessage.tone === "warn"
                    ? "mt-0.5 text-[#e16162]"
                    : "mt-0.5 text-[#f9bc60]"
                }
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#fffffe]">
                  {statusMessage.title}
                </p>
                <p className="text-sm text-[#abd1c6]">{statusMessage.body}</p>
                {!isAuthenticated && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={onAuthRequired}
                    className="h-auto px-0 text-[#f9bc60]"
                  >
                    Войти или зарегистрироваться
                    <LucideIcons.ArrowRight size="xs" />
                  </Button>
                )}
                {viewer.isAuthenticated && !viewer.canComment && (
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto px-0 text-[#f9bc60]"
                  >
                    <Link href="/applications">
                      Опубликовать историю
                      <LucideIcons.ArrowRight size="xs" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="darkGlass" padding="sm">
            <CommentComposer
              id="story-comment-input"
              text={text}
              placeholder="Напишите комментарий к истории…"
              submitting={submitting}
              cooldownLeft={cooldownLeft}
              canSubmit={canSubmitRoot}
              hasLink={rootDraft.hasLink}
              trimmedLength={rootDraft.trimmedLength}
              submitError={replyingTo ? null : submitError}
              onTextChange={setText}
              onSubmit={handleSubmitRoot}
            />
          </Card>
        )}

        {viewer.approvedApplications > 0 && !statusMessage && (
          <Badge variant="muted" className="font-normal">
            Одобрено заявок: {viewer.approvedApplications}
          </Badge>
        )}

        <Separator />

        {loading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Загрузка комментариев">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        ) : error ? (
          <p className="text-sm text-[#e16162]">{error}</p>
        ) : items.length === 0 ? (
          <Card variant="outline" padding="md" className="text-center">
            <p className="text-sm text-[#abd1c6]/80">
              Пока нет комментариев. Будьте первым, кто поддержит словом.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {actionError && (
              <p className="text-sm text-[#e16162]">{actionError}</p>
            )}
            {items.map((comment) => (
              <CommentThreadBlock
                key={comment.id}
                comment={comment}
                canReply={viewer.canComment}
                isAuthenticated={isAuthenticated}
                replyingTo={replyingTo}
                editingId={editingId}
                replyText={replyText}
                editText={editText}
                submitting={submitting}
                mutating={mutating}
                cooldownLeft={cooldownLeft}
                submitError={submitError}
                actionError={actionError}
                onAuthRequired={onAuthRequired}
                onStartReply={(target) => {
                  setReplyingTo(target);
                  setReplyText("");
                  handleCancelEdit();
                }}
                onCancelReply={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                onReplyTextChange={setReplyText}
                onSubmitReply={handleSubmitReply}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onEditTextChange={setEditText}
                onSaveEdit={handleSaveEdit}
                onDelete={handleDeleteComment}
                onToggleLike={toggleCommentLike}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
