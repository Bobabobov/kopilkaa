import { TontineRoundStatus } from '@prisma/client';

export type RoundDisplayRef = {
  id: string;
  roundNumber: number;
  status: TontineRoundStatus;
};

type RoundWithParticipants<T extends RoundDisplayRef> = T & {
  startedAt: Date;
  participantCount: number;
};

/**
 * Раунд для отображения в GET /api/tontine:
 * активный, иначе последний завершённый (без автосоздания нового).
 */
export function pickDisplayRound<
  T extends RoundDisplayRef & { startedAt: Date },
>(rounds: T[]): T | null {
  if (rounds.length === 0) return null;

  const active = rounds
    .filter((round) => round.status === TontineRoundStatus.ACTIVE)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

  if (active) return active;

  return rounds.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
}

/**
 * Пустой активный раунд (авто-созданный после finish) не показываем —
 * возвращаем последний завершённый с участниками, чтобы счётчики и могилы не обнулялись.
 */
export function pickDisplayRoundForStatus<
  T extends RoundDisplayRef & { startedAt: Date },
>(rounds: RoundWithParticipants<T>[]): T | null {
  if (rounds.length === 0) return null;

  const active = rounds
    .filter((round) => round.status === TontineRoundStatus.ACTIVE)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

  if (active) {
    if (active.participantCount === 0) {
      const latestFinishedWithPlayers = rounds
        .filter(
          (round) =>
            round.status === TontineRoundStatus.FINISHED &&
            round.participantCount > 0,
        )
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

      if (latestFinishedWithPlayers) return latestFinishedWithPlayers;
    }

    return active;
  }

  return pickDisplayRound(rounds);
}

/** Нужно ли прогонять ежедневное выбывание для раунда. */
export function shouldRunDailyElimination(
  status: TontineRoundStatus,
): boolean {
  return status === TontineRoundStatus.ACTIVE;
}

/**
 * Из каких раундов показывать могилы на карте:
 * текущий + предыдущий завершённый (чтобы могилы не исчезали при новом раунде).
 */
export function resolveGraveRoundIds(
  displayRound: RoundDisplayRef,
  previousFinishedRoundId: string | null,
): string[] {
  const ids = [displayRound.id];

  if (
    displayRound.status === TontineRoundStatus.ACTIVE &&
    previousFinishedRoundId &&
    previousFinishedRoundId !== displayRound.id
  ) {
    ids.push(previousFinishedRoundId);
  }

  return ids;
}
