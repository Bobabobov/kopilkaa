'use client';

import { DEVICE_ID_STORAGE_KEY } from './constants';

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function collectStableSignals(): string[] {
  if (typeof window === 'undefined') return [];

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    userAgentData?: { platform?: string };
  };

  const screenPart =
    typeof screen !== 'undefined'
      ? [
          screen.width,
          screen.height,
          screen.colorDepth,
          screen.pixelDepth,
        ].join('x')
      : '';

  return [
    getOrCreateDeviceId(),
    nav.userAgent ?? '',
    nav.language ?? '',
    (nav.languages ?? []).join(','),
    nav.platform ?? nav.userAgentData?.platform ?? '',
    String(nav.hardwareConcurrency ?? ''),
    String(nav.deviceMemory ?? ''),
    String(nav.maxTouchPoints ?? 0),
    String(nav.cookieEnabled ?? false),
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
    screenPart,
  ];
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

let cachedFingerprint: string | null = null;
let collectPromise: Promise<string | null> | null = null;

/**
 * Собирает отпечаток устройства в браузере (Web Crypto API).
 * Результат кэшируется на время сессии вкладки.
 */
export async function collectDeviceFingerprint(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (cachedFingerprint) return cachedFingerprint;
  if (collectPromise) return collectPromise;

  collectPromise = (async () => {
    try {
      if (!crypto?.subtle?.digest) return null;
      const payload = collectStableSignals().join('|');
      if (!payload.trim()) return null;
      const hash = await sha256Hex(payload);
      cachedFingerprint = hash;
      return hash;
    } catch {
      return null;
    } finally {
      collectPromise = null;
    }
  })();

  return collectPromise;
}

/** Часовой пояс браузера автора заявки (IANA, напр. Europe/Moscow). */
export function getClientTimezone(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim();
    return tz || null;
  } catch {
    return null;
  }
}
