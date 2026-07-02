import { getMessageFromApiJson } from '@/lib/api/parseApiError';

export type PinPickerAchievementItem = {
  slug: string;
  name: string;
  icon: string;
};

type PinPickerCache = {
  unlockedItems: PinPickerAchievementItem[];
  pinnedSlugs: string[];
  fetchedAt: number;
};

const CACHE_TTL_MS = 60_000;

let cache: PinPickerCache | null = null;
let inflight: Promise<PinPickerCache> | null = null;

type PinsApiResponse = {
  success: boolean;
  data: {
    pinnedSlugs: string[];
    unlockedItems: PinPickerAchievementItem[];
  };
};

export function invalidatePinPickerCache(): void {
  cache = null;
  inflight = null;
}

/** Лёгкая загрузка списка для панели закрепления (без полного sync ачивок). */
export async function fetchPinPickerData(
  force = false,
): Promise<PinPickerCache> {
  if (
    !force &&
    cache &&
    Date.now() - cache.fetchedAt < CACHE_TTL_MS
  ) {
    return cache;
  }

  if (!force && inflight) {
    return inflight;
  }

  inflight = (async () => {
    const response = await fetch('/api/profile/achievements/pins', {
      cache: 'no-store',
    });
    const json = (await response.json().catch(() => null)) as
      | PinsApiResponse
      | { error?: string }
      | null;

    if (!response.ok) {
      throw new Error(
        getMessageFromApiJson(json, 'Не удалось загрузить достижения'),
      );
    }

    const payload = json as PinsApiResponse;
    const next: PinPickerCache = {
      unlockedItems: payload.data.unlockedItems ?? [],
      pinnedSlugs: payload.data.pinnedSlugs ?? [],
      fetchedAt: Date.now(),
    };
    cache = next;
    return next;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/** Фоновый prefetch при открытии профиля владельца. */
export function prefetchPinPickerData(): void {
  void fetchPinPickerData().catch(() => {
    /* prefetch — тихий */
  });
}
