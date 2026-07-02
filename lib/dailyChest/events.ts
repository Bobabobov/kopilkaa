export const DAILY_CHEST_CLAIMED_EVENT = "daily-chest-claimed";

export function dispatchDailyChestClaimed(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DAILY_CHEST_CLAIMED_EVENT));
}
