import { describe, expect, it } from 'vitest';
import {
  formatLevelBadgeAriaLabel,
  getLevelBadgeInfo,
} from '@/lib/userLevel/levelBadges';

describe('getLevelBadgeInfo', () => {
  it('должно вернуть бейдж новичка для 1 уровня', () => {
    const badge = getLevelBadgeInfo(1);
    expect(badge.label).toBe('Новичок');
    expect(badge.tierLevel).toBe(1);
    expect(badge.icon).toBe('Sparkles');
  });

  it('должно вернуть уникальные названия для уровней 1–20', () => {
    const labels = Array.from({ length: 20 }, (_, index) =>
      getLevelBadgeInfo(index + 1).label,
    );
    expect(new Set(labels).size).toBe(20);
  });

  it('должно использовать стиль вехи 5 для уровней 6–9', () => {
    const levelSeven = getLevelBadgeInfo(7);
    expect(levelSeven.tierLevel).toBe(5);
    expect(levelSeven.label).toBe('Опытный');
    expect(levelSeven.style.border).toBe(
      getLevelBadgeInfo(5).style.border,
    );
  });

  it('должно вернуть бейдж автора на 3 уровне', () => {
    const badge = getLevelBadgeInfo(3);
    expect(badge.label).toBe('Автор');
    expect(badge.title).toBe('Вывод гонорара');
    expect(badge.icon).toBe('Coins');
  });

  it('должно помечать вехи 10+ как в разработке', () => {
    expect(getLevelBadgeInfo(10).inDevelopment).toBe(true);
    const badge = getLevelBadgeInfo(22);
    expect(badge.inDevelopment).toBe(true);
    expect(badge.label).toBe('Легенда');
    expect(badge.level).toBe(22);
  });

  it('должно формировать aria-label', () => {
    const badge = getLevelBadgeInfo(10);
    expect(formatLevelBadgeAriaLabel(badge)).toBe(
      'Уровень профиля 10: Ветеран. Расширенные возможности',
    );
  });
});
