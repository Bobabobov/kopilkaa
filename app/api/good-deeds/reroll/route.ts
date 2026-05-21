import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getAllManagedGoodDeedTasks,
  getCurrentGoodDeedTasks,
  getGoodDeedCycleKey,
} from "@/lib/goodDeedTasksAdmin";
import { getWeekInfo } from "@/lib/goodDeeds";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session?.uid) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const taskId = String(body?.taskId || "").trim();
    if (!taskId) {
      return NextResponse.json(
        { error: "Не указано задание" },
        { status: 400 },
      );
    }

    const week = getWeekInfo(new Date());
    const cycleKey = await getGoodDeedCycleKey(week.key);
    const currentTasks = await getCurrentGoodDeedTasks();
    const currentTask = currentTasks.find((task) => task.id === taskId);

    if (!currentTask) {
      return NextResponse.json(
        { error: "Можно заменить только задание текущей недели" },
        { status: 400 },
      );
    }

    const [alreadyUsed, existingSubmission, approvedSubmissions] =
      await Promise.all([
        prisma.goodDeedWeekPreference.findUnique({
          where: {
            userId_weekKey: {
              userId: session.uid,
              weekKey: cycleKey,
            },
          },
          select: { id: true },
        }),
        prisma.goodDeedSubmission.findUnique({
          where: {
            userId_weekKey_taskKey: {
              userId: session.uid,
              weekKey: cycleKey,
              taskKey: taskId,
            },
          },
          select: { id: true },
        }),
        prisma.goodDeedSubmission.findMany({
          where: {
            userId: session.uid,
            status: GoodDeedSubmissionStatus.APPROVED,
          },
          select: { taskKey: true },
        }),
      ]);

    if (alreadyUsed) {
      return NextResponse.json(
        { error: "Замена уже использована на этой неделе" },
        { status: 409 },
      );
    }

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Нельзя заменить задание после отправки отчёта" },
        { status: 409 },
      );
    }

    const approvedTaskIds = new Set(
      approvedSubmissions.map((submission) => submission.taskKey),
    );
    const replacements = (await getAllManagedGoodDeedTasks()).filter(
      (task) =>
        task.isActive &&
        task.difficulty === currentTask.difficulty &&
        task.id !== currentTask.id &&
        !approvedTaskIds.has(task.id),
    );
    const replacement =
      replacements.length > 0
        ? replacements[
            hashReplacementIndex(
              cycleKey,
              session.uid,
              taskId,
              replacements.length,
            )
          ]
        : null;

    if (!replacement) {
      return NextResponse.json(
        { error: "Сейчас нет доступной замены" },
        { status: 400 },
      );
    }

    await prisma.goodDeedWeekPreference.create({
      data: {
        userId: session.uid,
        weekKey: cycleKey,
        replacedTaskKey: taskId,
        newTaskKey: replacement.id,
      },
    });

    return NextResponse.json({
      success: true,
      replacementTask: replacement,
    });
  } catch (error) {
    logRouteCatchError("POST /api/good-deeds/reroll error:", error);
    return NextResponse.json(
      { error: "Не удалось заменить задание" },
      { status: 500 },
    );
  }
}

function hashReplacementIndex(
  cycleKey: string,
  userId: string,
  taskId: string,
  size: number,
): number {
  let hash = 0;
  const seed = `${cycleKey}:${userId}:${taskId}`;
  for (const char of seed) {
    hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  }

  return hash % size;
}
