export const MAX_DAILY_ATTEMPT_PURCHASES = 5;

export function getDailyAttemptPurchasesRemaining(
  purchasesToday: number,
): number {
  return Math.max(0, MAX_DAILY_ATTEMPT_PURCHASES - purchasesToday);
}
