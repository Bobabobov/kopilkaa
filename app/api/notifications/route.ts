import { getAuthUser } from "@/lib/auth";
import { buildNotificationFeed } from "@/lib/notifications/buildNotificationFeed";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getAuthUser(request);
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { notifications, pendingStatusModal } = await buildNotificationFeed(
      session.uid,
    );

    return NextResponse.json(
      {
        success: true,
        notifications,
        pendingStatusModal,
        unreadCount: notifications.length,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("[API Error] GET /api/notifications:", error);
    return NextResponse.json(
      { error: "Ошибка получения уведомлений" },
      { status: 500 },
    );
  }
}
