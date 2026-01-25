// app/api/achievements/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { AchievementService } from "@/lib/achievements/service";

// GET /api/achievements/user - получить достижения текущего пользователя
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = session.uid;
    const userAchievements =
      await AchievementService.getUserAchievements(userId);
    const progress =
      await AchievementService.getUserAchievementProgress(userId);
    const stats = await AchievementService.getUserAchievementStats(userId);

    return NextResponse.json({
      success: true,
      data: {
        achievements: userAchievements,
        progress, // Все достижения с информацией о статусе
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return NextResponse.json(
      { error: "Ошибка получения достижений пользователя" },
      { status: 500 },
    );
  }
}

// POST /api/achievements/user/check - проверить и выдать автоматические достижения
export async function POST(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = session.uid;
    const grantedAchievements =
      await AchievementService.checkAndGrantAutomaticAchievements(userId);

    return NextResponse.json({
      success: true,
      data: {
        grantedAchievements,
        count: grantedAchievements.length,
      },
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Ошибка проверки достижений" },
      { status: 500 },
    );
  }
}
