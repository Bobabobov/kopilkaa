import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTimeAgo } from "@/lib/time";
import { createHash } from "crypto";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { computeGoodDeedBonusWallet } from "@/lib/goodDeedBonusWallet";
import { emptyFirstWithdrawalBonusStatus } from "@/lib/bonusWithdrawals/firstWithdrawalBonus";
import { syncMissedLevel3MilestoneBonus } from "@/lib/userLevel/levelMilestoneBonuses";
import { getUserLevelProgress } from "@/lib/userLevel";
import { toDisplayExperience } from "@/lib/userLevel/economy";
import {
  syncUserProfileLevelIfStale,
  resolveUserProfileLevel,
} from "@/lib/userLevel/resolveProfileLevel";

export const dynamic = "force-dynamic";

// Объединенный API для загрузки всех данных профиля за один запрос
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.uid;

    // Параллельно загружаем все необходимые данные с обработкой ошибок
    const [
      user,
      friendsData,
      receivedRequestsData,
      applications,
      notifications,
      bonusWallet,
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
            headerCover: true,
            avatarFrame: true,
            hideEmail: true,
            createdAt: true,
            lastSeen: true,
            level: true,
            experience: true,
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

      // Статистика заявок
      prisma.application
        .findMany({
          where: { userId },
          select: {
            id: true,
            status: true,
            amount: true,
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

      (async () => {
        try {
          await syncMissedLevel3MilestoneBonus(userId);
          return await computeGoodDeedBonusWallet(userId);
        } catch (error) {
          logRouteCatchError("GET /api/profile/dashboard bonusWallet:", error);
          return {
            totalEarnedBonuses: 0,
            availableBonuses: 0,
            pendingWithdrawalBonuses: 0,
            withdrawnBonuses: 0,
            hasPendingWithdrawal: false,
            withdrawalBlocked: false,
            firstWithdrawalBonus: emptyFirstWithdrawalBonusStatus(),
            firstWithdrawalBonusEligible: false,
          };
        }
      })(),
    ]);

    if (!user) {
      // Если пользователь не найден, возвращаем пустые данные вместо ошибки
      return NextResponse.json({
        user: null,
        friends: [],
        receivedRequests: [],
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
        },
        bonusWallet: {
          totalEarnedBonuses: 0,
          grossBonuses: 0,
          bonusesInvestedInExperience: 0,
          availableBonuses: 0,
          bonusesInLevel: 0,
          pendingWithdrawalBonuses: 0,
          withdrawnBonuses: 0,
          hasPendingWithdrawal: false,
          withdrawalBlocked: true,
          withdrawalsDisabled: false,
          firstWithdrawalBonus: emptyFirstWithdrawalBonusStatus(),
          firstWithdrawalBonusEligible: false,
        },
        userLevel: getUserLevelProgress(0),
        notifications: [],
      });
    }

    const approvedApps = applications.filter((a) => a.status === "APPROVED");
    const rejectedApps = applications.filter((a) => a.status === "REJECTED");
    const pendingApps = applications.filter((a) => a.status === "PENDING");

    const stats = {
      totalApplications: applications.length,
      approvedApplications: approvedApps.length,
      effectiveApprovedApplications: approvedApps.length,
      pendingApplications: pendingApps.length,
      rejectedApplications: rejectedApps.length,
      totalAmountRequested: applications.reduce(
        (sum, app) => sum + (app.amount || 0),
        0,
      ),
      approvedAmount: approvedApps.reduce(
        (sum, app) => sum + (app.amount || 0),
        0,
      ),
      friendsCount: friendsData.length,
      pendingFriendRequests: receivedRequestsData.length,
    };

    // Форматируем друзей
    const friends = friendsData.map((friendship) => ({
      id: friendship.id,
      status: friendship.status,
      createdAt: friendship.createdAt,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      requester: sanitizeEmailForViewer(friendship.requester as any, userId),
      receiver: sanitizeEmailForViewer(friendship.receiver as any, userId),
    }));

    // Форматируем уведомления
    const formattedNotifications = notifications.map((like) => ({
      id: like.id,
      type: "like",
      user: sanitizeEmailForViewer(like.user as any, userId),
      application: like.application,
      createdAt: like.createdAt,
      timestamp: formatTimeAgo(like.createdAt),
    }));

    // Стабильный ETag: зависит от реально важных кусочков данных (а не от Date.now()).
    // Это нужно, чтобы браузер/клиент могли получать 304 Not Modified и не грузить всё заново.
    const displayExperienceForEtag = toDisplayExperience(user.experience ?? 0);
    const resolvedLevelForEtag = resolveUserProfileLevel(user);

    const etagPayload = {
      userId,
      user: {
        name: user.name ?? "",
        username: user.username ?? "",
        avatar: user.avatar ?? "",
        headerTheme: user.headerTheme ?? "",
        headerCover: user.headerCover ?? "",
        avatarFrame: user.avatarFrame ?? "",
        hideEmail: Boolean(user.hideEmail),
        lastSeen: user.lastSeen ? new Date(user.lastSeen).getTime() : 0,
        level: resolvedLevelForEtag,
        experience: displayExperienceForEtag,
      },
      stats,
      bonusWallet,
      latest: {
        friend: friendsData[0]?.createdAt
          ? new Date(friendsData[0].createdAt).getTime()
          : 0,
        request: receivedRequestsData[0]?.createdAt
          ? new Date(receivedRequestsData[0].createdAt).getTime()
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

    const displayExperience = toDisplayExperience(user.experience ?? 0);
    const level = await syncUserProfileLevelIfStale(userId, user);

    const userLevel = getUserLevelProgress(displayExperience);

    const response = NextResponse.json({
      user: {
        ...user,
        level,
        experience: displayExperience,
      },
      friends,
      receivedRequests: receivedRequestsData.map((req: any) => ({
        ...req,
        requester: req.requester
          ? sanitizeEmailForViewer(req.requester as any, userId)
          : req.requester,
      })),
      stats,
      bonusWallet,
      userLevel,
      notifications: formattedNotifications,
    });

    // Добавляем заголовки кэширования
    response.headers.set(
      "Cache-Control",
      "private, max-age=30, stale-while-revalidate=60",
    );
    response.headers.set("ETag", etag);

    return response;
  } catch (error) {
    logRouteCatchError("GET /api/profile/dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
