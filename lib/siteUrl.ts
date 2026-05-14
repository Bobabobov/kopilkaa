/**
 * Публичный origin сайта для ссылок в письмах (подтверждение email и т.п.).
 * В проде задаётся NEXT_PUBLIC_SITE_URL; иначе берём заголовки прокси или localhost.
 */
export function getPublicOriginFromRequest(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    try {
      return new URL(envUrl).origin;
    } catch {
      // игнорируем битый URL и падаем ниже
    }
  }

  const xfHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = xfHost || req.headers.get("host");
  const xfProto = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  let proto = xfProto === "http" || xfProto === "https" ? xfProto : "https";
  if (process.env.NODE_ENV !== "production") {
    proto = "http";
  }

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}
