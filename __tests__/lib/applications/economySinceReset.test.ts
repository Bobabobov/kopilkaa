import { describe, expect, it } from 'vitest';
import { economyActivitySince } from '@/lib/applications/economySinceReset';

describe('economyActivitySince', () => {
  it('должно не фильтровать без даты сброса', () => {
    expect(economyActivitySince(null)).toEqual({});
    expect(economyActivitySince(undefined)).toEqual({});
  });

  it('должно фильтровать активность после adminEconomyResetAt', () => {
    const resetAt = new Date('2026-06-30T12:00:00.000Z');
    expect(economyActivitySince(resetAt)).toEqual({
      createdAt: { gt: resetAt },
    });
  });
});
