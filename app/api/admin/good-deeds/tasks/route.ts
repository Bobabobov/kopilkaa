import { NextRequest, NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import {
  getAllManagedGoodDeedTasks,
  getTaskRotationState,
} from "@/lib/goodDeedTasksAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const [tasks, rotation] = await Promise.all([
      getAllManagedGoodDeedTasks(),
      getTaskRotationState(),
    ]);

    return NextResponse.json({
      success: true,
      tasks,
      rotation: {
        version: rotation.version,
        nextRotationAt: rotation.nextRotationAt.toISOString(),
        lastRotatedAt: rotation.lastRotatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[API Error] GET /api/admin/good-deeds/tasks:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить задания добрых дел" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await req.json();
    const taskId = String(body?.taskId || "").trim();
    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();
    const reward = Number(body?.reward);
    const isActive =
      typeof body?.isActive === "boolean" ? body.isActive : undefined;

    if (!taskId) {
      return NextResponse.json(
        { error: "Не указан ID задания" },
        { status: 400 },
      );
    }
    if (!title) {
      return NextResponse.json({ error: "Введите название" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Введите описание" }, { status: 400 });
    }
    if (!Number.isFinite(reward) || reward < 1 || reward > 100000) {
      return NextResponse.json(
        { error: "Некорректная цена задания" },
        { status: 400 },
      );
    }

    const updated = await prisma.goodDeedTask.update({
      where: { id: taskId },
      data: {
        title,
        description,
        reward: Math.round(reward),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      select: {
        id: true,
        difficulty: true,
        title: true,
        description: true,
        reward: true,
        isActive: true,
        sortOrder: true,
      },
    });

    return NextResponse.json({ success: true, task: updated });
  } catch (error) {
    console.error("[API Error] PATCH /api/admin/good-deeds/tasks:", error);
    return NextResponse.json(
      { error: "Не удалось обновить задание" },
      { status: 500 },
    );
  }
}
