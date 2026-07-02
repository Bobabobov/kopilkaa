import { describe, expect, it } from 'vitest';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';
import { toStoredExperience } from '@/lib/userLevel/economy';

describe('resolveUserProfileLevel', () => {
  it('должно вернуть 1 уровень при нулевом опыте, даже если в БД записан более высокий level', () => {
    expect(
      resolveUserProfileLevel({ level: 5, experience: 0 }),
    ).toBe(1);
  });

  it('должно вернуть уровень по опыту, а не по устаревшему полю level', () => {
    const experience = toStoredExperience(450);
    expect(
      resolveUserProfileLevel({ level: 1, experience }),
    ).toBe(2);
  });

  it('должно вернуть 1 уровень после сброса админом', () => {
    expect(
      resolveUserProfileLevel({ level: 1, experience: 0 }),
    ).toBe(1);
  });
});
