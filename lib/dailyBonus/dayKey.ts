const DAY_MS = 24 * 60 * 60 * 1000;

/** Ключ календарного дня UTC в формате YYYY-MM-DD. */
export function toUtcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Предыдущий календарный день UTC относительно переданного ключа. */
export function getPreviousUtcDayKey(dayKey: string): string {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  return toUtcDayKey(new Date(date.getTime() - DAY_MS));
}
