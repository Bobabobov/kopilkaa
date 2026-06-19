import {
  TontineParticipantStatus,
  TontineRoundStatus,
  type Prisma,
} from '@prisma/client';
import { prisma } from '@/lib/db';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';
import { computeNextCheckInStreak, isParticipantStillAlive } from '@/lib/tontine/aliveLogic';
import {
  VYZHIVANIE_MIN_ELIMINATED_FOR_WIN,
  VYZHIVANIE_PRIZE_RUB,
} from '@/lib/tontine/constants';
import { grantAchievement } from '@/lib/achievements/unlock';
import { ACHIEVEMENT_SLUGS } from '@/lib/achievements/definitions';
import {
  pickDisplayRoundForStatus,
  resolveGraveRoundIds,
  shouldRunDailyElimination,
} from '@/lib/tontine/roundDisplay';
import {
  getGraveNickname,
  layoutGraveScattered,
} from '@/lib/vyzhivanie/graveyard';
import {
  type TontineGraveDto,
} from '@/lib/tontine/worldPosition';

export type TontinePublicStats = {
  roundId: string;
  roundNumber: number;
  status: TontineRoundStatus;
  startedAt: string;
  finishedAt: string | null;
  daysRunning: number;
  aliveCount: number;
  eliminatedCount: number;
  totalParticipants: number;
  prizeRub: number;
  winner: {
    id: string;
    username: string | null;
    name: string | null;
    avatar: string | null;
  } | null;
};

export type TontineUserState =
  | { joined: false }
  | {
      joined: true;
      participantId: string;
      displayName: string;
      status: TontineParticipantStatus;
      checkInStreak: number;
      lastCheckInDate: string | null;
      lastCheckInAt: string | null;
      canCheckInToday: boolean;
      checkedInToday: boolean;
      eliminatedAt: string | null;
      joinedAt: string;
    };

export type TontineStatus = TontinePublicStats & {
  user: TontineUserState;
  isAuthenticated: boolean;
  serverNow: string;
  graves: TontineGraveDto[];
};

async function eliminateParticipant(
  tx: Prisma.TransactionClient,
  participantId: string,
  now: Date,
): Promise<void> {
  await tx.tontineParticipant.update({
    where: { id: participantId },
    data: {
      status: TontineParticipantStatus.ELIMINATED,
      eliminatedAt: now,
    },
  });
}

async function fetchGravesForRounds(
  tx: Prisma.TransactionClient,
  roundIds: string[],
): Promise<TontineGraveDto[]> {
  if (roundIds.length === 0) return [];

  const rows = await tx.tontineParticipant.findMany({
    where: {
      roundId: { in: roundIds },
      status: TontineParticipantStatus.ELIMINATED,
    },
    select: {
      id: true,
      userId: true,
      joinedAt: true,
      eliminatedAt: true,
      lastCheckInAt: true,
      user: {
        select: { name: true, username: true },
      },
    },
    orderBy: { eliminatedAt: 'asc' },
    take: 10_000,
  });

  return rows.map((row, index) => {
    const { x, y } = layoutGraveScattered(index);
    return {
      id: row.id,
      userId: row.userId,
      displayName: getGraveNickname(row.user),
      x,
      y,
      joinedAt: row.joinedAt.toISOString(),
      eliminatedAt: row.eliminatedAt?.toISOString() ?? new Date().toISOString(),
      lastCheckInAt: row.lastCheckInAt?.toISOString() ?? null,
    };
  });
}

async function getNextRoundNumber(tx: Prisma.TransactionClient): Promise<number> {
  const last = await tx.tontineRound.findFirst({
    orderBy: { roundNumber: 'desc' },
    select: { roundNumber: true },
  });
  return (last?.roundNumber ?? 0) + 1;
}

export async function ensureActiveRound(
  tx: Prisma.TransactionClient = prisma,
): Promise<{ id: string; roundNumber: number; startedAt: Date }> {
  const active = await tx.tontineRound.findFirst({
    where: { status: TontineRoundStatus.ACTIVE },
    orderBy: { startedAt: 'desc' },
    select: { id: true, roundNumber: true, startedAt: true },
  });

  if (active) return active;

  const roundNumber = await getNextRoundNumber(tx);
  const created = await tx.tontineRound.create({
    data: { roundNumber },
    select: { id: true, roundNumber: true, startedAt: true },
  });

  return created;
}

