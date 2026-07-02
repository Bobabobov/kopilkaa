import { describe, expect, it } from 'vitest';
import {
  getLevelRingTierTheme,
  LEVEL_RING_TIER_THEMES,
} from '@/lib/userLevel/levelRingThemes';
import { getLevelBadgeInfo } from '@/lib/userLevel/levelBadges';

describe('getLevelRingTierTheme', () => {
  it('должно вернуть серебристую тему для 1 тира', () => {
    const theme = getLevelRingTierTheme(1);
    expect(theme.gradient[0]).toBe('#e2e8f0');
  });

  it('должно вернуть золотую тему для тира 10', () => {
    const theme = getLevelRingTierTheme(10);
    expect(theme.gradient[0]).toBe('#f9bc60');
  });

  it('должно содержать темы для всех якорных тиров', () => {
    expect(Object.keys(LEVEL_RING_TIER_THEMES).map(Number).sort((a, b) => a - b)).toEqual(
      [1, 2, 3, 4, 5, 10, 15, 20],
    );
  });

  it('должно согласовывать тир бейджа и тему кольца', () => {
    expect(getLevelRingTierTheme(getLevelBadgeInfo(7).tierLevel).gradient[0]).toBe(
      getLevelRingTierTheme(5).gradient[0],
    );
    expect(getLevelRingTierTheme(getLevelBadgeInfo(12).tierLevel).gradient[0]).toBe(
      getLevelRingTierTheme(10).gradient[0],
    );
  });
});
