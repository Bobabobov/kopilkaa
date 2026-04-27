import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay();
  const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const year = monday.getFullYear();
  const weekStart = new Date(year, 0, 1);
  const days = Math.floor(
    (monday.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000),
  );
  const weekNumber = Math.ceil((days + weekStart.getDay() + 1) / 7);
  return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
}

export async function GET() {
  try {
    const weekKey = getWeekKey();
    const leaderboard = await prisma.gameScore.findMany({
      where: { gameKey: "dino-run", weekKey },
      orderBy: { score: "desc" },
      take: 10,
      select: {
        userId: true,
        displayName: true,
        score: true,
        user: {
          select: {
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        displayName: entry.displayName,
        score: entry.score,
        avatarUrl: entry.user?.avatar ?? null,
      })),
    });
  } catch (error: unknown) {
    console.error("Error fetching dino-run leaderboard:", error);
    if (
      error instanceof Error &&
      (error.message.includes("does not exist") || error.message.includes("no such table"))
    ) {
      return NextResponse.json({ leaderboard: [] });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
