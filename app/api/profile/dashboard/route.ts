import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Объединенный API для загрузки всех данных профиля за один запрос
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.uid;

    // Параллельно загружаем все необходимые данные с обработкой ошибок
    const [
      user,
      friendsData,
      receivedRequestsData,
      achievements,
      applications,
      gameRecord,
      notifications
    ] = await Promise.all([
      // Основные данные пользователя
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          avatar: true,
          vkLink: true,
          telegramLink: true,
          youtubeLink: true,
          headerTheme: true,
          avatarFrame: true,
          hideEmail: true,
          createdAt: true,
          lastSeen: true,
        },
      }).catch(() => null),

      // Друзья с полной информацией
      prisma.friendship.findMany({
        where: {
          OR: [
            { requesterId: userId, status: "ACCEPTED" },
            { receiverId: userId, status: "ACCEPTED" },
          ],
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              avatarFrame: true,
              headerTheme: true,
              hideEmail: true,
              vkLink: true,
              telegramLink: true,
              youtubeLink: true,
              createdAt: true,
              lastSeen: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              avatarFrame: true,
              headerTheme: true,
              hideEmail: true,
              vkLink: true,
              telegramLink: true,
              youtubeLink: true,
              createdAt: true,
              lastSeen: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }).catch(() => []),

      // Входящие заявки в друзья
      prisma.friendship.findMany({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              avatarFrame: true,
              headerTheme: true,
              hideEmail: true,
              vkLink: true,
              telegramLink: true,
              youtubeLink: true,
              createdAt: true,
              lastSeen: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }).catch(() => []),

      // Достижения пользователя
      prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true,
        },
        orderBy: { unlockedAt: "desc" },
        take: 5, // Показываем только последние 5
      }).catch(() => []),

      // Статистика заявок
      prisma.application.findMany({
        where: { userId },
        select: {
          id: true,
          status: true,
          amount: true,
        },
      }).catch(() => []),

      // Игровые рекорды
      prisma.gameRecord.findFirst({
        where: { userId },
        select: {
          attempts: true,
          bestScore: true,
        },
      }).catch(() => null),

      // Уведомления
      prisma.storyLike.findMany({
        where: {
          application: {
            userId: userId,
          },
        },
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
        orderBy: { createdAt: "desc" },
        take: 10, // Последние 10 уведомлений
      }).catch(() => []),
    ]);

    if (!user) {
      // Если пользователь не найден, возвращаем пустые данные вместо ошибки
      return NextResponse.json({
        user: null,
        friends: [],
        receivedRequests: [],
        achievements: [],
        stats: {
          totalApplications: 0,
          approvedApplications: 0,
          pendingApplications: 0,
          rejectedApplications: 0,
          totalAmountRequested: 0,
          approvedAmount: 0,
          friendsCount: 0,
          receivedRequestsCount: 0,
          achievementsCount: 0,
          gamesPlayed: 0,
          bestScore: 0,
        },
        notifications: [],
      });
    }

    // Подсчитываем статистику
    const stats = {
      totalApplications: applications.length,
      approvedApplications: applications.filter(app => app.status === "APPROVED").length,
      pendingApplications: applications.filter(app => app.status === "PENDING").length,
      rejectedApplications: applications.filter(app => app.status === "REJECTED").length,
      totalAmountRequested: applications.reduce((sum, app) => sum + (app.amount || 0), 0),
      approvedAmount: applications
        .filter(app => app.status === "APPROVED")
        .reduce((sum, app) => sum + (app.amount || 0), 0),
      friendsCount: friendsData.length,
      pendingFriendRequests: receivedRequestsData.length,
      achievementsCount: achievements.length,
      gameAttempts: gameRecord?.attempts || 0,
      bestGameScore: gameRecord?.bestScore || 0,
    };

    // Форматируем друзей
    const friends = friendsData.map(friendship => ({
      id: friendship.id,
      status: friendship.status,
      createdAt: friendship.createdAt,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      requester: friendship.requester,
      receiver: friendship.receiver,
    }));

    // Форматируем уведомления 
    const formattedNotifications = notifications.map(like => ({
      id: like.id,
      type: 'like',
      user: like.user,
      application: like.application,
      createdAt: like.createdAt,
      timestamp: getTimeAgo(like.createdAt),
    }));

    const response = NextResponse.json({
      user,
      friends,
      receivedRequests: receivedRequestsData,
      achievements: achievements.map(ua => ({
        id: ua.id,
        unlockedAt: ua.unlockedAt,
        grantedBy: ua.grantedBy,
        grantedByName: ua.grantedByName,
        achievement: ua.achievement,
      })),
      stats,
      notifications: formattedNotifications,
    });

    // Добавляем заголовки кэширования
    response.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
    response.headers.set("ETag", `profile-${userId}-${Date.now()}`);

    return response;
  } catch (error) {
    console.error("Error fetching profile dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для форматирования времени
function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "только что";
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return past.toLocaleDateString("ru-RU");
}
