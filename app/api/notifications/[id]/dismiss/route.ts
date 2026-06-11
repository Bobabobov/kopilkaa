import { getAuthUser } from "@/lib/auth";
import { dismissUserNotificationModal } from "@/lib/notifications/userNotificationService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAuthUser(request);
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json(
        { error: "Не указан идентификатор уведомления" },
        { status: 400 },
      );
    }

    const dismissed = await dismissUserNotificationModal(session.uid, id.trim());
    if (!dismissed) {
      return NextResponse.json(
        { error: "Уведомление не найдено" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /api/notifications/[id]/dismiss:", error);
    return NextResponse.json(
      { error: "Не удалось закрыть уведомление" },
      { status: 500 },
    );
  }
}
