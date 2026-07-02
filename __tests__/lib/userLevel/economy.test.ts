import { describe, expect, it } from 'vitest';
import {
  BONUS_TO_EXPERIENCE_RATIO,
  bonusesToDisplayExperience,
  bonusesToStoredExperience,
  displayExperienceToBonusesNeeded,
  toDisplayExperience,
} from '@/lib/userLevel/economy';
import {
  getLevelFromExperience,
  getTotalXpForLevel,
  getUserLevelProgress,
} from '@/lib/userLevel/calculate';

describe('getUserLevelProgress', () => {
  it('должно показывать 1 уровень при нулевом опыте, даже если в БД записан level=2', () => {
    const progress = getUserLevelProgress(0);
    expect(progress.level).toBe(1);
    expect(progress.progressPercent).toBe(0);
  });
});

describe('экономика уровня', () => {
  it('должно считать 1 бонус как 0,5 опыта', () => {
    expect(BONUS_TO_EXPERIENCE_RATIO).toBe(0.5);
    expect(bonusesToDisplayExperience(1)).toBe(0.5);
    expect(bonusesToDisplayExperience(3)).toBe(1.5);
    expect(bonusesToStoredExperience(1)).toBe(1);
    expect(toDisplayExperience(1)).toBe(0.5);
    expect(displayExperienceToBonusesNeeded(450)).toBe(900);
    expect(displayExperienceToBonusesNeeded(0.5)).toBe(1);
  });

  it('должно дать уровень 2 при 450 опыта', () => {
    expect(getLevelFromExperience(450)).toBe(2);
  });

  it('должно показывать прогресс внутри уровня', () => {
    const progress = getUserLevelProgress(600);
    expect(progress.level).toBe(2);
    expect(progress.xpInCurrentLevel).toBe(150);
    expect(progress.xpNeededForNext).toBe(900);
    expect(progress.nextLevel).toBe(3);
  });

  it('должно ограничивать уровень пятью при большом опыте', () => {
    expect(getLevelFromExperience(50_000)).toBe(5);
    const progress = getUserLevelProgress(50_000);
    expect(progress.level).toBe(5);
    expect(progress.progressPercent).toBe(100);
    expect(progress.xpToNextLevel).toBe(0);
  });
});
