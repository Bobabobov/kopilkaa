import { afterEach, describe, expect, it } from 'vitest';
import {
  isReferralProgramEnabled,
  REFERRAL_PROGRAM_PAUSED_MESSAGE,
} from '@/lib/referralProgramConfig';

describe('referralProgram', () => {
  const original = process.env.REFERRAL_PROGRAM_ENABLED;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.REFERRAL_PROGRAM_ENABLED;
    } else {
      process.env.REFERRAL_PROGRAM_ENABLED = original;
    }
  });

  it('должно считать программу выключенной по умолчанию', () => {
    delete process.env.REFERRAL_PROGRAM_ENABLED;
    expect(isReferralProgramEnabled()).toBe(false);
  });

  it('должно включать программу при REFERRAL_PROGRAM_ENABLED=true', () => {
    process.env.REFERRAL_PROGRAM_ENABLED = 'true';
    expect(isReferralProgramEnabled()).toBe(true);
  });

  it('должно иметь сообщение о паузе', () => {
    expect(REFERRAL_PROGRAM_PAUSED_MESSAGE).toMatch(/временно/i);
  });
});
