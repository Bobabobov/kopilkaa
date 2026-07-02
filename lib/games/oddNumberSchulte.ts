import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { SEQUENCE_EXTRA_ATTEMPT_COST } from '@/lib/games/extraAttemptCost';
import {
  countGameAttemptPurchasesToday,
  getDailyAttemptPurchasesRemaining,
  getGamePurchasedAttemptsAvailable,
  purchaseGameAttempt,
  resolveGameAttemptSlot,
} from '@/lib/games/gameAttemptPurchases';
import { isGameReactionTimedOut } from '@/lib/games/pingBuffer';

export const GRID_SIZE = 4;
export const GRID_CELL_COUNT = GRID_SIZE * GRID_SIZE;
export const TARGET_COUNT = GRID_CELL_COUNT;
/** 10 секунд на всю таблицу 1→16. */
export const TIME_LIMIT_MS = 10_000;
export const GAME_COST = 15;
export const WIN_REWARD = 25;
export const DAILY_ATTEMPT_LIMIT = 10;

export const ODD_NUMBER_SCHULTE_TX = {
  START: 'GAMES_ODD_NUMBER_SCHULTE_START',
  EXTRA_START: 'GAMES_ODD_NUMBER_SCHULTE_EXTRA_START',
  ATTEMPT_PURCHASE: 'GAMES_ODD_NUMBER_SCHULTE_ATTEMPT_PURCHASE',
} as const;

export interface OddNumberCell {
  index: number;
  value: number;
}

interface SchulteSession {
  userId: string;
  cells: OddNumberCell[];
  startTime: number;
  expiresAt: number;
}

export interface OddNumberStartPayload {
  cells: OddNumberCell[];
  timeLimitMs: number;
  serverStartTime: number;
  balanceBefore: number;
  balanceAfter: number;
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
}

export type OddNumberAnswerReason =
  | 'success'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface OddNumberAnswerResult {
  gameOver: boolean;
  won: boolean;
  reason: OddNumberAnswerReason;
  reactionMs: number | null;
  reward: number;
  balanceAfter: number | null;
  /** Сколько чисел верно нажато подряд с начала (0–16). */
  progress: number;
}

export class OddNumberInsufficientBalanceError extends Error {
  constructor() {
    super('Недостаточно бонусов для запуска «Лишнего числа»');
    this.name = 'OddNumberInsufficientBalanceError';
  }
}

export class OddNumberDailyLimitError extends Error {
  constructor() {
    super('Достигнут суточный лимит попыток в «Лишнем числе»');
    this.name = 'OddNumberDailyLimitError';
  }
}

const SESSION_TTL_MS = TIME_LIMIT_MS + 60_000;

const globalForOddNumber = globalThis as unknown as {
  oddNumberSchulteSessions?: Map<string, SchulteSession>;
};

function getSessionStore(): Map<string, SchulteSession> {
  if (!globalForOddNumber.oddNumberSchulteSessions) {
    globalForOddNumber.oddNumberSchulteSessions = new Map();
  }
  return globalForOddNumber.oddNumberSchulteSessions;
}

function purgeExpiredSessions(store: Map<string, SchulteSession>): void {
  const now = Date.now();
  for (const [userId, session] of store.entries()) {
    if (session.expiresAt <= now) {
      store.delete(userId);
    }
  }
}

function saveSession(session: SchulteSession): void {
  const store = getSessionStore();
  purgeExpiredSessions(store);
  store.set(session.userId, session);
}

function takeSession(userId: string): SchulteSession | null {
  const store = getSessionStore();
  purgeExpiredSessions(store);
  const session = store.get(userId) ?? null;
  if (session) {
    store.delete(userId);
  }
  return session;
}

