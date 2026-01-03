import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: identifier } = await params;
    const userId = await resolveUserIdFromIdentifier(identifier);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Инициализируем переменные с безопасными значениями по умолчанию
    let applications: any[] = [];
    let likesGiven = 0;
    let likesReceived = 0;
    let friendsCount = 0;
    let achievements: any[] = [];
    let userCreatedAt: { createdAt: Date } | null = null;

    try {
      // Параллельно получаем все данные с обработкой ошибок
      const results = await Promise.allSettled([
        // Статистика заявок
        prisma.application.findMany({
          where: { userId },
          select: {
            status: true,
            amount: true,
            createdAt: true,
          },
        }),

        // Лайки поставленные пользователем
        prisma.storyLike.count({
          where: { userId },
        }),

        // Лайки полученные пользователем (на его заявки)
        prisma.storyLike.count({
          where: {
            application: {
              userId: userId,
            },
          },
        }),

        // Количество друзей
        prisma.friendship.count({
          where: {
            OR: [
              { requesterId: userId, status: "ACCEPTED" },
              { receiverId: userId, status: "ACCEPTED" },
            ],
          },
        }),

        // Достижения пользователя
        prisma.userAchievement.findMany({
          where: { userId },
          include: {
            achievement: {
              select: {
                rarity: true,
              },
            },
          },
        }),

        // Дата регистрации пользователя
        prisma.user.findUnique({
          where: { id: userId },
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
        achievements = results[4].value;
      }

      if (results[5].status === "fulfilled") {
        userCreatedAt = results[5].value;
      }
    } catch (dbError) {
      // Database error - using default values
    }

    // Обрабатываем статистику заявок
    const applicationStats = {
      total: applications.length,
      pending: applications.filter((app) => app.status === "PENDING").length,
      approved: applications.filter((app) => app.status === "APPROVED").length,
      rejected: applications.filter((app) => app.status === "REJECTED").length,
      totalAmount: applications.reduce((sum, app) => sum + (app.amount || 0), 0),
      averageAmount:
        applications.length > 0
          ? Math.round(
              applications.reduce((sum, app) => sum + (app.amount || 0), 0) /
                applications.length
            )
          : 0,
    };

    // Количество дней с момента регистрации
    const daysActive = userCreatedAt
      ? Math.floor(
          (Date.now() - new Date(userCreatedAt.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    // Статистика активности
    const activityStats = {
      likesGiven,
      likesReceived,
      friendsCount,
      daysActive,
    };

    // Статистика достижений по редкости
    const achievementStats = {
      total: achievements.length,
      legendary: achievements.filter(
        (ua) => ua.achievement && ua.achievement.rarity === "LEGENDARY"
      ).length,
      epic: achievements.filter(
        (ua) => ua.achievement && ua.achievement.rarity === "EPIC"
      ).length,
      rare: achievements.filter(
        (ua) => ua.achievement && ua.achievement.rarity === "RARE"
      ).length,
      common: achievements.filter(
        (ua) => ua.achievement && ua.achievement.rarity === "COMMON"
      ).length,
    };

    // Игровая статистика (пока заглушка)
    const gameStats = {
      gamesPlayed: 0,
      highScore: 0,
      rank: 0,
    };

    const detailedStats = {
      applications: applicationStats,
      activity: activityStats,
      achievements: achievementStats,
      games: gameStats,
      user: {
        createdAt: userCreatedAt?.createdAt || new Date(),
      },
    };

    return NextResponse.json(
      { detailedStats },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
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
      achievements: {
        total: 0,
        legendary: 0,
        epic: 0,
        rare: 0,
        common: 0,
      },
      games: {
        gamesPlayed: 0,
        highScore: 0,
        rank: 0,
      },
      user: {
        createdAt: new Date(),
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
      }
    );
  }
}

