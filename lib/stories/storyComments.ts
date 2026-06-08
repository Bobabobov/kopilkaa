import { ApplicationStatus, type Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

import { prisma } from "@/lib/db";
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";

/** Опасные управляющие символы (кроме перевода строки и табуляции). */
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
/** Bidi-override символы (Trojan Source / подмена отображения). */
const BIDI_OVERRIDE_RE = /[\u202A-\u202E\u2066-\u2069\u200E\u200F]/g;
const DANGEROUS_URL_SCHEME_RE = /(?:javascript|data|vbscript):/gi;

/** Явные URL, www, markdown-ссылки и популярные домены/сокращатели. */
const COMMENT_LINK_PATTERNS: RegExp[] = [
  /(?:https?|ftp):\/\/\S+/i,
  /\bwww\.\S+/i,
  /\[[^\]]+\]\([^)]+\)/,
  /(?:^|\s)(?:t\.me|vk\.com|vk\.cc|bit\.ly|goo\.gl|clck\.ru|youtu\.be)\/\S+/i,
  /\b[a-z0-9][a-z0-9-]*\.(?:com|ru|org|net|io|dev|app|me|su|online|site|link|shop|store|info|biz|pro|xyz)(?:\/\S*|\b)/i,
];

export const STORY_COMMENT_MIN_LENGTH = 2;
export const STORY_COMMENT_MAX_LENGTH = 1000;
export const STORY_COMMENT_NO_LINKS_ERROR = "Ссылки в комментариях запрещены";
/** Пауза между комментариями одного пользователя (см. User.lastCommentAt). */
export const STORY_COMMENT_COOLDOWN_MS = 30_000;
/** Максимальная глубина ветки (корень = 0, первый ответ = 1). */
export const STORY_COMMENT_MAX_DEPTH = 12;

const STORY_COMMENT_USER_SELECT = {
  id: true,
  name: true,
  username: true,
  avatar: true,
  avatarFrame: true,
  vkLink: true,
  telegramLink: true,
  youtubeLink: true,
  ...USER_PUBLIC_BADGE_SELECT,
} as const;

const STORY_COMMENT_SELECT = {
  id: true,
  parentId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: {
    select: STORY_COMMENT_USER_SELECT,
  },
  parent: {
    select: {
      id: true,
      userId: true,
      user: {
        select: STORY_COMMENT_USER_SELECT,
      },
    },
  },
  _count: {
    select: { likes: true },
  },
} satisfies Prisma.StoryCommentSelect;

export type StoryCommentRow = Prisma.StoryCommentGetPayload<{
  select: typeof STORY_COMMENT_SELECT;
}>;

export function isValidStoryId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export function isValidStoryCommentId(id: string): boolean {
  return isValidCuidLikeId(id);
}

export function parseStoryCommentParentId(raw: unknown): string | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return isValidStoryCommentId(trimmed) ? trimmed : null;
}

/**
 * Санитизация plain-text пользовательского ввода (defense-in-depth).
 * React JSX экранирует вывод, но сервер всё равно хранит только безопасный текст.
 */
export function sanitizePlainTextComment(raw: string): string {
  let text = sanitizeHtml(raw, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });

  text = text
    .replace(CONTROL_CHARS_RE, "")
    .replace(BIDI_OVERRIDE_RE, "")
    .replace(DANGEROUS_URL_SCHEME_RE, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  return text.trim();
}

