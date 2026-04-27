import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_SCORE = 100000;
const MIN_RUN_DURATION_MS = 1500;
const MAX_RUN_DURATION_MS = 20 * 60 * 1000;
const MAX_SCORE_PER_SECOND = 90;
const BASE_SCORE_BUFFER = 220;
const SUBMIT_COOLDOWN_MS = 2000;
const DUPLICATE_WINDOW_MS = 5000;

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
    const score = body?.score;
    const runDurationMs = body?.runDurationMs;

    if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
      return NextResponse.json(
        { error: `Invalid score. Must be between 0 and ${MAX_SCORE}` },
        { status: 400 },
      );
    }

    if (
      typeof runDurationMs !== "number" ||
      !Number.isFinite(runDurationMs) ||
      runDurationMs < MIN_RUN_DURATION_MS ||
      runDurationMs > MAX_RUN_DURATION_MS
    ) {
      return NextResponse.json(
        { error: "Invalid run duration." },
        { status: 422 },
      );
    }

    const normalizedScore = Math.floor(score);
    const normalizedRunMs = Math.floor(runDurationMs);
    const maxExpectedScore =
      Math.floor((normalizedRunMs / 1000) * MAX_SCORE_PER_SECOND) + BASE_SCORE_BUFFER;

    if (normalizedScore > maxExpectedScore) {
      return NextResponse.json(
        { error: "Score does not pass fairness validation." },
        { status: 422 },
      );
    }

    const latestSubmission = await prisma.gameScore.findFirst({
      where: {
        userId: session.uid,
        gameKey: "dino-run",
      },
      orderBy: { createdAt: "desc" },
      select: {
        score: true,
        createdAt: true,
      },
    });

    if (latestSubmission) {
      const elapsedMs = Date.now() - latestSubmission.createdAt.getTime();
      if (elapsedMs < SUBMIT_COOLDOWN_MS) {
        return NextResponse.json(
          { error: "Please wait before submitting again." },
          { status: 429 },
        );
      }
      if (
        elapsedMs < DUPLICATE_WINDOW_MS &&
        latestSubmission.score === normalizedScore
      ) {
        return NextResponse.json(
          { error: "Duplicate score submission detected." },
          { status: 429 },
        );
      }
    }

    const weekKey = getWeekKey();
    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: { name: true, username: true },
    });
    const displayName = user?.name || user?.username || "Игрок";

    await prisma.gameScore.create({
      data: {
        userId: session.uid,
        gameKey: "dino-run",
        weekKey,
        score: normalizedScore,
        displayName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting dino-run score:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
