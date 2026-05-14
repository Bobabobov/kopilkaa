import { NextRequest, NextResponse } from "next/server";

import {
  fetchApprovedGoodDeedFeedRows,
  mapFeedRowToHomePreviewItem,
} from "@/lib/goodDeedPublicFeed";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

/**
 * Лёгкая лента одобренных отчётов для главной и виджетов.
 * Не тянет неделю, кошелёк и задания — только публичный превью-фид.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(
      12,
      Math.max(1, Number(url.searchParams.get("limit") || 3)),
    );

    const rows = await fetchApprovedGoodDeedFeedRows(limit);
    const feed = rows.map(mapFeedRowToHomePreviewItem);

    return NextResponse.json(
      { success: true, feed },
      {
        headers: {
          "Cache-Control":
            "public, max-age=30, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    logRouteCatchError("[API Error] GET /api/good-deeds/feed:", error);
    return NextResponse.json(
      { success: false, error: "Не удалось загрузить ленту" },
      { status: 500 },
    );
  }
}
