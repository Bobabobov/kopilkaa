// app/api/notifications/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "только что";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "минуту" : diffInMinutes < 5 ? "минуты" : "минут"} назад`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "час" : diffInHours < 5 ? "часа" : "часов"} назад`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "день" : diffInDays < 5 ? "дня" : "дней"} назад`;
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const userId = session.uid;
    // Явно указываем тип, чтобы TypeScript не ругался на implicit any[]
    const notifications: any[] = [];

    // Получаем новые лайки (последние 20 для группировки) с обработкой ошибок
    const recentLikes = await prisma.storyLike.findMany({
      where: { 
        application: {
          userId: userId
        }
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
          },
        },
        application: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }).catch(() => []);

    // Группируем лайки по пользователю и истории (только последний лайк от каждого)
    const groupedLikes = new Map();
    recentLikes.forEach((like) => {
      const key = `${like.userId}_${like.applicationId}`;
      if (!groupedLikes.has(key) || groupedLikes.get(key).createdAt < like.createdAt) {
        groupedLikes.set(key, like);
      }
    });

    // Добавляем только уникальные лайки как уведомления (берем последние 10)
    Array.from(groupedLikes.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .forEach((like) => {
        notifications.push({
          id: `like_${like.userId}_${like.applicationId}`,
          type: "like",
          title: "Новый лайк",
          message: `${like.user.name || like.user.email.split("@")[0]} лайкнул вашу историю "${like.application.title}"`,
          avatar: like.user.avatar,
          createdAt: like.createdAt,
          timestamp: formatTimeAgo(new Date(like.createdAt)),
          isRead: false,
          applicationId: like.applicationId,
        });
      });

    // Получаем новые достижения с обработкой ошибок
    const recentAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
      take: 5,
      include: {
        achievement: {
          select: {
            name: true,
            description: true,
            rarity: true,
          },
        },
      },
    }).catch(() => []);

    // Добавляем достижения как уведомления
    recentAchievements.forEach((achievement) => {
      notifications.push({
        id: `achievement_${achievement.id}`,
        type: "achievement",
        title: "Получено достижение",
        message: `Вы получили достижение "${achievement.achievement.name}"`,
        avatar: null,
        createdAt: achievement.unlockedAt,
        timestamp: formatTimeAgo(new Date(achievement.unlockedAt)),
        isRead: false,
        rarity: achievement.achievement.rarity,
      });
    });

    // Получаем входящие заявки в друзья
    const pendingFriendRequests = await prisma.friendship.findMany({
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
          },
        },
      },
    }).catch(() => []);

    pendingFriendRequests.forEach((request) => {
      const requester = request.requester;
      const displayName = requester.name || requester.email.split("@")[0];

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

    const statusChangedApplications = await prisma.application.findMany({
      where: {
        userId: userId,
        status: {
          in: ["APPROVED", "REJECTED"],
        },
        updatedAt: {
          gte: sevenDaysAgo, // Только недавно измененные
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
    }).catch(() => []);

    // Добавляем уведомления о статусе заявок
    // Показываем все одобренные/отклоненные заявки, обновленные за последние 7 дней
    statusChangedApplications.forEach((application) => {
      const statusText = application.status === "APPROVED" ? "одобрена" : "отклонена";
      const statusEmoji = application.status === "APPROVED" ? "✅" : "❌";
      
      notifications.push({
        id: `application_${application.id}_${application.status}`,
        type: "application_status",
        title: `Заявка ${statusText}`,
        message: `${statusEmoji} Ваша заявка "${application.title || "Без названия"}" была ${statusText}${application.adminComment ? `. ${application.adminComment}` : ""}`,
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
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Берем только последние 20
    const recentNotifications = notifications.slice(0, 20);

    return NextResponse.json({
      success: true,
      notifications: recentNotifications,
      unreadCount: recentNotifications.length, // Пока что все считаем непрочитанными
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { message: "Ошибка получения уведомлений" },
      { status: 500 }
    );
  }
}

