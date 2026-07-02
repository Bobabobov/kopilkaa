export {
  USER_LEVEL_BASE_XP,
  getTotalXpForLevel,
  getXpSpanForLevel,
  getUserLevelProgress,
  getLevelFromExperience,
  type UserLevelProgress,
} from './calculate';

export {
  BONUS_TO_EXPERIENCE_RATIO,
  EXPERIENCE_STORAGE_SCALE,
  BONUS_WITHDRAWALS_DISABLED_MESSAGE,
  BONUS_LEVEL_LABEL,
  LEVEL_EXCHANGE_LABEL,
  LEVEL_BENEFIT_HINT,
  toDisplayExperience,
  toStoredExperience,
  bonusesToDisplayExperience,
  bonusesToStoredExperience,
  displayExperienceToBonusesNeeded,
} from './economy';

export {
  investBonusesInExperience,
  InsufficientBonusesError,
  InvestBonusesInvalidAmountError,
  type InvestBonusesResult,
} from './investBonusesInExperience';

export {
  syncUserLevelFromBonuses,
  type SyncedUserLevel,
} from './syncUserLevelFromBonuses';

export {
  resolveUserProfileLevel,
  syncUserProfileLevelIfStale,
} from './resolveProfileLevel';

export {
  formatLevelBadgeAriaLabel,
  getLevelBadgeInfo,
  type LevelBadgeIcon,
  type LevelBadgeInfo,
  type LevelBadgeStyle,
} from './levelBadges';

export {
  getLevelRingTierTheme,
  LEVEL_BADGE_TEXT_CLASS,
  LEVEL_RING_TIER_THEMES,
  type LevelRingTierTheme,
} from './levelRingThemes';