/** Безопасный фрагмент для уведомлений (одна строка, без HTML). */
export function sanitizeNotificationTextSnippet(
  raw: string,
  maxLength: number,
): string {
  const flat = sanitizePlainTextComment(raw).replace(/\s+/g, " ").trim();
  if (flat.length <= maxLength) return flat;
  return `${flat.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function commentContainsLink(text: string): boolean {
  return COMMENT_LINK_PATTERNS.some((pattern) => pattern.test(text));
}

export type StoryCommentValidationResult =
  | { ok: true; content: string }
  | { ok: false; code: "invalid" | "links" };

export function validateStoryCommentContent(
  raw: unknown,
): StoryCommentValidationResult {
  if (typeof raw !== "string") return { ok: false, code: "invalid" };

  const sanitized = sanitizePlainTextComment(raw);
  if (sanitized.length < STORY_COMMENT_MIN_LENGTH) {
    return { ok: false, code: "invalid" };
  }
  if (sanitized.length > STORY_COMMENT_MAX_LENGTH) {
    return { ok: false, code: "invalid" };
  }
  if (commentContainsLink(sanitized)) {
    return { ok: false, code: "links" };
  }

  return { ok: true, content: sanitized };
}

export function normalizeStoryCommentContent(raw: unknown): string | null {
  const result = validateStoryCommentContent(raw);
  return result.ok ? result.content : null;
}

export async function countUserApprovedApplications(
  userId: string,
): Promise<number> {
  return prisma.application.count({
    where: {
      userId,
      status: ApplicationStatus.APPROVED,
    },
  });
}

export async function userCanCommentOnStories(userId: string): Promise<boolean> {
  const approved = await countUserApprovedApplications(userId);
  return approved > 0;
}

export function resolveStoryCommentPermissions(params: {
  isAdmin: boolean;
  approvedApplications: number;
  lastCommentAt: Date | null | undefined;
}): {
  canComment: boolean;
  cooldownSecondsRemaining: number | null;
} {
  if (params.isAdmin) {
    return {
      canComment: true,
      cooldownSecondsRemaining: null,
    };
  }

  const canComment = params.approvedApplications > 0;
  return {
    canComment,
    cooldownSecondsRemaining: canComment
      ? getCommentCooldownSecondsRemaining(params.lastCommentAt)
      : null,
  };
}

export function getCommentCooldownSecondsRemaining(
  lastCommentAt: Date | null | undefined,
  now = Date.now(),
): number | null {
  if (!lastCommentAt) return null;
  const elapsed = now - lastCommentAt.getTime();
  if (elapsed >= STORY_COMMENT_COOLDOWN_MS) return null;
  return Math.ceil((STORY_COMMENT_COOLDOWN_MS - elapsed) / 1000);
}

function mapStoryCommentUser(
  user: StoryCommentRow["user"],
  viewerId: string | null,
  userId: string,
) {
  const displayName =
    sanitizeNotificationTextSnippet(
      user.name?.trim() || user.username?.trim() || "Участник",
      80,
    ) || "Участник";

  return {
    id: user.id,
    name: displayName,
    username: user.username,
    avatar: user.avatar,
    avatarFrame: user.avatarFrame,
    vkLink: user.vkLink,
    telegramLink: user.telegramLink,
    youtubeLink: user.youtubeLink,
    markedAsDeceiver: user.markedAsDeceiver,
    isSelf: viewerId ? viewerId === userId : false,
  };
}

export function canManageStoryComment(params: {
  viewerId: string | null;
  commentUserId: string;
  isAdmin: boolean;
}): boolean {
  if (!params.viewerId) return false;
  if (params.isAdmin) return true;
  return params.viewerId === params.commentUserId;
}

export function isStoryCommentEdited(
  createdAt: Date,
  updatedAt: Date,
): boolean {
  return updatedAt.getTime() - createdAt.getTime() > 1000;
}

export async function fetchViewerLikedCommentIds(
  viewerId: string | null,
  commentIds: string[],
): Promise<Set<string>> {
  if (!viewerId || commentIds.length === 0) return new Set();

  const rows = await prisma.storyCommentLike.findMany({
    where: {
      userId: viewerId,
      commentId: { in: commentIds },
    },
    select: { commentId: true },
  });

  return new Set(rows.map((row) => row.commentId));
}

export function mapStoryComment(
  row: StoryCommentRow,
  viewerId: string | null,
  isAdmin = false,
  likedCommentIds: Set<string> = new Set(),
) {
  const replyTo =
    row.parent && row.parentId
      ? {
          commentId: row.parent.id,
          user: mapStoryCommentUser(row.parent.user, viewerId, row.parent.userId),
        }
      : null;

  const canManage = canManageStoryComment({
    viewerId,
    commentUserId: row.userId,
    isAdmin,
  });

  return {
    id: row.id,
    parentId: row.parentId,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    isEdited: isStoryCommentEdited(row.createdAt, row.updatedAt),
    canEdit: canManage,
    canDelete: canManage,
    likeCount: row._count.likes,
    isLiked: likedCommentIds.has(row.id),
    replyTo,
    user: mapStoryCommentUser(row.user, viewerId, row.userId),
  };
}

export type MappedStoryComment = ReturnType<typeof mapStoryComment>;

export type StoryCommentThread = MappedStoryComment & {
  replies: StoryCommentThread[];
};

export function compareStoryCommentsByRank<
  T extends { likeCount?: number; createdAt: string },
>(a: T, b: T): number {
  const likeDiff = (b.likeCount ?? 0) - (a.likeCount ?? 0);
  if (likeDiff !== 0) return likeDiff;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function sortStoryCommentReplies<T extends StoryCommentThread>(
  node: T,
): T {
  const sortedReplies = [...node.replies]
    .sort(compareStoryCommentsByRank)
    .map((reply) => sortStoryCommentReplies(reply));

  return { ...node, replies: sortedReplies };
}

export function sortStoryCommentThreads(
  threads: StoryCommentThread[],
  rootIdsOrder?: string[],
): StoryCommentThread[] {
  const sorted = threads.map((thread) => sortStoryCommentReplies(thread));

  if (rootIdsOrder?.length) {
    return [...sorted].sort(
      (a, b) => rootIdsOrder.indexOf(a.id) - rootIdsOrder.indexOf(b.id),
    );
  }

  return [...sorted].sort(compareStoryCommentsByRank);
}

export function buildStoryCommentThreads(
  rows: StoryCommentRow[],
  viewerId: string | null,
  rootIdsOrder?: string[],
  isAdmin = false,
  likedCommentIds: Set<string> = new Set(),
): StoryCommentThread[] {
  const nodes = new Map<string, StoryCommentThread>();

  for (const row of rows) {
    nodes.set(row.id, {
      ...mapStoryComment(row, viewerId, isAdmin, likedCommentIds),
      replies: [],
    });
  }

  const roots: StoryCommentThread[] = [];

  for (const node of nodes.values()) {
    if (!node.parentId) {
      roots.push(node);
      continue;
    }

    const parent = nodes.get(node.parentId);
    if (parent) {
      parent.replies.push(node);
    }
  }

  return sortStoryCommentThreads(roots, rootIdsOrder);
}

/** Загружает корневые комментарии и все ответы в их ветках. */
export async function fetchStoryCommentThreadRows(
  storyId: string,
  rootIds: string[],
): Promise<StoryCommentRow[]> {
  if (rootIds.length === 0) return [];

  const collected = new Map<string, StoryCommentRow>();
  const roots = await prisma.storyComment.findMany({
    where: { applicationId: storyId, id: { in: rootIds } },
    select: STORY_COMMENT_SELECT,
  });

  for (const row of roots) {
    collected.set(row.id, row);
  }

  let frontier = [...rootIds];

  while (frontier.length > 0) {
    const children = await prisma.storyComment.findMany({
      where: {
        applicationId: storyId,
        parentId: { in: frontier },
      },
      orderBy: { createdAt: "desc" },
      select: STORY_COMMENT_SELECT,
    });

    if (children.length === 0) break;

    frontier = [];
    for (const child of children) {
      if (collected.has(child.id)) continue;
      collected.set(child.id, child);
      frontier.push(child.id);
    }
  }

  return Array.from(collected.values());
}

export async function getStoryCommentDepth(
  parentId: string,
): Promise<number> {
  let depth = 0;
  let currentId: string | null = parentId;

  while (currentId) {
    depth += 1;
    const parent: { parentId: string | null } | null =
      await prisma.storyComment.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });
    if (!parent) break;
    currentId = parent.parentId;
  }

  return depth;
}

export { STORY_COMMENT_SELECT };
