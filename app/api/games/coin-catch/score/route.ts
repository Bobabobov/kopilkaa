import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
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

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { score } = body;

    if (typeof score !== "number" || score < 0 || score > 250) {
      return NextResponse.json(
        { error: "Invalid score. Must be between 0 and 250" },
        { status: 400 },
      );
    }

    // Антиспам: проверяем последнюю запись пользователя
    const lastScore = await prisma.gameScore.findFirst({
      where: {
        userId: session.uid,
        gameKey: "coin-catch",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lastScore) {
      const timeSinceLastScore = Date.now() - lastScore.createdAt.getTime();
      if (timeSinceLastScore < 10000) {
        // 10 секунд
        return NextResponse.json(
          { error: "Please wait before submitting again" },
          { status: 429 },
        );
      }
    }

    // Получаем пользователя для displayName
    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        name: true,
        username: true,
      },
    });

    const displayName = user?.name || user?.username || "Игрок";
    const weekKey = getWeekKey();

    await prisma.gameScore.create({
      data: {
        userId: session.uid,
        gameKey: "coin-catch",
        weekKey,
        score,
        displayName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
