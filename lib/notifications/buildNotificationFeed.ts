import { prisma } from "@/lib/db";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { formatTimeAgo } from "@/lib/time";
import {
  fetchStoryCommentNotifications,
  fetchStoryCommentReplyNotifications,
} from "@/lib/notifications/storyCommentNotifications";
import {
  STORY_REACTION_META,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import {
  fetchPendingStatusModalRow,
  fetchUserStatusNotifications,
} from "@/lib/notifications/userNotificationService";
import { mapUserNotificationRow } from "@/lib/notifications/userNotificationTypes";
import type { Notification } from "@/components/notifications/types";

export type NotificationFeedResult = {
  notifications: Notification[];
  pendingStatusModal: Notification | null;
};

export async function buildNotificationFeed(
  userId: string,
): Promise<NotificationFeedResult> {
  const ephemeral: Notification[] = [];

  const recentLikes = await prisma.storyLike
    .findMany({
      where: { application: { userId } },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            hideEmail: true,
          },
        },
        application: { select: { id: true, title: true } },
      },
    })
    .catch(() => []);

  const groupedLikes = new Map<string, (typeof recentLikes)[number]>();
  recentLikes.forEach((like) => {
    const key = `${like.userId}_${like.applicationId}`;
    const existing = groupedLikes.get(key);
    if (!existing || existing.createdAt < like.createdAt) {
      groupedLikes.set(key, like);
    }
  });

  Array.from(groupedLikes.values())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10)
    .forEach((like) => {
      const safeUser = sanitizeEmailForViewer(like.user, userId);
      const safeName =
        safeUser.name ||
        (safeUser.email ? safeUser.email.split("@")[0] : "Пользователь");
      const reactionMeta =
        STORY_REACTION_META[like.type as StoryReactionType] ||
        STORY_REACTION_META.HEART;

      ephemeral.push({
        id: `like_${like.userId}_${like.applicationId}`,
        type: "like",
        title: "Новая реакция",
        message: `${safeName} оставил реакцию «${reactionMeta.label}» на вашу историю «${like.application.title}»`,
        avatar: safeUser.avatar,
        createdAt: like.createdAt.toISOString(),
        timestamp: formatTimeAgo(new Date(like.createdAt)),
        isRead: false,
        applicationId: like.applicationId,
      });
    });

  const [storyCommentNotifications, storyCommentReplyNotifications] =
    await Promise.all([
      fetchStoryCommentNotifications(userId, 10),
      fetchStoryCommentReplyNotifications(userId, 10),
    ]);

  for (const item of [
    ...storyCommentNotifications,
    ...storyCommentReplyNotifications,
  ]) {
    ephemeral.push({
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      avatar: item.avatar,
      createdAt:
        item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : String(item.createdAt),
      timestamp: item.timestamp,
      isRead: item.isRead,
      applicationId: item.applicationId,
      storyCommentId: item.storyCommentId,
    });
  }

  const pendingFriendRequests = await prisma.friendship
    .findMany({
      where: { receiverId: userId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            hideEmail: true,
          },
        },
      },
    })
    .catch(() => []);

  pendingFriendRequests.forEach((request) => {
    const requester = sanitizeEmailForViewer(request.requester, userId);
    const displayName =
      requester.name ||
      (requester.email ? requester.email.split("@")[0] : "Пользователь");

    ephemeral.push({
      id: `friend_request_${request.id}`,
      type: "friend_request",
      title: "Новая заявка в друзья",
      message: `${displayName} хочет добавить вас в друзья`,
      avatar: requester.avatar,
      createdAt: request.createdAt.toISOString(),
      timestamp: formatTimeAgo(new Date(request.createdAt)),
      isRead: false,
      requesterId: requester.id,
      friendshipId: request.id,
    });
  });

  const statusRows = await fetchUserStatusNotifications(userId);
  const statusNotifications = statusRows.map((row) =>
    mapUserNotificationRow(row),
  );

  const notifications = [...ephemeral, ...statusNotifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 30);

  const pendingRow = await fetchPendingStatusModalRow(userId);
  const pendingStatusModal = pendingRow
    ? mapUserNotificationRow({
        ...pendingRow,
        timestamp: formatTimeAgo(pendingRow.updatedAt),
      })
    : null;

  return { notifications, pendingStatusModal };
}
