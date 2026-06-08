import {
  DAILY_BONUS_AMOUNT,
  DAILY_BONUS_CLAIM_COOLDOWN_MS,
  STREAK_MILESTONES,
} from "@/lib/dailyBonus/constants";
import { getPreviousUtcDayKey } from "@/lib/dailyBonus/dayKey";

export type DailyBonusStoredState = {
  currentStreak: number;
  lastClaimDate: string | null;
  lastClaimAt: Date | null;
};

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

export type DailyBonusStatus = {
  currentStreak: number;
  canClaim: boolean;
  claimedToday: boolean;
  dailyBonus: number;
  nextMilestone: StreakMilestone | null;
  daysUntilNextMilestone: number;
  progressToNextMilestone: number;
  lastClaimAt: string | null;
  /** Для админа: ограничения сняты, можно тестировать без ожидания суток. */
  isAdminTestMode?: boolean;
};

export function getEffectiveStreak(
  state: DailyBonusStoredState,
  todayKey: string,
): number {
  if (!state.lastClaimDate) return 0;

  const yesterdayKey = getPreviousUtcDayKey(todayKey);
  if (
    state.lastClaimDate === todayKey ||
    state.lastClaimDate === yesterdayKey
  ) {
    return state.currentStreak;
  }

  return 0;
}

export function canClaimDailyBonus(
  state: DailyBonusStoredState,
  todayKey: string,
  nowMs: number,
  isAdmin = false,
): boolean {
  if (isAdmin) return true;
  if (state.lastClaimDate === todayKey) return false;
  if (
    state.lastClaimAt &&
    nowMs - state.lastClaimAt.getTime() < DAILY_BONUS_CLAIM_COOLDOWN_MS
  ) {
    return false;
  }
  return true;
}

export function computeNextStreakOnClaim(
  state: DailyBonusStoredState,
  todayKey: string,
  isAdmin = false,
): number {
  if (isAdmin) {
    return state.currentStreak + 1;
  }
  if (!state.lastClaimDate) return 1;

  const yesterdayKey = getPreviousUtcDayKey(todayKey);
  if (state.lastClaimDate === yesterdayKey) {
    return state.currentStreak + 1;
  }

  return 1;
}

export function getMilestoneBonusForStreak(streak: number): number {
  const milestone = STREAK_MILESTONES.find((item) => item.days === streak);
  return milestone?.bonus ?? 0;
}

export function getStreakAfterClaim(newStreak: number): number {
  return newStreak === 30 ? 0 : newStreak;
}

export function getNextMilestone(
  effectiveStreak: number,
): StreakMilestone | null {
  return (
    STREAK_MILESTONES.find((item) => item.days > effectiveStreak) ?? null
  );
}

export function buildDailyBonusStatus(
  state: DailyBonusStoredState,
  todayKey: string,
  nowMs: number,
  isAdmin = false,
): DailyBonusStatus {
  const effectiveStreak = isAdmin
    ? state.currentStreak
    : getEffectiveStreak(state, todayKey);
  const claimedToday = isAdmin ? false : state.lastClaimDate === todayKey;
  const canClaim = canClaimDailyBonus(state, todayKey, nowMs, isAdmin);
  const nextMilestone = getNextMilestone(effectiveStreak);
  const daysUntilNextMilestone = nextMilestone
    ? Math.max(0, nextMilestone.days - effectiveStreak)
    : 0;
  const progressToNextMilestone = nextMilestone
    ? Math.min(1, Math.max(0, effectiveStreak / nextMilestone.days))
    : 1;

  return {
    currentStreak: effectiveStreak,
    canClaim,
    claimedToday,
    dailyBonus: DAILY_BONUS_AMOUNT,
    nextMilestone,
    daysUntilNextMilestone,
    progressToNextMilestone,
    lastClaimAt: state.lastClaimAt?.toISOString() ?? null,
    ...(isAdmin ? { isAdminTestMode: true } : {}),
  };
}
