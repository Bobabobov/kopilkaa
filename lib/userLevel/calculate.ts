import { MAX_ACTIVE_PROFILE_LEVEL } from '@/lib/level-config/shared';

/** Базовый опыт для перехода с 1 на 2 уровень; дальше растёт линейно с уровнем. */
export const USER_LEVEL_BASE_XP = 450;

export { MAX_ACTIVE_PROFILE_LEVEL };
/** Суммарный опыт, с которого начинается указанный уровень (уровень 1 — с 0). */
export function getTotalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return (USER_LEVEL_BASE_XP * (level - 1) * level) / 2;
}

/** Опыт, нужный для перехода с текущего уровня на следующий. */
export function getXpSpanForLevel(level: number): number {
  return USER_LEVEL_BASE_XP * Math.max(level, 1);
}

export interface UserLevelProgress {
  level: number;
  experience: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  xpToNextLevel: number;
  progressPercent: number;
  nextLevel: number;
}

/** Прогресс полоски уровня для UI и API (уровень всегда из опыта, не из поля user.level). */
export function getUserLevelProgress(displayExperience: number): UserLevelProgress {
  const safeExperience = Math.max(0, displayExperience);
  const rawLevel = getLevelFromExperience(safeExperience);
  const safeLevel = Math.min(rawLevel, MAX_ACTIVE_PROFILE_LEVEL);

  if (safeLevel >= MAX_ACTIVE_PROFILE_LEVEL) {
    return {
      level: safeLevel,
      experience: safeExperience,
      xpInCurrentLevel: 0,
      xpNeededForNext: 0,
      xpToNextLevel: 0,
      progressPercent: 100,
      nextLevel: safeLevel,
    };
  }

  const currentLevelStartXp = getTotalXpForLevel(safeLevel);
  const nextLevel = safeLevel + 1;
  const nextLevelStartXp = getTotalXpForLevel(nextLevel);
  const xpNeededForNext = nextLevelStartXp - currentLevelStartXp;
  const xpInCurrentLevel = Math.min(
    xpNeededForNext,
    Math.max(0, safeExperience - currentLevelStartXp),
  );
  const progressPercent =
    xpNeededForNext > 0
      ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))
      : 0;

  return {
    level: safeLevel,
    experience: safeExperience,
    xpInCurrentLevel,
    xpNeededForNext,
    xpToNextLevel: Math.max(0, xpNeededForNext - xpInCurrentLevel),
    progressPercent,
    nextLevel,
  };
}

/** Для будущих механик: уровень по суммарному опыту (пока не выше MAX_ACTIVE_PROFILE_LEVEL). */
export function getLevelFromExperience(experience: number): number {
  let level = 1;
  while (getTotalXpForLevel(level + 1) <= experience) {
    level += 1;
  }
  return Math.min(level, MAX_ACTIVE_PROFILE_LEVEL);
}
