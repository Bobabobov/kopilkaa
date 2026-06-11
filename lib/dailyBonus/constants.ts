export const DAILY_BONUS_AMOUNT = 10;

/** Выигрыш при успешном риске в ежедневном бонусе. */
export const DAILY_BONUS_RISK_WIN_AMOUNT = 700;

/** Шанс выигрыша: 1 из N (0.1%). */
export const DAILY_BONUS_RISK_WIN_ODDS = 1000;

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
export const DAILY_BONUS_RISK_WIN_GRANT_COMMENT = "daily_bonus_risk_win";
export const DAILY_BONUS_RISK_LOSS_GRANT_COMMENT = "daily_bonus_risk_loss";
