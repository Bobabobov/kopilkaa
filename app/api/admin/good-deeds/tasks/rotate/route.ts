import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { rotateTasksNow } from "@/lib/goodDeedTasksAdmin";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const rotation = await rotateTasksNow();

    return NextResponse.json({
      success: true,
      rotation: {
        version: rotation.version,
        nextRotationAt: rotation.nextRotationAt.toISOString(),
        lastRotatedAt: rotation.lastRotatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[API Error] POST /api/admin/good-deeds/tasks/rotate:", error);
    return NextResponse.json(
      { error: "Не удалось выполнить ручную смену заданий" },
      { status: 500 },
    );
  }
}
