/**
 * Фильтр заявок/трат после последнего админского сброса уровня.
 *
 * Сброс (до 1 ур.) начинает новый экономический цикл. Повышение (+1 ур.)
 * цикл не сбрасывает — меняются только права текущего уровня.
 */
export function economyActivitySince(
  resetAt: Date | null | undefined,
): { createdAt: { gt: Date } } | Record<string, never> {
  if (!resetAt) return {};
  return { createdAt: { gt: resetAt } };
}
