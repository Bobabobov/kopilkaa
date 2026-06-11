import { NextRequest, NextResponse } from "next/server";

/**
 * Устаревший маршрут: раньее использовал oauth.telegram.org с bot_id/origin.
 * Сейчас вход — через Login Widget (data-auth-url → GET /api/auth/telegram).
 * @see https://core.telegram.org/widgets/login-legacy
 */
export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next");
  const target = new URL("/api/auth/telegram", req.nextUrl.origin);
  if (next) {
    target.searchParams.set("next", next);
  }
  return NextResponse.redirect(target, 302);
}
