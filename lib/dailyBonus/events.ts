export const DAILY_BONUS_CLAIMED_EVENT = "daily-bonus-claimed";

export function dispatchDailyBonusClaimed(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DAILY_BONUS_CLAIMED_EVENT));
}
