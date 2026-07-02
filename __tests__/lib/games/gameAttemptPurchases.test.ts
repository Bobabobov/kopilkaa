import { describe, expect, it } from 'vitest';
import {
  MAX_DAILY_ATTEMPT_PURCHASES,
  getDailyAttemptPurchasesRemaining,
} from '@/lib/games/gameAttemptPurchases';

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
    expect(
      getDailyAttemptPurchasesRemaining(MAX_DAILY_ATTEMPT_PURCHASES + 2),
    ).toBe(0);
  });
});
