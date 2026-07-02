import { DAILY_CHEST_MAX, DAILY_CHEST_MIN } from "@/lib/dailyChest/constants";

/** Случайное количество бонусов в ежедневном сундуке (от min до max включительно). */
export function rollDailyChestAmount(
  randomFn: () => number = Math.random,
): number {
  const span = DAILY_CHEST_MAX - DAILY_CHEST_MIN + 1;
  return DAILY_CHEST_MIN + Math.floor(randomFn() * span);
}
