// app/api/profile/detailed-stats/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeUserTrustSnapshot } from "@/lib/trust/computeTrustSnapshot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Инициализируем переменные с безопасными значениями по умолчанию
    let applications: any[] = [];
    let likesGiven = 0;
    let likesReceived = 0;
    let friendsCount = 0;
    let userData: { createdAt: Date } | null = null;

    try {
      // Параллельно получаем все данные с обработкой ошибок
      const results = await Promise.allSettled([
        // Статистика заявок
        prisma.application.findMany({
          where: { userId: session.uid },
          select: {
            status: true,
            amount: true,
            createdAt: true,
            countTowardsTrust: true,
          },
        }),

        // Лайки поставленные пользователем
        prisma.storyLike.count({
          where: { userId: session.uid },
        }),

        // Лайки полученные пользователем (на его заявки)
        prisma.storyLike.count({
          where: {
            application: {
              userId: session.uid,
            },
          },
        }),

        // Количество друзей
        prisma.friendship.count({
          where: {
            OR: [
              { requesterId: session.uid, status: "ACCEPTED" },
              { receiverId: session.uid, status: "ACCEPTED" },
            ],
          },
        }),

        // Дата регистрации пользователя
        prisma.user.findUnique({
          where: { id: session.uid },
          select: { createdAt: true },
        }),
      ]);

      // Безопасно извлекаем результаты
      if (results[0].status === "fulfilled") {
        applications = results[0].value;
      }

      if (results[1].status === "fulfilled") {
        likesGiven = results[1].value;
      }

      if (results[2].status === "fulfilled") {
        likesReceived = results[2].value;
      }

      if (results[3].status === "fulfilled") {
        friendsCount = results[3].value;
      }

      if (results[4].status === "fulfilled") {
        userData = results[4].value;
      }
    } catch (dbError) {
      // Database error - using default values
    }

    // Обрабатываем статистику заявок
    const applicationStats = {
      total: applications.length,
      pending: applications.filter((app) => app.status === "PENDING").length,
      approved: applications.filter((app) => app.status === "APPROVED").length,
      effectiveApproved: applications.filter(
        (app) => app.status === "APPROVED" && app.countTowardsTrust === true,
      ).length,
      rejected: applications.filter((app) => app.status === "REJECTED").length,
      totalAmount: applications.reduce(
        (sum, app) => sum + (app.amount || 0),
        0,
      ),
      averageAmount:
        applications.length > 0
          ? Math.round(
              applications.reduce((sum, app) => sum + (app.amount || 0), 0) /
                applications.length,
            )
          : 0,
    };

    // Количество дней с момента регистрации
    const daysActive = userData
      ? Math.floor(
          (Date.now() - new Date(userData.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    // Статистика активности
    const activityStats = {
      likesGiven,
      likesReceived,
      friendsCount,
      daysActive,
    };

    // Игровая статистика (пока заглушка)
    const gameStats = {
      gamesPlayed: 0,
      highScore: 0,
      rank: 0,
    };

    const trust = await computeUserTrustSnapshot(session.uid);
    const detailedStats = {
      applications: applicationStats,
      activity: activityStats,
      games: gameStats,
      user: {
        createdAt: userData?.createdAt || new Date(),
      },
      effectiveApprovedApplications: applicationStats.effectiveApproved,
      trust,
    };

    return NextResponse.json(
      { detailedStats },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching detailed stats:", error);
    // Возвращаем базовую статистику вместо ошибки
    const fallbackStats = {
      applications: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalAmount: 0,
        averageAmount: 0,
      },
      activity: {
        likesGiven: 0,
        likesReceived: 0,
        friendsCount: 0,
        daysActive: 0,
      },
      games: {
        gamesPlayed: 0,
        highScore: 0,
        rank: 0,
      },
      user: {
        createdAt: new Date(),
      },
      effectiveApprovedApplications: 0,
      trust: {
        approvedApplications: 0,
        effectiveApprovedApplications: 0,
        trustLevel: "LEVEL_1",
        limits: { min: 50, max: 150 },
        supportRangeText: "от 50 до 150 ₽",
        nextRequired: 3,
        progressCurrent: 0,
        progressTotal: 3,
        progressText: "До пересмотра уровня — ещё 3 одобренных заявок",
      },
    };

    return NextResponse.json(
      { detailedStats: fallbackStats },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  }
}
