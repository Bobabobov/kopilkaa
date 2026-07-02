import { describe, expect, it } from 'vitest';
import { formatBonusGrantDescription } from '@/lib/admin/bonusLedger';
import { DAILY_BONUS_GRANT_COMMENT } from '@/lib/dailyBonus/constants';

describe('formatBonusGrantDescription', () => {
  it('должно вернуть русское описание для ежедневного бонуса', () => {
    const result = formatBonusGrantDescription(DAILY_BONUS_GRANT_COMMENT, 10);
    expect(result.title).toContain('Ежедневный');
    expect(result.description).toContain('вход');
  });

  it('должно вернуть русское описание для списания админом', () => {
    const result = formatBonusGrantDescription(
      'Списание администратором',
      -20,
    );
    expect(result.title).toContain('Списание');
  });
});