const participantSelect = {
  id: true,
  user: {
    select: {
      username: true,
      name: true,
    },
  },
  status: true,
  checkInStreak: true,
  lastCheckInDate: true,
  lastCheckInAt: true,
  eliminatedAt: true,
  joinedAt: true,
} as const;

async function getActiveRound(
  tx: Prisma.TransactionClient,
): Promise<{
  id: string;
  roundNumber: number;
  startedAt: Date;
  status: TontineRoundStatus;
} | null> {
  return tx.tontineRound.findFirst({
    where: { status: TontineRoundStatus.ACTIVE },
    orderBy: { startedAt: 'desc' },
    select: {
      id: true,
      roundNumber: true,
      startedAt: true,
      status: true,
    },
  });
}

async function getDisplayRound(
  tx: Prisma.TransactionClient,
): Promise<{
  id: string;
  roundNumber: number;
  startedAt: Date;
  status: TontineRoundStatus;
}> {
  const rounds = await tx.tontineRound.findMany({
    select: {
      id: true,
      roundNumber: true,
      startedAt: true,
      status: true,
      _count: { select: { participants: true } },
    },
  });

  const roundsWithCounts = rounds.map((round) => ({
    id: round.id,
    roundNumber: round.roundNumber,
    startedAt: round.startedAt,
    status: round.status,
    participantCount: round._count.participants,
  }));

  const picked = pickDisplayRoundForStatus(roundsWithCounts);
  if (picked) return picked;

  const roundNumber = await getNextRoundNumber(tx);
  const created = await tx.tontineRound.create({
    data: { roundNumber },
    select: {
      id: true,
      roundNumber: true,
      startedAt: true,
      status: true,
    },
  });

  return created;
}

async function findPreviousFinishedRoundId(
  tx: Prisma.TransactionClient,
  beforeRoundNumber: number,
): Promise<string | null> {
  const previous = await tx.tontineRound.findFirst({
    where: {
      status: TontineRoundStatus.FINISHED,
      roundNumber: { lt: beforeRoundNumber },
    },
    orderBy: { roundNumber: 'desc' },
    select: { id: true },
  });

  return previous?.id ?? null;
}

async function findUserParticipantForDisplay(
  tx: Prisma.TransactionClient,
  userId: string,
  displayRound: { id: string; roundNumber: number },
) {
  const inDisplayRound = await tx.tontineParticipant.findUnique({
    where: {
      roundId_userId: {
        roundId: displayRound.id,
        userId,
      },
    },
    select: participantSelect,
  });

  if (inDisplayRound) return inDisplayRound;

  return tx.tontineParticipant.findFirst({
    where: {
      userId,
      status: TontineParticipantStatus.ELIMINATED,
      round: {
        roundNumber: { lt: displayRound.roundNumber },
      },
    },
    orderBy: { round: { roundNumber: 'desc' } },
    select: participantSelect,
  });
}

async function eliminateStaleParticipants(
  roundId: string,
  todayKey: string,
  now: Date,
  tx: Prisma.TransactionClient,
): Promise<number> {
  const alive = await tx.tontineParticipant.findMany({
    where: { roundId, status: TontineParticipantStatus.ALIVE },
    select: {
      id: true,
      lastCheckInDate: true,
      joinedAt: true,
    },
  });

  const toEliminate: string[] = [];

  for (const p of alive) {
    const joinedDayKey = toUtcDayKey(p.joinedAt);
    const stillAlive = isParticipantStillAlive({
      lastCheckInDate: p.lastCheckInDate,
      joinedDayKey,
      todayKey,
    });

    if (!stillAlive) {
      toEliminate.push(p.id);
    }
  }

  if (toEliminate.length === 0) return 0;

  for (const id of toEliminate) {
    await eliminateParticipant(tx, id, now);
  }

  return toEliminate.length;
}

