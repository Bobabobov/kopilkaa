import { prisma } from "@/lib/db";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { sanitizeNotificationTextSnippet } from "@/lib/stories/storyComments";
import { formatTimeAgo } from "@/lib/time";

export type StoryCommentNotificationItem = {
  id: string;
  type: "story_comment";
  title: string;
  message: string;
  avatar: string | null;
  createdAt: Date;
  timestamp: string;
  isRead: boolean;
  applicationId: string;
  storyCommentId: string;
};

/**
 * Уведомления автору истории о комментариях других участников.
 */
export async function fetchStoryCommentNotifications(
  storyOwnerId: string,
  take = 10,
): Promise<StoryCommentNotificationItem[]> {
  const recentComments = await prisma.storyComment
    .findMany({
      where: {
        parentId: null,
        userId: { not: storyOwnerId },
        application: {
          userId: storyOwnerId,
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        content: true,
        createdAt: true,
        applicationId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            hideEmail: true,
          },
        },
        application: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .catch(() => []);

  return recentComments.map((comment) => {
    const safeUser = sanitizeEmailForViewer(comment.user, storyOwnerId);
    const safeName = sanitizeNotificationTextSnippet(
      safeUser.name ||
        (safeUser.email ? safeUser.email.split("@")[0] : "Пользователь"),
      60,
    );
    const storyTitle = sanitizeNotificationTextSnippet(
      comment.application.title || "Без названия",
      120,
    );
    const preview = sanitizeNotificationTextSnippet(comment.content, 80);

    return {
      id: `story_comment_${comment.id}`,
      type: "story_comment",
      title: "Новый комментарий",
      message: `${safeName} оставил комментарий под вашей историей «${storyTitle}»: «${preview}»`,
      avatar: safeUser.avatar,
      createdAt: comment.createdAt,
      timestamp: formatTimeAgo(new Date(comment.createdAt)),
      isRead: false,
      applicationId: comment.applicationId,
      storyCommentId: comment.id,
    };
  });
}

export type StoryCommentReplyNotificationItem = StoryCommentNotificationItem;

/**
 * Уведомления автору комментария об ответах других участников.
 */
export async function fetchStoryCommentReplyNotifications(
  userId: string,
  take = 10,
): Promise<StoryCommentReplyNotificationItem[]> {
  const recentReplies = await prisma.storyComment
    .findMany({
      where: {
        parentId: { not: null },
        userId: { not: userId },
        parent: {
          userId,
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        content: true,
        createdAt: true,
        applicationId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            hideEmail: true,
          },
        },
        application: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .catch(() => []);

  return recentReplies.map((reply) => {
    const safeUser = sanitizeEmailForViewer(reply.user, userId);
    const safeName = sanitizeNotificationTextSnippet(
      safeUser.name ||
        (safeUser.email ? safeUser.email.split("@")[0] : "Пользователь"),
      60,
    );
    const storyTitle = sanitizeNotificationTextSnippet(
      reply.application.title || "Без названия",
      120,
    );
    const preview = sanitizeNotificationTextSnippet(reply.content, 80);

    return {
      id: `story_comment_reply_${reply.id}`,
      type: "story_comment",
      title: "Ответ на комментарий",
      message: `${safeName} ответил на ваш комментарий под историей «${storyTitle}»: «${preview}»`,
      avatar: safeUser.avatar,
      createdAt: reply.createdAt,
      timestamp: formatTimeAgo(new Date(reply.createdAt)),
      isRead: false,
      applicationId: reply.applicationId,
      storyCommentId: reply.id,
    };
  });
}
