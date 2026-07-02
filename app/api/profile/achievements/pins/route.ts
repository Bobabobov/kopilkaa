import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  getProfileAchievementShowcase,
  getProfilePinPickerPayload,
  updateProfileAchievementPins,
} from "@/lib/achievements/pins";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getProfilePinPickerPayload(session.uid);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    logRouteCatchError("GET /api/profile/achievements/pins:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const slugs =
      body &&
      typeof body === "object" &&
      body !== null &&
      !Array.isArray(body) &&
      "slugs" in body
        ? (body as { slugs: unknown }).slugs
        : null;

    if (!Array.isArray(slugs)) {
      return NextResponse.json(
        { error: "Укажите массив slug достижений" },
        { status: 400 },
      );
    }

    let pinnedSlugs;
    try {
      pinnedSlugs = await updateProfileAchievementPins(session.uid, slugs);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_PINS") {
        return NextResponse.json(
          { error: "Можно закрепить только полученные достижения" },
          { status: 400 },
        );
      }
      throw error;
    }

    const showcase = await getProfileAchievementShowcase(session.uid);

    return NextResponse.json({
      success: true,
      data: { pinnedSlugs, showcase },
    });
  } catch (error) {
    logRouteCatchError("PATCH /api/profile/achievements/pins:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
