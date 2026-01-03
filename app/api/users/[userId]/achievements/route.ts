// app/api/users/[userId]/achievements/route.ts
import { NextResponse } from "next/server";
import { AchievementService } from "@/lib/achievements/service";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

interface RouteParams {
  params: {
    userId: string;
  };
}

// Получить достижения и статистику достижений произвольного пользователя
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const identifier = params.userId;

    if (!identifier) {
      return NextResponse.json(
        { error: "Не указан идентификатор пользователя" },
        { status: 400 },
      );
    }

    const userId = await resolveUserIdFromIdentifier(identifier);
    if (!userId) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const achievements = await AchievementService.getUserAchievements(userId);
    const stats = await AchievementService.getUserAchievementStats(userId);

    return NextResponse.json({
      success: true,
      data: {
        achievements,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching achievements for user:", error);
    return NextResponse.json(
      { error: "Ошибка получения достижений пользователя" },
      { status: 500 },
    );
  }
}


