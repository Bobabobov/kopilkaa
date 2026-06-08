const TOUR_OFFER_SEEN_KEY = 'kopi-tour-offer-seen';
const TOUR_COMPLETED_KEY = 'kopi-tour-completed';

function safeStorage(
  action: 'get' | 'set' | 'remove',
  key: string,
  value?: string,
): string | null | void {
  try {
    if (action === 'get') return localStorage.getItem(key);
    if (action === 'set') localStorage.setItem(key, value ?? '1');
    if (action === 'remove') localStorage.removeItem(key);
  } catch {
    return action === 'get' ? null : undefined;
  }
}

export function hasSeenTourOffer(): boolean {
  return Boolean(safeStorage('get', TOUR_OFFER_SEEN_KEY));
}

export function markTourOfferSeen(): void {
  safeStorage('set', TOUR_OFFER_SEEN_KEY);
}

export function hasCompletedTour(): boolean {
  return Boolean(safeStorage('get', TOUR_COMPLETED_KEY));
}

export function markTourCompleted(): void {
  safeStorage('set', TOUR_COMPLETED_KEY);
}

export const KOPI_TOUR_FINISHED_EVENT = 'kopi-tour-finished';

/** Гостю не показываем cookie, пока не завершена экскурсия (на страницах с Копi). */
export function shouldDeferCookieBannerForGuest(pathname: string): boolean {
  if (pathname === '/banned') return false;
  if (pathname.startsWith('/admin')) return false;
  return !hasCompletedTour();
}

export function resetTourProgress(): void {
  safeStorage('remove', TOUR_COMPLETED_KEY);
}
