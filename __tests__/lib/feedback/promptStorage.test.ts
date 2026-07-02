import { describe, expect, it } from 'vitest';
import { FEEDBACK_PROMPT_CONFIG } from '@/lib/feedback/config';
import {
  getFeedbackPromptSnapshot,
  shouldShowFeedbackPrompt,
} from '@/lib/feedback/promptStorage';

describe('shouldShowFeedbackPrompt', () => {
  it('должно не показывать попап на первом визите', () => {
    const snapshot = {
      visitCount: 1,
      pagesInSession: 5,
      meaningfulInSession: 1,
      sessionActiveMs: 60_000,
      shownInSession: false,
      isInCooldown: false,
      isPopupBlocked: false,
    };

    expect(shouldShowFeedbackPrompt(snapshot, 'passive')).toBe(false);
  });

  it('должно показывать попап после осмысленного действия уже на первом визите', () => {
    const snapshot = {
      visitCount: 1,
      pagesInSession: 1,
      meaningfulInSession: 1,
      sessionActiveMs: FEEDBACK_PROMPT_CONFIG.minSessionActiveMsAfterAction,
      shownInSession: false,
      isInCooldown: false,
      isPopupBlocked: false,
    };

    expect(shouldShowFeedbackPrompt(snapshot, 'after_action')).toBe(true);
  });

  it('должно показывать попап после 2+ визитов, активности и осмысленного действия', () => {
    const snapshot = {
      visitCount: FEEDBACK_PROMPT_CONFIG.minVisitCount,
      pagesInSession: 1,
      meaningfulInSession: 1,
      sessionActiveMs: FEEDBACK_PROMPT_CONFIG.minSessionActiveMs,
      shownInSession: false,
      isInCooldown: false,
      isPopupBlocked: false,
    };

    expect(shouldShowFeedbackPrompt(snapshot, 'passive')).toBe(true);
  });

  it('должно показывать попап при 3+ страницах без отдельного действия', () => {
    const snapshot = {
      visitCount: 3,
      pagesInSession: FEEDBACK_PROMPT_CONFIG.minPagesInSession,
      meaningfulInSession: 0,
      sessionActiveMs: 45_000,
      shownInSession: false,
      isInCooldown: false,
      isPopupBlocked: false,
    };

    expect(shouldShowFeedbackPrompt(snapshot, 'passive')).toBe(true);
  });

  it('должно уважать cooldown', () => {
    const snapshot = {
      visitCount: 5,
      pagesInSession: 5,
      meaningfulInSession: 2,
      sessionActiveMs: 120_000,
      shownInSession: false,
      isInCooldown: true,
      isPopupBlocked: false,
    };

    expect(shouldShowFeedbackPrompt(snapshot, 'passive')).toBe(false);
  });

  it('должно уважать постоянную блокировку попапа после отправки', () => {
    const snapshot = {
      visitCount: 5,
      pagesInSession: 5,
      meaningfulInSession: 2,
      sessionActiveMs: 120_000,
      shownInSession: false,
      isInCooldown: false,
      isPopupBlocked: true,
    };

    expect(shouldShowFeedbackPrompt(snapshot, 'after_action')).toBe(false);
  });
});

describe('getFeedbackPromptSnapshot', () => {
  it('должно возвращать объект с ожидаемыми полями', () => {
    const snapshot = getFeedbackPromptSnapshot();
    expect(snapshot).toMatchObject({
      visitCount: expect.any(Number),
      pagesInSession: expect.any(Number),
      meaningfulInSession: expect.any(Number),
      sessionActiveMs: expect.any(Number),
      shownInSession: expect.any(Boolean),
      isInCooldown: expect.any(Boolean),
      isPopupBlocked: expect.any(Boolean),
    });
  });
});
