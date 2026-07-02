import { describe, expect, it } from 'vitest';
import {
  parseDeviceFingerprint,
  formatDeviceFingerprintShort,
} from '@/lib/deviceFingerprint/validate';

describe('deviceFingerprint validate', () => {
  it('должно принять валидный SHA-256 hex', () => {
    const hash = 'a'.repeat(64);
    expect(parseDeviceFingerprint(hash)).toBe(hash);
  });

  it('должно отклонить короткий или невалидный отпечаток', () => {
    expect(parseDeviceFingerprint('abc')).toBeNull();
    expect(parseDeviceFingerprint('g'.repeat(64))).toBeNull();
    expect(parseDeviceFingerprint(null)).toBeNull();
  });

  it('должно форматировать короткую подпись', () => {
    const hash = `${'ab'.repeat(32)}`;
    expect(formatDeviceFingerprintShort(hash)).toBe(
      `${hash.slice(0, 8)}…${hash.slice(-4)}`,
    );
  });
});
