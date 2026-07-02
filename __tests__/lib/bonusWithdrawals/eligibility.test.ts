import { describe, expect, it } from 'vitest';

import {
  bonusWithdrawalButtonLabel,
  canRequestBonusWithdrawal,
  isBonusWithdrawalLevelUnlocked,
} from '@/lib/bonusWithdrawals/eligibility';

describe('bonusWithdrawal eligibility', () => {
  const base = {
    availableBonuses: 150,
    hasPendingWithdrawal: false,
    withdrawalBlocked: false,
  };

  it('должно разрешить вывод на 4 уровне при 50+ бонусах', () => {
    expect(
      canRequestBonusWithdrawal({
        ...base,
        profileLevel: 4,
        availableBonuses: 50,
      }),
    ).toBe(true);
  });

  it('должно требовать 100 бонусов на 3 уровне', () => {
    expect(
      canRequestBonusWithdrawal({
        ...base,
        profileLevel: 3,
        availableBonuses: 50,
      }),
    ).toBe(false);
    expect(
      bonusWithdrawalButtonLabel({
        ...base,
        profileLevel: 3,
        availableBonuses: 50,
      }),
    ).toBe('Вывод от 100 бонусов');
  });

  it('должно запретить вывод ниже 3 уровня', () => {
    expect(
      canRequestBonusWithdrawal({ ...base, profileLevel: 2 }),
    ).toBe(false);
    expect(isBonusWithdrawalLevelUnlocked(2)).toBe(false);
  });

  it('должно показать подпись про уровень на кнопке', () => {
    expect(
      bonusWithdrawalButtonLabel({ ...base, profileLevel: 2 }),
    ).toBe('Вывод с 3 уровня');
  });
});
