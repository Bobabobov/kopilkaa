import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { SEQUENCE_EXTRA_ATTEMPT_COST } from '@/lib/games/extraAttemptCost';
import {
  GameAttemptPurchaseInsufficientBalanceError,
  countGameAttemptPurchasesToday,
  getDailyAttemptPurchasesRemaining,
  getGamePurchasedAttemptsAvailable,
  purchaseGameAttempt,
  resolveGameAttemptSlot,
} from '@/lib/games/gameAttemptPurchases';
import { GAME_PING_BUFFER_MS, isGameReactionTimedOut } from '@/lib/games/pingBuffer';
import { evaluateDailyQuests } from '@/lib/games/quests';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';
import {
  deleteRuntimeSession,
  peekRuntimeSession,
  saveRuntimeSession,
} from '@/lib/games/runtimeSessionStore';

export const GAME_COST = 15;
export const DAILY_ATTEMPT_LIMIT = 10;
export { SEQUENCE_EXTRA_ATTEMPT_COST } from '@/lib/games/extraAttemptCost';

export const SEQUENCE_TX = {
  START: 'GAMES_SEQUENCE_START',
  EXTRA_START: 'GAMES_SEQUENCE_EXTRA_START',
  ATTEMPT_PURCHASE: 'GAMES_SEQUENCE_ATTEMPT_PURCHASE',
} as const;
export const INITIAL_SEQUENCE_LENGTH = 3;
export const GRID_BUTTON_COUNT = 9;
export const FLASH_INTERVAL_MS = 400;
export const INPUT_TIME_PER_STEP_MS = 2500;

const SESSION_TTL_MS = 15 * 60_000;

interface SequenceGameSession {
  userId: string;
  sequence: number[];
  startTime: number;
  expiresAt: number;
}
const SEQUENCE_SESSION_KEY = 'sequence-game';

export interface SequenceStartPayload {
  sequence: number[];
  currentRound: number;
  serverStartTime: number;
  timeLimitMs: number;
  balanceBefore: number;
  balanceAfter: number;
  maxSequenceRecord: number;
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
}

export type SequenceVerifyReason =
  | 'success'
  | 'wrong_answer'
  | 'timeout'
  | 'invalid_length'
  | 'no_active_session';

export interface SequenceVerifyResult {
  gameOver: boolean;
  reason: SequenceVerifyReason;
  achievedSteps: number;
  reward: number;
  balanceAfter: number | null;
  maxSequenceRecord: number;
  currentRound: number;
  reactionMs: number | null;
  nextSequence: number[] | null;
  serverStartTime: number | null;
  timeLimitMs: number | null;
}

export interface SequenceLeaderboardEntry {
  id: string;
  username: string | null;
  avatar: string | null;
  maxSequenceRecord: number;
}

export class SequenceInsufficientBalanceError extends Error {
  constructor() {
    super('Недостаточно бонусов для запуска «Секретной последовательности»');
    this.name = 'SequenceInsufficientBalanceError';
  }
}

export class SequenceDailyLimitError extends Error {
  constructor() {
    super('Достигнут суточный лимит попыток в «Секретной последовательности»');
    this.name = 'SequenceDailyLimitError';
  }
}

export class SequencePurchaseInsufficientBalanceError extends GameAttemptPurchaseInsufficientBalanceError {}

async function lockUserRowIfSupported(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL ?? '';
  const isSqlite = databaseUrl.startsWith('file:');

  if (isSqlite) {
    return;
  }

  await tx.$executeRaw`SELECT 1 FROM "User" WHERE id = ${userId} FOR UPDATE`;
}

function generateSequence(length: number): number[] {
  return Array.from({ length }, () => crypto.randomInt(0, GRID_BUTTON_COUNT));
}

function extendSequence(sequence: number[]): number[] {
  return [...sequence, crypto.randomInt(0, GRID_BUTTON_COUNT)];
}

