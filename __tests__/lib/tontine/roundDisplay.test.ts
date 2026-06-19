import { TontineRoundStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import {
  pickDisplayRound,
  pickDisplayRoundForStatus,
  resolveGraveRoundIds,
  shouldRunDailyElimination,
} from '@/lib/tontine/roundDisplay';

describe('pickDisplayRound', () => {
  it('должно вернуть активный раунд если он есть', () => {
    const rounds = [
      {
        id: 'old-finished',
        roundNumber: 1,
        status: TontineRoundStatus.FINISHED,
        startedAt: new Date('2026-06-10T00:00:00.000Z'),
      },
      {
        id: 'active',
        roundNumber: 2,
        status: TontineRoundStatus.ACTIVE,
        startedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
    ];

    expect(pickDisplayRound(rounds)?.id).toBe('active');
  });

  it('должно вернуть последний завершённый раунд если активного нет', () => {
    const rounds = [
      {
        id: 'round-1',
        roundNumber: 1,
        status: TontineRoundStatus.FINISHED,
        startedAt: new Date('2026-06-10T00:00:00.000Z'),
      },
      {
        id: 'round-2',
        roundNumber: 2,
        status: TontineRoundStatus.FINISHED,
        startedAt: new Date('2026-06-14T00:00:00.000Z'),
      },
    ];

    expect(pickDisplayRound(rounds)?.id).toBe('round-2');
  });
});

describe('pickDisplayRoundForStatus', () => {
  it('должно показать завершённый раунд если активный пустой', () => {
    const rounds = [
      {
        id: 'finished-2',
        roundNumber: 2,
        status: TontineRoundStatus.FINISHED,
        startedAt: new Date('2026-06-16T13:59:07.774Z'),
        participantCount: 1,
      },
      {
        id: 'active-empty',
        roundNumber: 3,
        status: TontineRoundStatus.ACTIVE,
        startedAt: new Date('2026-06-18T13:55:00.006Z'),
        participantCount: 0,
      },
    ];

    expect(pickDisplayRoundForStatus(rounds)?.id).toBe('finished-2');
  });

  it('должно оставить активный раунд если в нём есть участники', () => {
    const rounds = [
      {
        id: 'finished-2',
        roundNumber: 2,
        status: TontineRoundStatus.FINISHED,
        startedAt: new Date('2026-06-16T13:59:07.774Z'),
        participantCount: 1,
      },
      {
        id: 'active',
        roundNumber: 3,
        status: TontineRoundStatus.ACTIVE,
        startedAt: new Date('2026-06-18T13:55:00.006Z'),
        participantCount: 2,
      },
    ];

    expect(pickDisplayRoundForStatus(rounds)?.id).toBe('active');
  });
});

describe('shouldRunDailyElimination', () => {
  it('должно прогонять выбывание только для активного раунда', () => {
    expect(shouldRunDailyElimination(TontineRoundStatus.ACTIVE)).toBe(true);
    expect(shouldRunDailyElimination(TontineRoundStatus.FINISHED)).toBe(false);
  });
});

describe('resolveGraveRoundIds', () => {
  it('должно добавить прошлый раунд для могил при новом активном раунде', () => {
    expect(
      resolveGraveRoundIds(
        {
          id: 'round-2',
          roundNumber: 2,
          status: TontineRoundStatus.ACTIVE,
        },
        'round-1',
      ),
    ).toEqual(['round-2', 'round-1']);
  });

  it('должно не дублировать id раунда', () => {
    expect(
      resolveGraveRoundIds(
        {
          id: 'round-1',
          roundNumber: 1,
          status: TontineRoundStatus.FINISHED,
        },
        'round-1',
      ),
    ).toEqual(['round-1']);
  });
});
