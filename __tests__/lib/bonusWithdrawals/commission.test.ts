import { describe, expect, it } from 'vitest';
import {
  calculateWithdrawalPayout,
  formatLevelWithdrawalPerk,
  formatWithdrawalCommissionHint,
  formatWithdrawalCommissionPerk,
} from '@/lib/bonusWithdrawals/commission';

describe('bonusWithdrawals/commission', () => {
  it('должно удержать 10% комиссии на 3 уровне', () => {
    expect(calculateWithdrawalPayout(100, 3)).toEqual({
      amountBonuses: 100,
      commissionRubles: 10,
      payoutRubles: 90,
    });
  });

  it('должно удержать 8% комиссии с 4 уровня', () => {
    expect(calculateWithdrawalPayout(100, 4)).toEqual({
      amountBonuses: 100,
      commissionRubles: 8,
      payoutRubles: 92,
    });
  });

  it('должно округлять выплату вниз для нецелых рублей на 4 уровне', () => {
    expect(calculateWithdrawalPayout(55, 4)).toEqual({
      amountBonuses: 55,
      commissionRubles: 5,
      payoutRubles: 50,
    });
  });

  it('должно описать комиссию в перке и подсказке', () => {
    expect(formatWithdrawalCommissionPerk()).toBe(
      'Комиссия на вывод — 10% (100 бон. → 90 ₽ на СБП)',
    );
    expect(formatWithdrawalCommissionHint(3)).toBe('Комиссия 10%.');
    expect(formatWithdrawalCommissionHint(4)).toBe('Комиссия 8%.');
    expect(formatLevelWithdrawalPerk(100, 3)).toBe(
      'Вывод на СБП от 100 бон. · комиссия 10%',
    );
    expect(formatLevelWithdrawalPerk(100, 4)).toBe(
      'Вывод на СБП от 100 бон. · комиссия 8%',
    );
  });
});
