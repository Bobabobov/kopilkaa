import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { isUserAllowedAdmin } from "@/lib/adminAccess";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  claimDailyBonusForUser,
  DailyBonusAlreadyClaimedError,
  getDailyBonusStatusForUser,
} from "@/lib/dailyBonus/claimDailyBonus";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAllowedAdmin(session.uid, session.role);
    const data = await getDailyBonusStatusForUser(session.uid, new Date(), {
      isAdmin,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logRouteCatchError("[API Error] GET /api/profile/daily-bonus", error);
    return NextResponse.json(
      { error: "Не удалось загрузить ежедневный бонус" },
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
    const data = await claimDailyBonusForUser(session.uid, new Date(), {
      isAdmin,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof DailyBonusAlreadyClaimedError) {
      return NextResponse.json(
        {
          error:
            "Сегодняшний бонус уже получен. Возвращайтесь завтра.",
        },
        { status: 409 },
      );
    }

    logRouteCatchError("[API Error] POST /api/profile/daily-bonus", error);
    return NextResponse.json(
      { error: "Не удалось получить ежедневный бонус" },
      { status: 500 },
    );
  }
}
