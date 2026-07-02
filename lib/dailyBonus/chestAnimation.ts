/** Общая длительность фазы «открытие сундука» (мс) — API, прогресс-бар и анимация. */
export const DAILY_CHEST_OPENING_DURATION_MS = 1600;

/** Доля прогресса (0–1), после которой закрытый сундук начинает сменяться открытым. */
export const DAILY_CHEST_BLEND_START_RATIO = 0.88;

export function getChestOpenBlendFromProgress(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);

  if (clamped <= DAILY_CHEST_BLEND_START_RATIO) {
    return 0;
  }

  return (
    (clamped - DAILY_CHEST_BLEND_START_RATIO) /
    (1 - DAILY_CHEST_BLEND_START_RATIO)
  );
}

/** @deprecated Используйте getChestOpenBlendFromProgress */
export function getChestOpenBlend(elapsedMs: number): number {
  return getChestOpenBlendFromProgress(
    elapsedMs / DAILY_CHEST_OPENING_DURATION_MS,
  );
}
