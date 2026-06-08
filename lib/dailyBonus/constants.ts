export const DAILY_BONUS_AMOUNT = 10;

export const DAILY_BONUS_CLAIM_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const STREAK_MILESTONES = [
  { days: 7, bonus: 30 },
  { days: 14, bonus: 50 },
  { days: 30, bonus: 100 },
] as const;

export const STREAK_CYCLE_MAX_DAYS = 30;

export const DAILY_BONUS_GRANT_COMMENT = "daily_bonus";
export const DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX =
  "daily_bonus_streak_";
