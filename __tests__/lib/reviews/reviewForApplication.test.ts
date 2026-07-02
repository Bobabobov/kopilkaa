import { describe, expect, it } from 'vitest';

import {
  APPLICATION_REVIEW_DETAIL_SELECT,
  resolveReviewForApplication,
  upsertApplicationReview,
} from '@/lib/reviews/reviewForApplication';

describe('reviewForApplication', () => {
  it('экспортирует select для деталей отзыва', () => {
    expect(APPLICATION_REVIEW_DETAIL_SELECT).toMatchObject({
      id: true,
      content: true,
      createdAt: true,
    });
  });

  it('upsertApplicationReview и resolveReviewForApplication экспортируются', () => {
    expect(typeof upsertApplicationReview).toBe('function');
    expect(typeof resolveReviewForApplication).toBe('function');
  });
});
