export type LevelRules = {
  tierLevel: number;
  maxApplicationAmount: number;
  applicationCost: number;
  cooldownHours: number;
  inDevelopment: boolean;
};

export type LevelRulesSlice = Omit<LevelRules, 'tierLevel'>;

/** Максимальный доступный числовой уровень профиля (остальные — в разработке). */
export const MAX_ACTIVE_PROFILE_LEVEL = 5;

export const LEVEL_PATH_MILESTONES = [1, 2, 3, 4, 5, 10, 15, 20] as const;

export function formatCooldownIntervalLabel(hours: number): string {
  if (hours <= 24) return '1 раз в сутки';
  if (hours <= 48) return 'раз в 2 суток';
  if (hours <= 72) return 'раз в 3 суток';
  const days = Math.round(hours / 24);
  return `раз в ${days} суток`;
}
