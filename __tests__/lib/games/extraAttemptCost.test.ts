import { describe, expect, it } from 'vitest';
import {
  EXTRA_ATTEMPT_COST_BY_DIFFICULTY,
  getExtraAttemptCost,
  getExtraAttemptWinNet,
} from '@/lib/games/extraAttemptCost';
import {
  MAX_DAILY_ATTEMPT_PURCHASES,
  getDailyAttemptPurchasesRemaining,
} from '@/lib/games/gameAttemptPurchases';

describe('getExtraAttemptCost', () => {
  it('должно вернуть разную цену для каждого уровня сложности', () => {
    expect(getExtraAttemptCost('easy')).toBe(2);
    expect(getExtraAttemptCost('medium')).toBe(7);
    expect(getExtraAttemptCost('hard')).toBe(12);
  });

  it('должно давать положительный чистый выигрыш при победе на любом уровне', () => {
    expect(
      getExtraAttemptWinNet(5, 8, 'easy'),
    ).toBeGreaterThan(0);
    expect(
      getExtraAttemptWinNet(15, 25, 'medium'),
    ).toBeGreaterThan(0);
    expect(
      getExtraAttemptWinNet(30, 55, 'hard'),
    ).toBeGreaterThan(0);
  });
});

describe('getDailyAttemptPurchasesRemaining', () => {
  it('должно вернуть 5 когда покупок сегодня ещё не было', () => {
    expect(getDailyAttemptPurchasesRemaining(0)).toBe(
      MAX_DAILY_ATTEMPT_PURCHASES,
    );
  });

  it('должно уменьшать остаток после каждой покупки', () => {
    expect(getDailyAttemptPurchasesRemaining(3)).toBe(2);
  });

  it('должно вернуть 0 когда лимит исчерпан', () => {
    expect(getDailyAttemptPurchasesRemaining(MAX_DAILY_ATTEMPT_PURCHASES)).toBe(
      0,
    );
  });
});

describe('EXTRA_ATTEMPT_COST_BY_DIFFICULTY', () => {
  it('должно содержать три уровня', () => {
    expect(Object.keys(EXTRA_ATTEMPT_COST_BY_DIFFICULTY)).toEqual([
      'easy',
      'medium',
      'hard',
    ]);
  });
});
