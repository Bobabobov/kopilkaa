import { describe, expect, it } from 'vitest';
import { getLevelFromExperience } from '@/lib/userLevel/calculate';
import {
  bonusesToDisplayExperience,
  toDisplayExperience,
} from '@/lib/userLevel/economy';

describe('вложение бонусов в опыт', () => {
  it('должно считать доступные бонусы как брутто минус вложенные', () => {
    const grossBonuses = 250;
    const bonusesInvestedInExperience = 80;
    const availableBonuses = Math.max(
      0,
      grossBonuses - bonusesInvestedInExperience,
    );
    expect(availableBonuses).toBe(170);
  });

  it('должно повышать уровень после вложения бонусов по курсу 1:0,5', () => {
    const currentStoredExperience = 0;
    const investAmount = 900;
    const storedExperience =
      currentStoredExperience +
      investAmount * bonusesToDisplayExperience(1) * 2;
    const displayExperience = toDisplayExperience(storedExperience);
    expect(getLevelFromExperience(displayExperience)).toBe(2);
  });
});