/** Время на просмотр вспышек + ввод всей цепочки. */
export function getRoundTimeLimitMs(sequenceLength: number): number {
  const playbackMs = sequenceLength * FLASH_INTERVAL_MS + 300;
  const inputMs = sequenceLength * INPUT_TIME_PER_STEP_MS;
  return playbackMs + inputMs + GAME_PING_BUFFER_MS;
}

/** Ступенчатая награда при проигрыше по достигнутой длине цепочки. */
export function calculateCheckpointReward(achievedSteps: number): number {
  if (achievedSteps < 4) {
    return 0;
  }
  if (achievedSteps <= 5) {
    return 15;
  }
  if (achievedSteps <= 9) {
    return 30;
  }
  return 50 + (achievedSteps - 10) * 2;
}

function getUtcDayBounds(): { start: Date; end: Date } {
  const dayKey = toUtcDayKey(new Date());
  const start = new Date(`${dayKey}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export async function countSequenceAttemptsToday(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const { start, end } = getUtcDayBounds();

  return db.bonusTransaction.count({
    where: {
      userId,
      type: SEQUENCE_TX.START,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function getSequencePurchasedAttemptsAvailable(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  return getGamePurchasedAttemptsAvailable(userId, SEQUENCE_TX, db);
}

export async function purchaseSequenceAttempt(userId: string) {
  return purchaseGameAttempt(
    userId,
    SEQUENCE_TX,
    'Покупка дополнительной попытки в «Секретной последовательности»',
    SEQUENCE_EXTRA_ATTEMPT_COST,
  );
}

async function grantSequenceReward(
  tx: Prisma.TransactionClient,
  userId: string,
  reward: number,
  achievedSteps: number,
): Promise<void> {
  if (reward <= 0) {
    return;
  }

  await tx.goodDeedBonusGrant.create({
    data: {
      userId,
      amountBonuses: reward,
      comment: `Награда за «Секретную последовательность» (${achievedSteps} шагов)`,
    },
  });
}

async function updateMaxSequenceRecordIfNeeded(
  tx: Prisma.TransactionClient,
  userId: string,
  completedLength: number,
): Promise<number> {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { maxSequenceRecord: true },
  });

  const currentRecord = user?.maxSequenceRecord ?? 0;

  if (completedLength <= currentRecord) {
    return currentRecord;
  }

  const updated = await tx.user.update({
    where: { id: userId },
    data: { maxSequenceRecord: completedLength },
    select: { maxSequenceRecord: true },
  });

  return updated.maxSequenceRecord;
}

async function finalizeGameOver(
  userId: string,
  achievedSteps: number,
  completedLengthForRecord: number,
): Promise<{ reward: number; balanceAfter: number; maxSequenceRecord: number }> {
  const reward = calculateCheckpointReward(achievedSteps);

  return prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    await grantSequenceReward(tx, userId, reward, achievedSteps);

    const maxSequenceRecord = await updateMaxSequenceRecordIfNeeded(
      tx,
      userId,
      completedLengthForRecord,
    );

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);

    return {
      reward,
      balanceAfter: walletAfter.availableBonuses,
      maxSequenceRecord,
    };
  });
}

export async function startSequenceGame(
  userId: string,
): Promise<SequenceStartPayload> {
  const sequence = generateSequence(INITIAL_SEQUENCE_LENGTH);
  const startTime = Date.now();
  const timeLimitMs = getRoundTimeLimitMs(sequence.length);

  const result = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const attemptsToday = await countSequenceAttemptsToday(userId, tx);
    const purchasedAvailable = await getSequencePurchasedAttemptsAvailable(
      userId,
      tx,
    );
    const attemptSlot = resolveGameAttemptSlot({
      attemptsToday,
      dailyLimit: DAILY_ATTEMPT_LIMIT,
      purchasedAvailable,
    });

    if (!attemptSlot) {
      throw new SequenceDailyLimitError();
    }

    const { usesExtraAttempt } = attemptSlot;

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceBefore = walletBefore.availableBonuses;

    if (balanceBefore < GAME_COST) {
      throw new SequenceInsufficientBalanceError();
    }

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: GAME_COST,
        type: usesExtraAttempt ? SEQUENCE_TX.EXTRA_START : SEQUENCE_TX.START,
        description: usesExtraAttempt
          ? 'Списание бонусов за доп. запуск «Секретной последовательности»'
          : 'Списание бонусов за запуск «Секретной последовательности»',
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { maxSequenceRecord: true },
    });

    const dailyAttemptsUsed = usesExtraAttempt
      ? attemptsToday
      : attemptsToday + 1;
    const purchasedAttemptsAvailable = await getSequencePurchasedAttemptsAvailable(
      userId,
      tx,
    );

    return {
      balanceBefore,
      balanceAfter: walletAfter.availableBonuses,
      maxSequenceRecord: user?.maxSequenceRecord ?? 0,
      dailyAttemptsUsed,
      dailyAttemptsLeft: Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed),
      purchasedAttemptsAvailable,
    };
  });

  await saveRuntimeSession<SequenceGameSession>({
    userId,
    gameKey: SEQUENCE_SESSION_KEY,
    payload: {
      userId,
      sequence,
      startTime,
      expiresAt: startTime + SESSION_TTL_MS,
    },
    expiresAtMs: startTime + SESSION_TTL_MS,
  });

  return {
    sequence,
    currentRound: 1,
    serverStartTime: startTime,
    timeLimitMs,
    balanceBefore: result.balanceBefore,
    balanceAfter: result.balanceAfter,
    maxSequenceRecord: result.maxSequenceRecord,
    dailyAttemptsUsed: result.dailyAttemptsUsed,
    dailyAttemptsLeft: result.dailyAttemptsLeft,
    purchasedAttemptsAvailable: result.purchasedAttemptsAvailable,
  };
}

function sequencesMatch(expected: number[], clicks: number[]): boolean {
  if (expected.length !== clicks.length) {
    return false;
  }

  return expected.every((value, index) => value === clicks[index]);
}

export async function verifySequenceClicks(
  userId: string,
  clicks: number[],
): Promise<SequenceVerifyResult> {
  const session = await peekRuntimeSession<SequenceGameSession>(
    userId,
    SEQUENCE_SESSION_KEY,
  );

  if (!session) {
    return {
      gameOver: true,
      reason: 'no_active_session',
      achievedSteps: 0,
      reward: 0,
      balanceAfter: null,
      maxSequenceRecord: 0,
      currentRound: 0,
      reactionMs: null,
      nextSequence: null,
      serverStartTime: null,
      timeLimitMs: null,
    };
  }

  const answeredAt = Date.now();
  const reactionMs = answeredAt - session.startTime;
  const timeLimitMs = getRoundTimeLimitMs(session.sequence.length);
  const achievedSteps = session.sequence.length;
  const currentRound =
    session.sequence.length - INITIAL_SEQUENCE_LENGTH + 1;

  if (isGameReactionTimedOut(reactionMs, timeLimitMs - GAME_PING_BUFFER_MS)) {
    await deleteRuntimeSession(userId, SEQUENCE_SESSION_KEY);

    const lastCompletedLength = Math.max(0, session.sequence.length - 1);
    const finalized = await finalizeGameOver(
      userId,
      achievedSteps,
      lastCompletedLength,
    );

    return {
      gameOver: true,
      reason: 'timeout',
      achievedSteps,
      reward: finalized.reward,
      balanceAfter: finalized.balanceAfter,
      maxSequenceRecord: finalized.maxSequenceRecord,
      currentRound,
      reactionMs,
      nextSequence: null,
      serverStartTime: null,
      timeLimitMs: null,
    };
  }

  if (clicks.length !== session.sequence.length) {
    await deleteRuntimeSession(userId, SEQUENCE_SESSION_KEY);

    const lastCompletedLength = Math.max(0, session.sequence.length - 1);
    const finalized = await finalizeGameOver(
      userId,
      achievedSteps,
      lastCompletedLength,
    );

    return {
      gameOver: true,
      reason: 'invalid_length',
      achievedSteps,
      reward: finalized.reward,
      balanceAfter: finalized.balanceAfter,
      maxSequenceRecord: finalized.maxSequenceRecord,
      currentRound,
      reactionMs,
      nextSequence: null,
      serverStartTime: null,
      timeLimitMs: null,
    };
  }

  if (!sequencesMatch(session.sequence, clicks)) {
    await deleteRuntimeSession(userId, SEQUENCE_SESSION_KEY);

    const lastCompletedLength = Math.max(0, session.sequence.length - 1);
    const finalized = await finalizeGameOver(
      userId,
      achievedSteps,
      lastCompletedLength,
    );

    return {
      gameOver: true,
      reason: 'wrong_answer',
      achievedSteps,
      reward: finalized.reward,
      balanceAfter: finalized.balanceAfter,
      maxSequenceRecord: finalized.maxSequenceRecord,
      currentRound,
      reactionMs,
      nextSequence: null,
      serverStartTime: null,
      timeLimitMs: null,
    };
  }

  const completedLength = session.sequence.length;

  const maxSequenceRecord = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);
    await evaluateDailyQuests(
      userId,
      { sequenceStepsCompleted: completedLength },
      tx,
    );
    return updateMaxSequenceRecordIfNeeded(tx, userId, completedLength);
  });

  const nextSequence = extendSequence(session.sequence);
  const nextStartTime = Date.now();
  const nextTimeLimitMs = getRoundTimeLimitMs(nextSequence.length);
  const nextRound = nextSequence.length - INITIAL_SEQUENCE_LENGTH + 1;

  await saveRuntimeSession<SequenceGameSession>({
    userId,
    gameKey: SEQUENCE_SESSION_KEY,
    payload: {
      userId,
      sequence: nextSequence,
      startTime: nextStartTime,
      expiresAt: nextStartTime + SESSION_TTL_MS,
    },
    expiresAtMs: nextStartTime + SESSION_TTL_MS,
  });

  return {
    gameOver: false,
    reason: 'success',
    achievedSteps: completedLength,
    reward: 0,
    balanceAfter: null,
    maxSequenceRecord,
    currentRound: nextRound,
    reactionMs,
    nextSequence,
    serverStartTime: nextStartTime,
    timeLimitMs: nextTimeLimitMs,
  };
}

export async function getSequenceLeaderboard(): Promise<SequenceLeaderboardEntry[]> {
  const users = await prisma.user.findMany({
    where: {
      maxSequenceRecord: { gt: 0 },
    },
    orderBy: { maxSequenceRecord: 'desc' },
    take: 10,
    select: {
      id: true,
      username: true,
      avatar: true,
      maxSequenceRecord: true,
    },
  });

  return users;
}

export async function getSequencePlayerStats(userId: string): Promise<{
  maxSequenceRecord: number;
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
}> {
  const [
    user,
    dailyAttemptsUsed,
    purchasedAttemptsAvailable,
    dailyAttemptPurchasesUsed,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { maxSequenceRecord: true },
    }),
    countSequenceAttemptsToday(userId),
    getSequencePurchasedAttemptsAvailable(userId),
    countGameAttemptPurchasesToday(userId, SEQUENCE_TX),
  ]);

  return {
    maxSequenceRecord: user?.maxSequenceRecord ?? 0,
    dailyAttemptsUsed,
    dailyAttemptsLeft: Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed),
    purchasedAttemptsAvailable,
    dailyAttemptPurchasesUsed,
    dailyAttemptPurchasesRemaining: getDailyAttemptPurchasesRemaining(
      dailyAttemptPurchasesUsed,
    ),
  };
}

export async function hasActiveSequenceSession(userId: string): Promise<boolean> {
  const session = await peekRuntimeSession<SequenceGameSession>(
    userId,
    SEQUENCE_SESSION_KEY,
  );
  return session !== null;
}
