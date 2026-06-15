import type { Route } from 'next';
import { KOPI_NAV_ITEMS, KOPI_TELEGRAM_GROUP_URL } from '@/lib/kopi/kopiScenarios';
import { KOPI_TOUR_STEPS } from '@/lib/kopi/tourSteps';

/** Максимальная длина вопроса в чате — защита от раздувания состояния в браузере */
export const KOPI_MAX_QUERY_LENGTH = 500;

/** Разрешённые внешние ссылки (только HTTPS, явный whitelist) */
const KOPI_ALLOWED_EXTERNAL_URLS = new Set<string>([KOPI_TELEGRAM_GROUP_URL]);

/** Внутренние маршруты, куда Копи может направлять пользователя */
const KOPI_ALLOWED_ROUTES = new Set<string>([
  '/',
  '/applications',
  '/applications/demo',
  '/profile',
  '/profile/demo',
  '/profile/referrals',
  '/stories',
  '/reviews',
  '/good-deeds',
  '/heroes',
  '/support',
  '/advertising',
  '/standards',
  '/terms',
  '/friends',
  ...KOPI_TOUR_STEPS.map((step) => step.route),
  ...KOPI_NAV_ITEMS.map((item) => item.href),
]);

export interface KopiExternalLink {
  href: string;
  label: string;
}

/**
 * Нормализует и ограничивает пользовательский ввод перед обработкой правилами.
 */
export function sanitizeKopiUserQuery(raw: string): string {
  return raw.trim().slice(0, KOPI_MAX_QUERY_LENGTH);
}

export function isAllowedKopiRoute(route: string): route is Route {
  return KOPI_ALLOWED_ROUTES.has(route);
}

/**
 * Проверка внешнего URL: только HTTPS и только из whitelist.
 * Соответствует практике не рендерить произвольные javascript:/data: ссылки
 * (см. рекомендации React по опасным URL в href/src).
 */
export function isAllowedKopiExternalUrl(href: string): boolean {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:') return false;
    return KOPI_ALLOWED_EXTERNAL_URLS.has(url.href);
  } catch {
    return false;
  }
}

export function sanitizeKopiExternalLink(
  link: KopiExternalLink | undefined,
): KopiExternalLink | null {
  if (!link) return null;
  const label = link.label.trim().slice(0, 120);
  if (!label || !isAllowedKopiExternalUrl(link.href)) return null;
  return { href: link.href, label };
}

export function sanitizeKopiNavigateTarget(
  route: Route | undefined,
  label: string | undefined,
): { route: Route; label: string } | null {
  if (!route || !label) return null;
  if (!isAllowedKopiRoute(route)) return null;
  const safeLabel = label.trim().slice(0, 80);
  if (!safeLabel) return null;
  return { route, label: safeLabel };
}
