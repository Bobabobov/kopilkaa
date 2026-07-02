export function getDailyChestOpeningStatus(progress: number): string {
  if (progress < 0.3) return "Готовим сундук...";
  if (progress < 0.7) return "Крутим удачу...";
  if (progress < 0.88) return "Почти готово...";
  return "Открываем крышку...";
}

export const DAILY_CHEST_INVITE_TIPS = [
  "Случайная награда каждый день",
  "Открыть можно только один раз",
  "Бонусы сразу на баланс",
] as const;
