import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Вычисляет weekKey в формате "YYYY-Www"
function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay();
  const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Понедельник
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
      where: {
        gameKey: "coin-catch",
        weekKey,
      },
      orderBy: {
        score: "desc",
      },
      take: 20,
      select: {
        userId: true,
        displayName: true,
        score: true,
        user: {
          select: {
            avatar: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
          },
        },
      },
    });

    const entries = leaderboard.map((entry, index) => ({
      userId: entry.userId,
      displayName: entry.displayName,
      score: entry.score,
      rank: index + 1,
      avatarUrl: entry.user?.avatar ?? null,
      vkLink: entry.user?.vkLink ?? null,
      telegramLink: entry.user?.telegramLink ?? null,
      youtubeLink: entry.user?.youtubeLink ?? null,
    }));

    return NextResponse.json({ leaderboard: entries });
  } catch (error: unknown) {
    console.error("Error fetching leaderboard:", error);
    // Если таблица не существует, возвращаем пустой массив
    if (
      error instanceof Error &&
      (error.message.includes("does not exist") ||
        error.message.includes("no such table"))
    ) {
      return NextResponse.json({ leaderboard: [] });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
