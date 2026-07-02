import { cn } from '@/lib/utils';

/** Глубокая изумрудная панель профиля */
export const PROFILE_EMERALD_PANEL = cn(
  'rounded-2xl border border-emerald-500/10 bg-emerald-950/40 p-4 shadow-xl backdrop-blur-md sm:p-6',
);

export const PROFILE_EMERALD_INNER = cn(
  'rounded-xl border border-emerald-500/10 bg-emerald-950/30',
);

export const PROFILE_EMERALD_INPUT = cn(
  'h-10 min-w-0 flex-1 border-emerald-500/20 bg-emerald-950/50 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500/30',
);

export const PUBLIC_SITE_ORIGIN = 'https://kopilka-online.ru';

/** Заменяет localhost в реферальной ссылке на боевой домен */
export function normalizePublicReferralUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.endsWith('.local')
    ) {
      return `${PUBLIC_SITE_ORIGIN}${parsed.pathname}${parsed.search}`;
    }
    return url;
  } catch {
    return url.replace(/https?:\/\/localhost(?::\d+)?/gi, PUBLIC_SITE_ORIGIN);
  }
}
