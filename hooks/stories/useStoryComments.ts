"use client";

import { useCallback, useEffect, useState } from "react";

import { getMessageFromApiJson, logRouteCatchError } from "@/lib/api/parseApiError";
import { sortStoryCommentThreads } from "@/lib/stories/storyComments";

export interface StoryCommentUser {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  avatarFrame: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  markedAsDeceiver?: boolean;
  isSelf: boolean;
}

export interface StoryCommentReplyTarget {
  commentId: string;
  user: StoryCommentUser;
}

export interface StoryCommentItem {
  id: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  likeCount?: number;
  isLiked?: boolean;
  replyTo: StoryCommentReplyTarget | null;
  user: StoryCommentUser;
  replies?: StoryCommentItem[];
}

export interface StoryCommentsViewer {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  canComment: boolean;
  approvedApplications: number;
  cooldownSecondsRemaining: number | null;
}

interface StoryCommentsResponse {
  items: StoryCommentItem[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  viewer: StoryCommentsViewer;
}

const EMPTY_VIEWER: StoryCommentsViewer = {
  isAuthenticated: false,
  canComment: false,
  approvedApplications: 0,
  cooldownSecondsRemaining: null,
};

function countCommentSubtree(comment: StoryCommentItem): number {
  const replies = comment.replies ?? [];
  return 1 + replies.reduce((sum, reply) => sum + countCommentSubtree(reply), 0);
}

function insertReplyIntoThread(
  node: StoryCommentItem,
  comment: StoryCommentItem,
): StoryCommentItem {
  if (node.id === comment.parentId) {
    return {
      ...node,
      replies: [...(node.replies ?? []), { ...comment, replies: [] }],
    };
  }

  if (!node.replies?.length) return node;

  return {
    ...node,
    replies: node.replies.map((child) => insertReplyIntoThread(child, comment)),
  };
}

function appendComment(
  items: StoryCommentItem[],
  comment: StoryCommentItem,
): StoryCommentItem[] {
  const next = !comment.parentId
    ? [...items, { ...comment, replies: comment.replies ?? [] }]
    : items.map((item) => insertReplyIntoThread(item, comment));

  return sortStoryCommentThreads(next);
}

function updateLikeInTree(
  items: StoryCommentItem[],
  commentId: string,
  likeCount: number,
  isLiked: boolean,
): StoryCommentItem[] {
  return items.map((item) => {
    if (item.id === commentId) {
      return { ...item, likeCount, isLiked };
    }

    if (!item.replies?.length) return item;

    return {
      ...item,
      replies: updateLikeInTree(item.replies, commentId, likeCount, isLiked),
    };
  });
}

function removeCommentFromTree(
  items: StoryCommentItem[],
  commentId: string,
): { items: StoryCommentItem[]; removed: number } {
  let removed = 0;

  const nextItems = items
    .filter((item) => {
      if (item.id === commentId) {
        removed = countCommentSubtree(item);
        return false;
      }
      return true;
    })
    .map((item) => {
      if (!item.replies?.length) return item;

      const { items: replies, removed: nestedRemoved } = removeCommentFromTree(
        item.replies,
        commentId,
      );
      removed += nestedRemoved;
      return { ...item, replies };
    });

  return { items: nextItems, removed };
}

function updateCommentInTree(
  items: StoryCommentItem[],
  commentId: string,
  patch: Partial<StoryCommentItem>,
): StoryCommentItem[] {
  return items.map((item) => {
    if (item.id === commentId) {
      return { ...item, ...patch };
    }

    if (!item.replies?.length) return item;

    return {
      ...item,
      replies: updateCommentInTree(item.replies, commentId, patch),
    };
  });
}

export function useStoryComments(storyId: string) {
  const [items, setItems] = useState<StoryCommentItem[]>([]);
  const [viewer, setViewer] = useState<StoryCommentsViewer>(EMPTY_VIEWER);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!storyId || storyId === "ad") return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/stories/${storyId}/comments`, {
        cache: "no-store",
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(getMessageFromApiJson(json, "Не удалось загрузить комментарии"));
        return;
      }

      const data = json as StoryCommentsResponse;
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setViewer(data.viewer ?? EMPTY_VIEWER);
    } catch (err) {
      logRouteCatchError("[useStoryComments] fetchComments", err);
      setError("Не удалось загрузить комментарии");
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = useCallback(
    async (content: string, parentId?: string | null) => {
      if (!storyId || storyId === "ad") return false;

      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await fetch(`/api/stories/${storyId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            ...(parentId ? { parentId } : {}),
          }),
        });
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setSubmitError(
            getMessageFromApiJson(json, "Не удалось отправить комментарий"),
          );
          if (
            res.status === 429 &&
            json &&
            typeof json === "object" &&
            "cooldownSecondsRemaining" in json &&
            typeof json.cooldownSecondsRemaining === "number"
          ) {
            setViewer((prev) => ({
              ...prev,
              cooldownSecondsRemaining: json.cooldownSecondsRemaining,
            }));
          }
          return false;
        }

        const data = json as {
          data?: { comment?: StoryCommentItem };
          viewer?: StoryCommentsViewer;
        };

        if (data.data?.comment) {
          const created = {
            ...data.data.comment,
            likeCount: data.data.comment.likeCount ?? 0,
            isLiked: data.data.comment.isLiked ?? false,
            replies: data.data.comment.replies ?? [],
          };
          setItems((prev) => appendComment(prev, created));
          setTotal((prev) => prev + 1);
        }

        if (data.viewer) {
          setViewer(data.viewer);
        }

        return true;
      } catch (err) {
        logRouteCatchError("[useStoryComments] submitComment", err);
        setSubmitError("Не удалось отправить комментарий");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [storyId],
  );

  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      if (!storyId || storyId === "ad") return false;

      setMutating(true);
      setActionError(null);

      try {
        const res = await fetch(
          `/api/stories/${storyId}/comments/${commentId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          },
        );
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setActionError(
            getMessageFromApiJson(json, "Не удалось сохранить комментарий"),
          );
          return false;
        }

        const data = json as { data?: { comment?: StoryCommentItem } };
        if (data.data?.comment) {
          const updated = data.data.comment;
          setItems((prev) =>
            updateCommentInTree(prev, commentId, {
              content: updated.content,
              updatedAt: updated.updatedAt,
              isEdited: updated.isEdited,
            }),
          );
        }

        return true;
      } catch (err) {
        logRouteCatchError("[useStoryComments] updateComment", err);
        setActionError("Не удалось сохранить комментарий");
        return false;
      } finally {
        setMutating(false);
      }
    },
    [storyId],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!storyId || storyId === "ad") return false;

      setMutating(true);
      setActionError(null);

      try {
        const res = await fetch(
          `/api/stories/${storyId}/comments/${commentId}`,
          { method: "DELETE" },
        );
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setActionError(
            getMessageFromApiJson(json, "Не удалось удалить комментарий"),
          );
          return false;
        }

        setItems((prev) => {
          const { items: nextItems, removed } = removeCommentFromTree(
            prev,
            commentId,
          );
          if (removed > 0) {
            setTotal((current) => Math.max(0, current - removed));
          }
          return nextItems;
        });

        return true;
      } catch (err) {
        logRouteCatchError("[useStoryComments] deleteComment", err);
        setActionError("Не удалось удалить комментарий");
        return false;
      } finally {
        setMutating(false);
      }
    },
    [storyId],
  );

  const toggleCommentLike = useCallback(
    async (commentId: string) => {
      if (!storyId || storyId === "ad") return false;

      setMutating(true);
      setActionError(null);

      try {
        const res = await fetch(
          `/api/stories/${storyId}/comments/${commentId}/like`,
          { method: "POST" },
        );
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setActionError(
            getMessageFromApiJson(json, "Не удалось поставить лайк"),
          );
          return false;
        }

        const data = json as {
          data?: { likeCount?: number; isLiked?: boolean };
        };

        if (data.data) {
          setItems((prev) => {
            const updated = updateLikeInTree(
              prev,
              commentId,
              data.data!.likeCount ?? 0,
              Boolean(data.data!.isLiked),
            );
            return sortStoryCommentThreads(updated);
          });
        }

        return true;
      } catch (err) {
        logRouteCatchError("[useStoryComments] toggleCommentLike", err);
        setActionError("Не удалось поставить лайк");
        return false;
      } finally {
        setMutating(false);
      }
    },
    [storyId],
  );

  return {
    items,
    total,
    viewer,
    loading,
    submitting,
    mutating,
    error,
    submitError,
    actionError,
    refetch: fetchComments,
    submitComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
  };
}
