import type { NextRequest } from "next/server";

/**
 * Публичный origin сайта для редиректов и абсолютных ссылок.
 * За reverse-proxy `request.url` часто даёт 0.0.0.0:3000 — нельзя использовать как Location.
 */
export function getPublicSiteOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      /* ниже — заголовки прокси */
    }
  }
  const protoRaw =
    req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    req.nextUrl.protocol.replace(":", "") ||
    "https";
  const proto = protoRaw === "http" || protoRaw === "https" ? protoRaw : "https";
  const hostRaw =
    req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    req.headers.get("host") ||
    req.nextUrl.host;
  const host = hostRaw?.split(":")[0] || "";
  if (!host || host === "0.0.0.0" || hostRaw.startsWith("0.0.0.0")) {
    return "https://kopilka-online.ru";
  }
  return `${proto}://${hostRaw}`;
}
