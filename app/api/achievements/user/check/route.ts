import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { AchievementService } from "@/lib/achievements/service";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = session.uid;
    const granted = await AchievementService.checkAndGrantAutomaticAchievements(userId);
    const progress = await AchievementService.getUserAchievementProgress(userId);
    return NextResponse.json({
      success: true,
      data: {
        granted,
        progress,
      },
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Ошибка проверки достижений" },
      { status: 500 }
    );
  }
}


