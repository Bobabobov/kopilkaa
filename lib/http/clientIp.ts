/**
 * Извлечение и нормализация IP клиента из заголовков прокси (nginx, Cloudflare и т.д.).
 * Используется при подаче заявок и в админке для поиска связанных аккаунтов.
 */

const HEADER_NAMES = [
  "cf-connecting-ip",
  "true-client-ip",
  "fastly-client-ip",
  "x-real-ip",
  "x-forwarded-for",
  "x-client-ip",
] as const;

/** RFC 7239: Forwarded: for=192.0.2.1;proto=https — берём первый for= */
function parseForwardedHeader(value: string): string | null {
  const parts = value.split(",");
  for (const part of parts) {
    const m = /(?:^|;)\s*for=\s*(?:"?\[?)([^;\]"\s]+)/i.exec(part.trim());
    if (m?.[1]) {
      const raw = m[1].replace(/^"|"$/g, "").trim();
      if (raw && raw.toLowerCase() !== "unknown") return raw;
    }
  }
  return null;
}

export function extractClientIpFromRequest(req: Request): string | null {
  for (const name of HEADER_NAMES) {
    const value = req.headers.get(name);
    if (value) {
      const first = value.split(",")[0]?.trim();
      if (first && first.length > 0 && first.toLowerCase() !== "unknown") {
        return first;
      }
    }
  }
  const fwd = req.headers.get("forwarded");
  if (fwd) {
    const fromFwd = parseForwardedHeader(fwd);
    if (fromFwd) return fromFwd;
  }
  return null;
}

/** Единый вид для сравнения (IPv4-mapped IPv6 → IPv4, trim, без zone id). */
export function normalizeClientIp(
  raw: string | null | undefined,
): string | null {
  if (raw == null) return null;
  let ip = raw.trim();
  if (!ip || ip.toLowerCase() === "unknown") return null;
  const zoneIdx = ip.indexOf("%");
  if (zoneIdx !== -1) ip = ip.slice(0, zoneIdx);
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  return ip || null;
}

/** Варианты значения для поиска в БД (старые записи могли хранить ::ffff:x). */
export function clientIpStorageVariants(normalized: string): string[] {
  const out = new Set<string>([normalized]);
  if (normalized.includes(".") && !normalized.includes(":")) {
    out.add(`::ffff:${normalized}`);
  }
  return [...out];
}
