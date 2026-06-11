import { getPreviousUtcDayKey } from "@/lib/dailyBonus/dayKey";

export type LoginStreakStoredState = {
  currentStreak: number;
  lastVisitDate: string | null;
  maxStreak: number;
};

/** Следующая серия после визита в новый UTC-день. */
export function computeLoginStreakOnVisit(
  state: LoginStreakStoredState,
  todayKey: string,
): { currentStreak: number; maxStreak: number; alreadyVisitedToday: boolean } {
  if (state.lastVisitDate === todayKey) {
    return {
      currentStreak: state.currentStreak,
      maxStreak: state.maxStreak,
      alreadyVisitedToday: true,
    };
  }

  const yesterdayKey = getPreviousUtcDayKey(todayKey);
  const nextStreak =
    state.lastVisitDate === yesterdayKey ? state.currentStreak + 1 : 1;

  return {
    currentStreak: nextStreak,
    maxStreak: Math.max(state.maxStreak, nextStreak),
    alreadyVisitedToday: false,
  };
}
