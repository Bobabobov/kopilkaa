/**
 * Поле <input type="date"> отдаёт строку YYYY-MM-DD. Вызов `new Date("2026-04-03")`
 * даёт полночь UTC в начале этого дня — в течение почти всего выбранного календарного дня
 * запись уже считается просроченной при проверке `expiresAt > now`.
 * Интерпретируем дату как «действует до конца этого дня (UTC)».
 */
export function parseAdvertisementExpiryInput(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (ymd) {
    const y = Number(ymd[1]);
    const m = Number(ymd[2]);
    const d = Number(ymd[3]);
    if (!y || !m || !d) return null;
    return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