async function tryFinishRound(
  roundId: string,
  now: Date,
  tx: Prisma.TransactionClient,
): Promise<boolean> {
  const round = await tx.tontineRound.findUnique({
    where: { id: roundId },
    select: { status: true },
  });

  if (!round || round.status !== TontineRoundStatus.ACTIVE) {
    return false;
  }

  const [aliveCount, eliminatedCount] = await Promise.all([
    tx.tontineParticipant.count({
      where: { roundId, status: TontineParticipantStatus.ALIVE },
    }),
    tx.tontineParticipant.count({
      where: { roundId, status: TontineParticipantStatus.ELIMINATED },
    }),
  ]);

  if (aliveCount === 1 && eliminatedCount >= VYZHIVANIE_MIN_ELIMINATED_FOR_WIN) {
    const winner = await tx.tontineParticipant.findFirst({
      where: { roundId, status: TontineParticipantStatus.ALIVE },
      select: { id: true, userId: true },
    });

    if (!winner) return false;

    await tx.tontineParticipant.update({
      where: { id: winner.id },
      data: { status: TontineParticipantStatus.WINNER },
    });

    await tx.tontineRound.update({
      where: { id: roundId },
      data: {
        status: TontineRoundStatus.FINISHED,
        finishedAt: now,
        winnerId: winner.userId,
      },
    });

    grantAchievement(winner.userId, ACHIEVEMENT_SLUGS.TONTINE_WINNER).catch(
      () => undefined,
    );

    return true;
  }

  if (aliveCount === 0 && eliminatedCount > 0) {
    await tx.tontineRound.update({
      where: { id: roundId },
      data: {
        status: TontineRoundStatus.FINISHED,
        finishedAt: now,
      },
    });
    return true;
  }

  return false;
}

function buildUserState(
  participant: {
    id: string;
    user: {
      username: string | null;
      name: string | null;
    };
    status: TontineParticipantStatus;
    checkInStreak: number;
    lastCheckInDate: string | null;
    lastCheckInAt: Date | null;
    eliminatedAt: Date | null;
    joinedAt: Date;
  } | null,
  todayKey: string,
): TontineUserState {
  if (!participant) {
    return { joined: false };
  }

  const checkedInToday = participant.lastCheckInDate === todayKey;
  const isAlive =
    participant.status === TontineParticipantStatus.ALIVE ||
    participant.status === TontineParticipantStatus.WINNER;
  const displayName =
    participant.user.name?.trim() ||
    participant.user.username?.trim() ||
    `игрок-${participant.id.slice(0, 5)}`;

  return {
    joined: true,
    participantId: participant.id,
    displayName,
    status: participant.status,
    checkInStreak: participant.checkInStreak,
    lastCheckInDate: participant.lastCheckInDate,
    lastCheckInAt: participant.lastCheckInAt?.toISOString() ?? null,
    canCheckInToday: isAlive && !checkedInToday,
    checkedInToday,
    eliminatedAt: participant.eliminatedAt?.toISOString() ?? null,
    joinedAt: participant.joinedAt.toISOString(),
  };
}

export async function getTontineStatus(
  userId: string | null,
  now = new Date(),
): Promise<TontineStatus> {
  const todayKey = toUtcDayKey(now);

  return prisma.$transaction(async (tx) => {
    const activeRound = await getActiveRound(tx);

    if (activeRound && shouldRunDailyElimination(activeRound.status)) {
      await eliminateStaleParticipants(activeRound.id, todayKey, now, tx);
      await tryFinishRound(activeRound.id, now, tx);
    }

    const displayRound = await getDisplayRound(tx);

    const fullRound = await tx.tontineRound.findUnique({
      where: { id: displayRound.id },
      include: {
        winner: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        participants: {
          select: { status: true },
        },
      },
    });

    if (!fullRound) {
      throw new Error('Активный раунд не найден');
    }

    const aliveCount = fullRound.participants.filter(
      (p) =>
        p.status === TontineParticipantStatus.ALIVE ||
        p.status === TontineParticipantStatus.WINNER,
    ).length;
    const eliminatedCount = fullRound.participants.filter(
      (p) => p.status === TontineParticipantStatus.ELIMINATED,
    ).length;

    let participant = null;
    if (userId) {
      participant = await findUserParticipantForDisplay(tx, userId, fullRound);
    }

    const daysRunning = Math.max(
      1,
      Math.floor(
        (now.getTime() - fullRound.startedAt.getTime()) / (24 * 60 * 60 * 1000),
      ) + 1,
    );

    const previousFinishedRoundId = await findPreviousFinishedRoundId(
      tx,
      fullRound.roundNumber,
    );
    const graveRoundIds = resolveGraveRoundIds(
      fullRound,
      previousFinishedRoundId,
    );
    const graves = await fetchGravesForRounds(tx, graveRoundIds);

    return {
      roundId: fullRound.id,
      roundNumber: fullRound.roundNumber,
      status: fullRound.status,
      startedAt: fullRound.startedAt.toISOString(),
      finishedAt: fullRound.finishedAt?.toISOString() ?? null,
      daysRunning,
      aliveCount,
      eliminatedCount,
      totalParticipants: fullRound.participants.length,
      prizeRub: VYZHIVANIE_PRIZE_RUB,
      winner: fullRound.winner
        ? {
            id: fullRound.winner.id,
            username: fullRound.winner.username,
            name: fullRound.winner.name,
            avatar: fullRound.winner.avatar,
          }
        : null,
      user: buildUserState(participant, todayKey),
      isAuthenticated: Boolean(userId),
      serverNow: now.toISOString(),
      graves,
    };
  });
}

