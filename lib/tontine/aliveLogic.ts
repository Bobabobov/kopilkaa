import { getPreviousUtcDayKey } from '@/lib/dailyBonus/dayKey';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Разница в календарных UTC-днях: to − from. */
export function daysBetweenDayKeys(from: string, to: string): number {
  const fromMs = new Date(`${from}T00:00:00.000Z`).getTime();
  const toMs = new Date(`${to}T00:00:00.000Z`).getTime();
  return Math.round((toMs - fromMs) / DAY_MS);
}

export type TontineAliveInput = {
  lastCheckInDate: string | null;
  joinedDayKey: string;
  todayKey: string;
};

/**
 * Как в Tontine: отметка нужна один раз в календарный серверный день.
 * Сегодняшняя и вчерашняя отметка ещё держат участника живым.
 */
export function isParticipantStillAlive({
  lastCheckInDate,
  joinedDayKey,
  todayKey,
}: TontineAliveInput): boolean {
  const effectiveLast = lastCheckInDate ?? joinedDayKey;
  const gap = daysBetweenDayKeys(effectiveLast, todayKey);
  return gap <= 1;
}

export function computeNextCheckInStreak(
  lastCheckInDate: string | null,
  todayKey: string,
  currentStreak: number,
): number {
  if (!lastCheckInDate) return 1;

  const yesterdayKey = getPreviousUtcDayKey(todayKey);
  if (lastCheckInDate === yesterdayKey) {
    return currentStreak + 1;
  }

  return 1;
}
