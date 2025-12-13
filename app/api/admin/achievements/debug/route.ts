import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { AchievementService } from "@/lib/achievements/service";

export const dynamic = "force-dynamic";

// GET /api/admin/achievements/debug?userId=...
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Debug endpoint disabled in production" }, { status: 403 });
  }

  const session = await getSession();
  if (!session?.uid || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get("userId") || session.uid;
  const achievements = await AchievementService.getAllAchievements();
  const progress = await AchievementService.getUserAchievementProgress(userId);
  const stats = await AchievementService.getUserStats(userId);

  return NextResponse.json({
    success: true,
    data: {
      userId,
      stats,
      progress: progress.map((p) => ({
        slug: p.achievement.slug,
        name: p.achievement.name,
        current: p.current ?? p.progress,
        target: p.target ?? p.maxProgress,
        percent: p.progressPercentage,
        unlocked: p.isUnlocked,
      })),
      eligibleNormals: achievements.filter(
        (a) => (a.kind ?? 'NORMAL') === 'NORMAL' && !a.isExclusive && !a.isHidden && !a.isSeasonal
      ).length,
    },
  });
}


