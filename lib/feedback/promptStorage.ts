import {
  FEEDBACK_MEANINGFUL_ACTION_EVENT,
  FEEDBACK_PROMPT_CONFIG,
  FEEDBACK_STORAGE_PREFIX,
} from './config';

const KEYS = {
  visitCount: `${FEEDBACK_STORAGE_PREFIX}_visit_count`,
  meaningfulInSession: `${FEEDBACK_STORAGE_PREFIX}_meaningful_session`,
  pagesInSession: `${FEEDBACK_STORAGE_PREFIX}_pages_session`,
  sessionStartedAt: `${FEEDBACK_STORAGE_PREFIX}_session_started_at`,
  shownInSession: `${FEEDBACK_STORAGE_PREFIX}_shown_session`,
  submittedUntil: `${FEEDBACK_STORAGE_PREFIX}_submitted_until`,
  dismissedUntil: `${FEEDBACK_STORAGE_PREFIX}_dismissed_until`,
  popupBlocked: `${FEEDBACK_STORAGE_PREFIX}_popup_blocked`,
  sessionBootstrapped: `${FEEDBACK_STORAGE_PREFIX}_session_bootstrapped`,
  pendingAfterAction: `${FEEDBACK_STORAGE_PREFIX}_pending_after_action`,
} as const;

function readNumber(storage: Storage, key: string): number {
  const raw = storage.getItem(key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readIsoDate(storage: Storage, key: string): number | null {
  const raw = storage.getItem(key);
  if (!raw) return null;
  const ts = Date.parse(raw);
  return Number.isFinite(ts) ? ts : null;
}

function writeIsoDate(storage: Storage, key: string, date: Date): void {
  storage.setItem(key, date.toISOString());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function bootstrapFeedbackSession(): void {
  if (typeof window === 'undefined') return;

  if (sessionStorage.getItem(KEYS.sessionBootstrapped) === '1') {
    return;
  }

  sessionStorage.setItem(KEYS.sessionBootstrapped, '1');
  sessionStorage.setItem(KEYS.meaningfulInSession, '0');
  sessionStorage.setItem(KEYS.pagesInSession, '0');
  sessionStorage.setItem(KEYS.shownInSession, '0');
  sessionStorage.setItem(KEYS.sessionStartedAt, String(Date.now()));

  const visits = readNumber(localStorage, KEYS.visitCount) + 1;
  localStorage.setItem(KEYS.visitCount, String(visits));
}

export function trackFeedbackPageView(pathname: string): void {
  if (typeof window === 'undefined') return;
  bootstrapFeedbackSession();

  const pagesKey = `${KEYS.pagesInSession}:${pathname}`;
  if (sessionStorage.getItem(pagesKey) === '1') return;
  sessionStorage.setItem(pagesKey, '1');

  const pages = readNumber(sessionStorage, KEYS.pagesInSession) + 1;
  sessionStorage.setItem(KEYS.pagesInSession, String(pages));
}

export function recordFeedbackMeaningfulAction(): void {
  if (typeof window === 'undefined') return;
  bootstrapFeedbackSession();

  const count = readNumber(sessionStorage, KEYS.meaningfulInSession) + 1;
  sessionStorage.setItem(KEYS.meaningfulInSession, String(count));
  sessionStorage.setItem(KEYS.pendingAfterAction, '1');
  window.dispatchEvent(new CustomEvent(FEEDBACK_MEANINGFUL_ACTION_EVENT));
}

export function markFeedbackPromptShown(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KEYS.shownInSession, '1');
  sessionStorage.removeItem(KEYS.pendingAfterAction);
}

export function markFeedbackSubmitted(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.popupBlocked, '1');
  writeIsoDate(
    localStorage,
    KEYS.submittedUntil,
    addDays(new Date(), FEEDBACK_PROMPT_CONFIG.cooldownAfterSubmitDays),
  );
  sessionStorage.setItem(KEYS.shownInSession, '1');
  sessionStorage.removeItem(KEYS.pendingAfterAction);
}

export function isFeedbackPopupBlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.popupBlocked) === '1';
}

export function markFeedbackDismissed(): void {
  if (typeof window === 'undefined') return;
  writeIsoDate(
    localStorage,
    KEYS.dismissedUntil,
    addDays(new Date(), FEEDBACK_PROMPT_CONFIG.cooldownAfterDismissDays),
  );
  sessionStorage.setItem(KEYS.shownInSession, '1');
}

export function markFeedbackLater(): void {
  if (typeof window === 'undefined') return;
  writeIsoDate(
    localStorage,
    KEYS.dismissedUntil,
    addDays(new Date(), FEEDBACK_PROMPT_CONFIG.cooldownAfterLaterDays),
  );
  sessionStorage.setItem(KEYS.shownInSession, '1');
}

export interface FeedbackPromptSnapshot {
  visitCount: number;
  pagesInSession: number;
  meaningfulInSession: number;
  sessionActiveMs: number;
  shownInSession: boolean;
  isInCooldown: boolean;
  isPopupBlocked: boolean;
}

export function getFeedbackPromptSnapshot(): FeedbackPromptSnapshot {
  if (typeof window === 'undefined') {
    return {
      visitCount: 0,
      pagesInSession: 0,
      meaningfulInSession: 0,
      sessionActiveMs: 0,
      shownInSession: true,
      isInCooldown: true,
      isPopupBlocked: true,
    };
  }

  bootstrapFeedbackSession();

  const startedAt = readNumber(sessionStorage, KEYS.sessionStartedAt);
  const submittedUntil = readIsoDate(localStorage, KEYS.submittedUntil);
  const dismissedUntil = readIsoDate(localStorage, KEYS.dismissedUntil);
  const now = Date.now();
  const cooldownUntil = Math.max(submittedUntil ?? 0, dismissedUntil ?? 0);

  return {
    visitCount: readNumber(localStorage, KEYS.visitCount),
    pagesInSession: readNumber(sessionStorage, KEYS.pagesInSession),
    meaningfulInSession: readNumber(sessionStorage, KEYS.meaningfulInSession),
    sessionActiveMs: startedAt > 0 ? now - startedAt : 0,
    shownInSession: sessionStorage.getItem(KEYS.shownInSession) === '1',
    isInCooldown: cooldownUntil > now,
    isPopupBlocked: isFeedbackPopupBlocked(),
  };
}

export type FeedbackPromptTrigger = 'passive' | 'after_action';

export function shouldShowFeedbackPrompt(
  snapshot: FeedbackPromptSnapshot,
  trigger: FeedbackPromptTrigger = 'passive',
): boolean {
  const {
    minVisitCount,
    minSessionActiveMs,
    minPagesInSession,
    minVisitCountAfterAction,
    minSessionActiveMsAfterAction,
  } = FEEDBACK_PROMPT_CONFIG;

  if (snapshot.shownInSession || snapshot.isInCooldown || snapshot.isPopupBlocked) {
    return false;
  }

  if (trigger === 'after_action') {
    if (snapshot.meaningfulInSession < 1) return false;
    if (snapshot.visitCount < minVisitCountAfterAction) return false;
    if (snapshot.sessionActiveMs < minSessionActiveMsAfterAction) return false;
    return true;
  }

  if (snapshot.visitCount < minVisitCount) return false;
  if (snapshot.sessionActiveMs < minSessionActiveMs) return false;

  const hasEngagement =
    snapshot.meaningfulInSession > 0 ||
    snapshot.pagesInSession >= minPagesInSession;

  return hasEngagement;
}

export function hasPendingFeedbackAfterAction(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(KEYS.pendingAfterAction) === '1';
}
