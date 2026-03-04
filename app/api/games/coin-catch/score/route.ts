import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const BAN_DAYS = 7;
/** Минимальный интервал между отправками (защита от двойного сабмита одной партии), не блокирует следующую партию */
const SUBMIT_COOLDOWN_MS = 500;

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

    const now = new Date();

    let trial = await prisma.coinCatchTrial.findUnique({
      where: { userId: session.uid },
    });
    if (!trial) {
      trial = await prisma.coinCatchTrial.create({
        data: { userId: session.uid, testAttemptsUsed: 0 },
      });
    }

    if (trial.bannedUntil && trial.bannedUntil > now) {
      return NextResponse.json(
        { error: "Игра временно недоступна. Попробуйте позже." },
        { status: 403 },
      );
    }

    const timeSinceLastUpdate = Date.now() - trial.updatedAt.getTime();
    if (timeSinceLastUpdate < SUBMIT_COOLDOWN_MS) {
      return NextResponse.json(
        { error: "Please wait before submitting again" },
        { status: 429 },
      );
    }

    const testUsed = trial.testAttemptsUsed ?? 0;
    if (testUsed < 3) {
      await prisma.coinCatchTrial.update({
        where: { userId: session.uid },
        data: { testAttemptsUsed: testUsed + 1 },
      });
      const testAttemptsLeft = 3 - (testUsed + 1);
      const nextStatus =
        testAttemptsLeft > 0
          ? { canPlay: true as const, mode: "test" as const, testAttemptsLeft }
          : { canPlay: true as const, mode: "real" as const, testAttemptsLeft: 0 as const };
      return NextResponse.json({ success: true, isTest: true, status: nextStatus });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: { name: true, username: true },
    });
    const displayName = user?.name || user?.username || "Игрок";
    const weekKey = getWeekKey();
    const bannedUntil = new Date(now.getTime() + BAN_DAYS * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.gameScore.create({
        data: {
          userId: session.uid,
          gameKey: "coin-catch",
          weekKey,
          score,
          displayName,
        },
      }),
      prisma.coinCatchTrial.update({
        where: { userId: session.uid },
        data: {
          realGamePlayedAt: now,
          bannedUntil,
        },
      }),
    ]);

    const status = {
      canPlay: false as const,
      mode: "banned" as const,
      bannedUntil: bannedUntil.toISOString(),
    };
    return NextResponse.json({ success: true, isTest: false, status });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
