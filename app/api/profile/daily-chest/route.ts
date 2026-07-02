import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { isUserAllowedAdmin } from "@/lib/adminAccess";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  claimDailyChestForUser,
  DailyChestAlreadyClaimedError,
  getDailyChestStatusForUser,
} from "@/lib/dailyChest/claimDailyChest";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAllowedAdmin(session.uid, session.role);
    const data = await getDailyChestStatusForUser(session.uid, new Date(), {
      isAdmin,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logRouteCatchError("[API Error] GET /api/profile/daily-chest", error);
    return NextResponse.json(
      { error: "Не удалось загрузить статус сундука" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAllowedAdmin(session.uid, session.role);
    const data = await claimDailyChestForUser(session.uid, new Date(), {
      isAdmin,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof DailyChestAlreadyClaimedError) {
      return NextResponse.json(
        {
          error: "Сегодняшний сундук уже открыт. Возвращайтесь завтра.",
        },
        { status: 409 },
      );
    }

    logRouteCatchError("[API Error] POST /api/profile/daily-chest", error);
    return NextResponse.json(
      { error: "Не удалось открыть сундук" },
      { status: 500 },
    );
  }
}
