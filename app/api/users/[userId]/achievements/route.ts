import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { getUserAchievementsForViewer } from "@/lib/achievements/getUserAchievements";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId: identifier } = await params;
    const resolvedUserId = await resolveUserIdFromIdentifier(identifier);
    if (!resolvedUserId) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const data = await getUserAchievementsForViewer(resolvedUserId);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "private, max-age=15, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    logRouteCatchError("GET /api/users/[userId]/achievements:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