function peekSession(userId: string): SchulteSession | null {
  const store = getSessionStore();
  purgeExpiredSessions(store);
  const session = store.get(userId) ?? null;
  if (!session || session.expiresAt <= Date.now()) {
    store.delete(userId);
    return null;
  }
  return session;
}

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

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(0, index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

/** Перемешанная таблица Шульте: числа 1–16 в случайных клетках. */
export function generateSchulteGrid(): OddNumberCell[] {
  const values = shuffleArray(
    Array.from({ length: TARGET_COUNT }, (_, index) => index + 1),
  );

  return values.map((value, index) => ({ index, value }));
}

function getCellValue(session: SchulteSession, selectedIndex: number): number | null {
  const cell = session.cells.find((item) => item.index === selectedIndex);
  return cell?.value ?? null;
}

/** Проверка цепочки кликов без обращения к БД (для тестов). */
export function validateSchulteClickSequence(
  cells: OddNumberCell[],
  clicks: number[],
): { valid: boolean; progress: number } {
  for (let step = 0; step < clicks.length; step += 1) {
    const cell = cells.find((item) => item.index === clicks[step]);
    if (!cell || cell.value !== step + 1) {
      return { valid: false, progress: step };
    }
  }

  return { valid: true, progress: clicks.length };
}

function buildGameOverResult(
  reason: OddNumberAnswerReason,
  won: boolean,
  reactionMs: number | null,
  reward: number,
  balanceAfter: number | null,
  progress: number,
): OddNumberAnswerResult {
  return {
    gameOver: true,
    won,
    reason,
    reactionMs,
    reward,
    balanceAfter,
    progress,
  };
}

function getUtcDayBounds(): { start: Date; end: Date } {
  const dayKey = toUtcDayKey(new Date());
  const start = new Date(`${dayKey}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export async function countOddNumberAttemptsToday(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const { start, end } = getUtcDayBounds();

  return db.bonusTransaction.count({
    where: {
      userId,
      type: ODD_NUMBER_SCHULTE_TX.START,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function getOddNumberPurchasedAttemptsAvailable(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  return getGamePurchasedAttemptsAvailable(userId, ODD_NUMBER_SCHULTE_TX, db);
}

export async function purchaseOddNumberAttempt(userId: string) {
  return purchaseGameAttempt(
    userId,
    ODD_NUMBER_SCHULTE_TX,
    'Покупка доп. попытки в «Лишнем числе»',
    SEQUENCE_EXTRA_ATTEMPT_COST,
  );
}

export async function getOddNumberPlayerStats(userId: string): Promise<{
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
}> {
  const [dailyAttemptsUsed, purchasedAttemptsAvailable, dailyAttemptPurchasesUsed] =
    await Promise.all([
      countOddNumberAttemptsToday(userId),
      getOddNumberPurchasedAttemptsAvailable(userId),
      countGameAttemptPurchasesToday(userId, ODD_NUMBER_SCHULTE_TX),
    ]);

  return {
    dailyAttemptsUsed,
    dailyAttemptsLeft: Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed),
    purchasedAttemptsAvailable,
    dailyAttemptPurchasesUsed,
    dailyAttemptPurchasesRemaining: getDailyAttemptPurchasesRemaining(
      dailyAttemptPurchasesUsed,
    ),
  };
}

export async function startOddNumberGame(
  userId: string,
): Promise<OddNumberStartPayload> {
  const cells = generateSchulteGrid();
  const startTime = Date.now();

  const balances = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const attemptsToday = await countOddNumberAttemptsToday(userId, tx);
    const purchasedAvailable = await getOddNumberPurchasedAttemptsAvailable(
      userId,
      tx,
    );
    const attemptSlot = resolveGameAttemptSlot({
      attemptsToday,
      dailyLimit: DAILY_ATTEMPT_LIMIT,
      purchasedAvailable,
    });

    if (!attemptSlot) {
      throw new OddNumberDailyLimitError();
    }

    const { usesExtraAttempt } = attemptSlot;

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceBefore = walletBefore.availableBonuses;

    if (balanceBefore < GAME_COST) {
      throw new OddNumberInsufficientBalanceError();
    }

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: GAME_COST,
        type: usesExtraAttempt
          ? ODD_NUMBER_SCHULTE_TX.EXTRA_START
          : ODD_NUMBER_SCHULTE_TX.START,
        description: usesExtraAttempt
          ? 'Списание бонусов за доп. запуск «Лишнего числа»'
          : 'Списание бонусов за запуск «Лишнего числа»',
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    const dailyAttemptsUsed = usesExtraAttempt
      ? attemptsToday
      : attemptsToday + 1;
    const purchasedAttemptsAvailable = await getOddNumberPurchasedAttemptsAvailable(
      userId,
      tx,
    );

    return {
      balanceBefore,
      balanceAfter: walletAfter.availableBonuses,
      dailyAttemptsUsed,
      dailyAttemptsLeft: Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed),
      purchasedAttemptsAvailable,
    };
  });

  saveSession({
    userId,
    cells,
    startTime,
    expiresAt: startTime + SESSION_TTL_MS,
  });

  return {
    cells,
    timeLimitMs: TIME_LIMIT_MS,
    serverStartTime: startTime,
    balanceBefore: balances.balanceBefore,
    balanceAfter: balances.balanceAfter,
    dailyAttemptsUsed: balances.dailyAttemptsUsed,
    dailyAttemptsLeft: balances.dailyAttemptsLeft,
    purchasedAttemptsAvailable: balances.purchasedAttemptsAvailable,
  };
}

async function grantWinReward(userId: string): Promise<number> {
  return prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    await tx.goodDeedBonusGrant.create({
      data: {
        userId,
        amountBonuses: WIN_REWARD,
        comment: 'Награда за победу в «Лишнем числе»',
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    return walletAfter.availableBonuses;
  });
}

/**
 * Одна финальная проверка (как в «Секретной последовательности»):
 * клиент кликает мгновенно, сервер валидирует всю цепочку разом.
 */
export async function verifySchulteClicks(
  userId: string,
  clicks: number[],
  timedOut = false,
): Promise<OddNumberAnswerResult> {
  const session = takeSession(userId);

  if (!session) {
    return buildGameOverResult('no_active_session', false, null, 0, null, 0);
  }

  const reactionMs = Date.now() - session.startTime;
  const serverTimedOut = isGameReactionTimedOut(reactionMs, TIME_LIMIT_MS);
  const { valid, progress } = validateSchulteClickSequence(session.cells, clicks);

  if (!valid) {
    return buildGameOverResult(
      'wrong_answer',
      false,
      reactionMs,
      0,
      null,
      progress,
    );
  }

  if (clicks.length >= TARGET_COUNT) {
    if (isGameReactionTimedOut(reactionMs, TIME_LIMIT_MS)) {
      return buildGameOverResult(
        'timeout',
        false,
        reactionMs,
        0,
        null,
        TARGET_COUNT,
      );
    }

    const balanceAfter = await grantWinReward(userId);

    return buildGameOverResult(
      'success',
      true,
      reactionMs,
      WIN_REWARD,
      balanceAfter,
      TARGET_COUNT,
    );
  }

  if (timedOut || serverTimedOut) {
    return buildGameOverResult(
      'timeout',
      false,
      reactionMs,
      0,
      null,
      progress,
    );
  }

  return buildGameOverResult(
    'no_active_session',
    false,
    reactionMs,
    0,
    null,
    progress,
  );
}

export function hasActiveOddNumberSession(userId: string): boolean {
  return peekSession(userId) !== null;
}
