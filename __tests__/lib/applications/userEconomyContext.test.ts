import { describe, expect, it } from 'vitest';
import { requiresReviewBeforeNextApplication } from '@/lib/applications/userEconomyContext';

describe('requiresReviewBeforeNextApplication', () => {
  it('не должно требовать отзыв для первой заявки в цикле', () => {
    expect(
      requiresReviewBeforeNextApplication({
        priorApplicationCount: 0,
        approvedApplicationCount: 0,
      }),
    ).toBe(false);
  });

  it('должно требовать отзыв перед второй заявкой после одобрения первой', () => {
    expect(
      requiresReviewBeforeNextApplication({
        priorApplicationCount: 1,
        approvedApplicationCount: 1,
      }),
    ).toBe(true);
  });

  it('не должно требовать отзыв, если первая заявка ещё не одобрена', () => {
    expect(
      requiresReviewBeforeNextApplication({
        priorApplicationCount: 1,
        approvedApplicationCount: 0,
      }),
    ).toBe(false);
  });
});
