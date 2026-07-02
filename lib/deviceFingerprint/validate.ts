import { DEVICE_FINGERPRINT_HEX_LENGTH } from './constants';

const FINGERPRINT_RE = new RegExp(
  `^[a-f0-9]{${DEVICE_FINGERPRINT_HEX_LENGTH}}$`,
  'i',
);

/** Валидация отпечатка с клиента перед записью в БД. */
export function parseDeviceFingerprint(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toLowerCase();
  if (!FINGERPRINT_RE.test(normalized)) return null;
  return normalized;
}

/** Короткая подпись для админки: ab12cd34…9f0a */
export function formatDeviceFingerprintShort(hash: string | null | undefined): string {
  if (!hash || hash.length < 12) return '—';
  return `${hash.slice(0, 8)}…${hash.slice(-4)}`;
}
