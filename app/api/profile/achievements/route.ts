import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { getUserAchievements } from "@/lib/achievements/getUserAchievements";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getUserAchievements(session.uid);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    logRouteCatchError("GET /api/profile/achievements:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
