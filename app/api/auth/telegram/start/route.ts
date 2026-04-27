import { NextRequest, NextResponse } from "next/server";

function getSafeNext(raw: string | null): string {
  if (!raw) return "/profile";
  const v = raw.trim();
  if (!v.startsWith("/")) return "/profile";
  if (v.startsWith("//")) return "/profile";
  if (v.includes("://")) return "/profile";
  if (v.includes("\n") || v.includes("\r")) return "/profile";
  return v;
}

function getOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      // fallback ниже
    }
  }
  const proto =
    req.headers.get("x-forwarded-proto") ||
    req.nextUrl.protocol.replace(":", "");
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    req.nextUrl.host;
  if (!host || host === "0.0.0.0:3000" || host.startsWith("0.0.0.0")) {
    return "https://kopilka-online.ru";
  }
  return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN || "";
  const botId = token.split(":")[0];

  if (!/^\d+$/.test(botId)) {
    const fail = new URL("/", getOrigin(req));
    fail.searchParams.set("modal", "auth");
    fail.searchParams.set("error", "Telegram вход временно недоступен");
    return NextResponse.redirect(fail, 302);
  }

  const next = getSafeNext(req.nextUrl.searchParams.get("next"));
  const origin = getOrigin(req);

  const returnTo = new URL("/api/auth/telegram", origin);
  returnTo.searchParams.set("next", next);

  const oauth = new URL("https://oauth.telegram.org/auth");
  oauth.searchParams.set("bot_id", botId);
  oauth.searchParams.set("origin", origin);
  oauth.searchParams.set("return_to", returnTo.toString());
  oauth.searchParams.set("request_access", "write");

  return NextResponse.redirect(oauth, 302);
}

