import { NextResponse } from "next/server";

import { logRouteCatchError } from "@/lib/api/parseApiError";
import { getProfileAchievementShowcase } from "@/lib/achievements/pins";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId: identifier } = await params;
    const resolvedUserId = await resolveUserIdFromIdentifier(identifier);
    if (!resolvedUserId) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const data = await getProfileAchievementShowcase(resolvedUserId);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    logRouteCatchError(
      "GET /api/users/[userId]/achievements/showcase:",
      error,
    );
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
