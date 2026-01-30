// app/api/notifications/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTimeAgo } from "@/lib/time";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = session.uid;
    type NotificationItem = {
      id: string;
      type: string;
      title: string;
      message: string;
      avatar?: string | null;
      createdAt: Date;
      timestamp: string;
      isRead: boolean;
      applicationId?: string;
      friendshipId?: string;
      requesterId?: string;
      adminComment?: string | null;
      status?: string;
    };
    const notifications: NotificationItem[] = [];

    // Получаем новые лайки (последние 20 для группировки) с обработкой ошибок
    const recentLikes = await prisma.storyLike
      .findMany({
        where: {
          application: {
            userId: userId,
          },
        },
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
          application: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })
      .catch(() => []);

    // Группируем лайки по пользователю и истории (только последний лайк от каждого)
    const groupedLikes = new Map();
    recentLikes.forEach((like) => {
      const key = `${like.userId}_${like.applicationId}`;
      if (
        !groupedLikes.has(key) ||
        groupedLikes.get(key).createdAt < like.createdAt
      ) {
        groupedLikes.set(key, like);
      }
    });

    // Добавляем только уникальные лайки как уведомления (берем последние 10)
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

        notifications.push({
          id: `like_${like.userId}_${like.applicationId}`,
          type: "like",
          title: "Новый лайк",
          message: `${safeName} лайкнул вашу историю "${like.application.title}"`,
          avatar: safeUser.avatar,
          createdAt: like.createdAt,
          timestamp: formatTimeAgo(new Date(like.createdAt)),
          isRead: false,
          applicationId: like.applicationId,
        });
      });

    // Получаем входящие заявки в друзья
    const pendingFriendRequests = await prisma.friendship
      .findMany({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
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
      const requester = sanitizeEmailForViewer(
        request.requester as any,
        userId,
      );
      const displayName =
        requester.name ||
        (requester.email ? requester.email.split("@")[0] : "Пользователь");

      notifications.push({
        id: `friend_request_${request.id}`,
        type: "friend_request",
        title: "Новая заявка в друзья",
        message: `${displayName} хочет добавить вас в друзья`,
        avatar: requester.avatar,
        createdAt: request.createdAt,
        timestamp: formatTimeAgo(new Date(request.createdAt)),
        isRead: false,
        requesterId: requester.id,
        friendshipId: request.id,
      });
    });

    // Получаем заявки с измененным статусом (одобренные или отклоненные)
    // Показываем только те, где статус изменился недавно (за последние 7 дней)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const statusChangedApplications = await prisma.application
      .findMany({
        where: {
          userId: userId,
          status: {
            in: ["APPROVED", "REJECTED", "CONTEST"],
          },
          updatedAt: {
            gte: sevenDaysAgo,
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          status: true,
          adminComment: true,
          updatedAt: true,
          createdAt: true,
        },
      })
      .catch(() => []);

    statusChangedApplications.forEach((application) => {
      let statusText: string;
      let statusEmoji: string;
      let title: string;
      let message: string;

      if (application.status === "APPROVED") {
        statusText = "одобрена";
        statusEmoji = "✅";
        title = "Заявка одобрена";
        message = `${statusEmoji} Ваша заявка "${application.title || "Без названия"}" была одобрена.`;
      } else if (application.status === "REJECTED") {
        statusText = "отклонена";
        statusEmoji = "❌";
        title = "Заявка отклонена";
        message = `${statusEmoji} Ваша заявка "${application.title || "Без названия"}" была отклонена.`;
      } else {
        title = "Вы участвуете в конкурсе";
        message = `🏆 Ваша заявка «${application.title || "Без названия"}» принята в конкурс. Мы рассмотрим её и свяжемся с вами.`;
      }

      notifications.push({
        id: `application_${application.id}_${application.status}`,
        type: "application_status",
        title,
        message,
        adminComment: application.adminComment ?? null,
        avatar: null,
        createdAt: application.updatedAt,
        timestamp: formatTimeAgo(new Date(application.updatedAt)),
        isRead: false,
        applicationId: application.id,
        status: application.status,
      });
    });

    // Сортируем все уведомления по дате
    notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Берем только последние 20
    const recentNotifications = notifications.slice(0, 20);

    return NextResponse.json(
      {
        success: true,
        notifications: recentNotifications,
        unreadCount: recentNotifications.length, // Пока что все считаем непрочитанными
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { message: "Ошибка получения уведомлений" },
      { status: 500 },
    );
  }
}
