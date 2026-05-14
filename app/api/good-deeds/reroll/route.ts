import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getGoodDeedCycleKey } from "@/lib/goodDeedTasksAdmin";
import { getWeekInfo, pickReplacementTask, pickTasksForWeek } from "@/lib/goodDeeds";
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
      return NextResponse.json({ error: "Не указано задание" }, { status: 400 });
    }

    const week = getWeekInfo(new Date());
    const cycleKey = await getGoodDeedCycleKey(week.key);
    const weekTasks = pickTasksForWeek(cycleKey);
    const weekTaskIds = weekTasks.map((task) => task.id);

    if (!weekTaskIds.includes(taskId)) {
      return NextResponse.json(
        { error: "Можно заменить только задание текущей недели" },
        { status: 400 },
      );
    }

    const [alreadyUsed, existingSubmission] = await Promise.all([
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

    const replacement = pickReplacementTask(week.key, session.uid, weekTaskIds);
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
