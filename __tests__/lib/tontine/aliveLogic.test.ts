import { describe, expect, it } from 'vitest';
import {
  computeNextCheckInStreak,
  daysBetweenDayKeys,
  isParticipantStillAlive,
} from '@/lib/tontine/aliveLogic';

describe('daysBetweenDayKeys', () => {
  it('должно вернуть 0 для одного и того же дня', () => {
    expect(daysBetweenDayKeys('2026-06-16', '2026-06-16')).toBe(0);
  });

  it('должно вернуть 1 между соседними днями', () => {
    expect(daysBetweenDayKeys('2026-06-15', '2026-06-16')).toBe(1);
  });
});

describe('isParticipantStillAlive', () => {
  it('должно считать живым при отметке сегодня', () => {
    expect(
      isParticipantStillAlive({
        lastCheckInDate: '2026-06-16',
        joinedDayKey: '2026-06-10',
        todayKey: '2026-06-16',
      }),
    ).toBe(true);
  });

  it('должно считать живым при отметке вчера', () => {
    expect(
      isParticipantStillAlive({
        lastCheckInDate: '2026-06-15',
        joinedDayKey: '2026-06-10',
        todayKey: '2026-06-16',
      }),
    ).toBe(true);
  });

  it('должно считать выбывшим при пропуске дня', () => {
    expect(
      isParticipantStillAlive({
        lastCheckInDate: '2026-06-14',
        joinedDayKey: '2026-06-10',
        todayKey: '2026-06-16',
      }),
    ).toBe(false);
  });

  it('должно использовать день вступления если отметок ещё не было', () => {
    expect(
      isParticipantStillAlive({
        lastCheckInDate: null,
        joinedDayKey: '2026-06-16',
        todayKey: '2026-06-16',
      }),
    ).toBe(true);
  });
});

describe('computeNextCheckInStreak', () => {
  it('должно увеличить серию при отметке на следующий день', () => {
    expect(computeNextCheckInStreak('2026-06-15', '2026-06-16', 3)).toBe(4);
  });

  it('должно сбросить серию при пропуске', () => {
    expect(computeNextCheckInStreak('2026-06-14', '2026-06-16', 5)).toBe(1);
  });
});