export class TontineAlreadyJoinedError extends Error {
  constructor() {
    super('Вы уже участвуете в текущем раунде');
    this.name = 'TontineAlreadyJoinedError';
  }
}

export class TontineRoundClosedError extends Error {
  constructor() {
    super('Текущий раунд уже завершён');
    this.name = 'TontineRoundClosedError';
  }
}

export class TontineNotParticipantError extends Error {
  constructor() {
    super('Вы не участвуете в текущем раунде');
    this.name = 'TontineNotParticipantError';
  }
}

export class TontineEliminatedError extends Error {
  constructor() {
    super('Вы выбыли из игры');
    this.name = 'TontineEliminatedError';
  }
}

export class TontineAlreadyCheckedInError extends Error {
  constructor() {
    super('Сегодня вы уже отметились');
    this.name = 'TontineAlreadyCheckedInError';
  }
}

export async function joinTontineRound(
  userId: string,
  now = new Date(),
): Promise<TontineStatus> {
  const todayKey = toUtcDayKey(now);

  await prisma.$transaction(async (tx) => {
    const round = await ensureActiveRound(tx);

    const existing = await tx.tontineParticipant.findUnique({
      where: {
        roundId_userId: { roundId: round.id, userId },
      },
    });

    if (existing) {
      throw new TontineAlreadyJoinedError();
    }

    const roundStatus = await tx.tontineRound.findUnique({
      where: { id: round.id },
      select: { status: true },
    });

    if (roundStatus?.status !== TontineRoundStatus.ACTIVE) {
      throw new TontineRoundClosedError();
    }

    const participant = await tx.tontineParticipant.create({
      data: {
        roundId: round.id,
        userId,
        lastCheckInDate: todayKey,
        lastCheckInAt: now,
        checkInStreak: 1,
      },
    });

    await tx.tontineCheckIn.create({
      data: {
        participantId: participant.id,
        checkInDate: todayKey,
      },
    });
  });

  grantAchievement(userId, ACHIEVEMENT_SLUGS.TONTINE_JOINED).catch(
    () => undefined,
  );

  return getTontineStatus(userId, now);
}

export async function checkInTontine(
  userId: string,
  now = new Date(),
): Promise<TontineStatus> {
  const todayKey = toUtcDayKey(now);

  await prisma.$transaction(async (tx) => {
    const round = await ensureActiveRound(tx);

    await eliminateStaleParticipants(round.id, todayKey, now, tx);

    const participant = await tx.tontineParticipant.findUnique({
      where: {
        roundId_userId: { roundId: round.id, userId },
      },
    });

    if (!participant) {
      throw new TontineNotParticipantError();
    }

    if (participant.status !== TontineParticipantStatus.ALIVE) {
      throw new TontineEliminatedError();
    }

    if (participant.lastCheckInDate === todayKey) {
      throw new TontineAlreadyCheckedInError();
    }

    const joinedDayKey = toUtcDayKey(participant.joinedAt);
    const stillAlive = isParticipantStillAlive({
      lastCheckInDate: participant.lastCheckInDate,
      joinedDayKey,
      todayKey,
    });

    if (!stillAlive) {
      await eliminateParticipant(tx, participant.id, now);
      throw new TontineEliminatedError();
    }

    const newStreak = computeNextCheckInStreak(
      participant.lastCheckInDate,
      todayKey,
      participant.checkInStreak,
    );

    await tx.tontineCheckIn.create({
      data: {
        participantId: participant.id,
        checkInDate: todayKey,
      },
    });

    await tx.tontineParticipant.update({
      where: { id: participant.id },
      data: {
        lastCheckInDate: todayKey,
        lastCheckInAt: now,
        checkInStreak: newStreak,
      },
    });

    await tryFinishRound(round.id, now, tx);
  });

  const status = await getTontineStatus(userId, now);

  if (
    status.user.joined &&
    status.user.checkInStreak >= 7
  ) {
    grantAchievement(userId, ACHIEVEMENT_SLUGS.TONTINE_SURVIVOR_7).catch(
      () => undefined,
    );
  }

  return status;
}
