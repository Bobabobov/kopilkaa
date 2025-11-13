// app/api/notifications/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const userId = session.uid;
    const notifications = [];

    // Получаем новые лайки (последние 20 для группировки)
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
    });

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
        });
      });

    // Получаем новые достижения
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
    });

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

