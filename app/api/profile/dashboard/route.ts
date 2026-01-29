import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createHash } from "crypto";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgeForUser, getHeroBadgesForUsers } from "@/lib/heroBadges";
import { computeUserTrustSnapshot } from "@/lib/trust/computeTrustSnapshot";

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
      notifications,
    ] = await Promise.all([
      // Основные данные пользователя
      prisma.user
        .findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            username: true,
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
        })
        .catch(() => null),

      // Друзья с полной информацией
      prisma.friendship
        .findMany({
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
                username: true,
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
                username: true,
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
        })
        .catch(() => []),

      // Входящие заявки в друзья
      prisma.friendship
        .findMany({
          where: {
            receiverId: userId,
            status: "PENDING",
          },
          include: {
            requester: {
              select: {
                id: true,
                username: true,
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
        })
        .catch(() => []),

      // Достижения пользователя
      prisma.userAchievement
        .findMany({
          where: { userId },
          include: {
            achievement: true,
          },
          orderBy: { unlockedAt: "desc" },
          take: 5, // Показываем только последние 5
        })
        .catch(() => []),

      // Статистика заявок
      prisma.application
        .findMany({
          where: { userId },
          select: {
            id: true,
            status: true,
            amount: true,
            countTowardsTrust: true,
          },
        })
        .catch(() => []),

      // Уведомления
      prisma.storyLike
        .findMany({
          where: {
            application: {
              userId: userId,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
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
          orderBy: { createdAt: "desc" },
          take: 10, // Последние 10 уведомлений
        })
        .catch(() => []),
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
          effectiveApprovedApplications: 0,
          pendingApplications: 0,
          rejectedApplications: 0,
          totalAmountRequested: 0,
          approvedAmount: 0,
          friendsCount: 0,
          pendingFriendRequests: 0,
          achievementsCount: 0,
        },
        notifications: [],
      });
    }

    // Бейдж статуса размещения в «Героях» (оплата цифровой услуги)
    const heroBadge = await getHeroBadgeForUser(userId);
    const userWithBadges = { ...(user as any), heroBadge };

    // Бейджи для списков (друзья/заявки/уведомления)
    const listUserIds = Array.from(
      new Set<string>([
        ...friendsData.flatMap((f: any) => [f.requesterId, f.receiverId]),
        ...receivedRequestsData.map((r: any) => r?.requesterId).filter(Boolean),
        ...notifications.map((n: any) => n?.userId).filter(Boolean),
      ]),
    );
    const listBadgeMap = await getHeroBadgesForUsers(listUserIds);

    // Подсчитываем статистику
    const stats = {
      totalApplications: applications.length,
      approvedApplications: applications.filter(
        (app) => app.status === "APPROVED",
      ).length,
      effectiveApprovedApplications: applications.filter(
        (app) => app.status === "APPROVED" && app.countTowardsTrust === true,
      ).length,
      pendingApplications: applications.filter(
        (app) => app.status === "PENDING",
      ).length,
      rejectedApplications: applications.filter(
        (app) => app.status === "REJECTED",
      ).length,
      totalAmountRequested: applications.reduce(
        (sum, app) => sum + (app.amount || 0),
        0,
      ),
      approvedAmount: applications
        .filter((app) => app.status === "APPROVED")
        .reduce((sum, app) => sum + (app.amount || 0), 0),
      friendsCount: friendsData.length,
      pendingFriendRequests: receivedRequestsData.length,
      achievementsCount: achievements.length,
    };
    const trust = await computeUserTrustSnapshot(userId);

    // Форматируем друзей
    const friends = friendsData.map((friendship) => ({
      id: friendship.id,
      status: friendship.status,
      createdAt: friendship.createdAt,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      requester: sanitizeEmailForViewer(
        {
          ...(friendship.requester as any),
          heroBadge: listBadgeMap[friendship.requesterId] ?? null,
        },
        userId,
      ),
      receiver: sanitizeEmailForViewer(
        {
          ...(friendship.receiver as any),
          heroBadge: listBadgeMap[friendship.receiverId] ?? null,
        },
        userId,
      ),
    }));

    // Форматируем уведомления
    const formattedNotifications = notifications.map((like) => ({
      id: like.id,
      type: "like",
      user: sanitizeEmailForViewer(
        { ...(like.user as any), heroBadge: listBadgeMap[like.userId] ?? null },
        userId,
      ),
      application: like.application,
      createdAt: like.createdAt,
      timestamp: getTimeAgo(like.createdAt),
    }));

    // Стабильный ETag: зависит от реально важных кусочков данных (а не от Date.now()).
    // Это нужно, чтобы браузер/клиент могли получать 304 Not Modified и не грузить всё заново.
    const etagPayload = {
      userId,
      user: {
        name: user.name ?? "",
        username: user.username ?? "",
        avatar: user.avatar ?? "",
        headerTheme: user.headerTheme ?? "",
        avatarFrame: user.avatarFrame ?? "",
        hideEmail: Boolean(user.hideEmail),
        lastSeen: user.lastSeen ? new Date(user.lastSeen).getTime() : 0,
        heroBadge: heroBadge ?? "",
      },
      stats,
      trust,
      latest: {
        friend: friendsData[0]?.createdAt
          ? new Date(friendsData[0].createdAt).getTime()
          : 0,
        request: receivedRequestsData[0]?.createdAt
          ? new Date(receivedRequestsData[0].createdAt).getTime()
          : 0,
        achievement: achievements[0]?.unlockedAt
          ? new Date(achievements[0].unlockedAt).getTime()
          : 0,
        notification: notifications[0]?.createdAt
          ? new Date(notifications[0].createdAt).getTime()
          : 0,
      },
    };
    const etag = `"${createHash("sha1").update(JSON.stringify(etagPayload)).digest("hex")}"`;
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && ifNoneMatch === etag) {
      const notModified = new NextResponse(null, { status: 304 });
      notModified.headers.set(
        "Cache-Control",
        "private, max-age=30, stale-while-revalidate=60",
      );
      notModified.headers.set("ETag", etag);
      return notModified;
    }

    const response = NextResponse.json({
      user: userWithBadges,
      friends,
      receivedRequests: receivedRequestsData.map((req: any) => ({
        ...req,
        requester: req.requester
          ? sanitizeEmailForViewer(
              {
                ...(req.requester as any),
                heroBadge: listBadgeMap[req.requesterId] ?? null,
              },
              userId,
            )
          : req.requester,
      })),
      achievements: achievements.map((ua) => ({
        id: ua.id,
        unlockedAt: ua.unlockedAt,
        grantedBy: ua.grantedBy,
        grantedByName: ua.grantedByName,
        achievement: ua.achievement,
      })),
      stats: { ...stats, trust },
      notifications: formattedNotifications,
      trust,
    });

    // Добавляем заголовки кэширования
    response.headers.set(
      "Cache-Control",
      "private, max-age=30, stale-while-revalidate=60",
    );
    response.headers.set("ETag", etag);

    return response;
  } catch (error) {
    console.error("Error fetching profile dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
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
