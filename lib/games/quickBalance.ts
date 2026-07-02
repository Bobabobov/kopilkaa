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
import { GAME_PING_BUFFER_MS, isGameReactionTimedOut } from '@/lib/games/pingBuffer';
import {
  generateQuickBalanceSeries,
  toRoundViews,
  validateQuickBalanceChoices,
  type QuickBalanceComparison,
  type QuickBalanceRoundInternal,
  type QuickBalanceRoundView,
} from '@/lib/games/quickBalanceExpressions';
import {
  saveRuntimeSession,
  takeRuntimeSession,
} from '@/lib/games/runtimeSessionStore';

export const ROUNDS_IN_SERIES = 3;
export const TIME_LIMIT_MS = 1800;
export const GAME_COST = 15;
export const WIN_REWARD = 45;
export const DAILY_ATTEMPT_LIMIT = 10;

export const QUICK_BALANCE_TX = {
  START: 'GAMES_QUICK_BALANCE_START',
  EXTRA_START: 'GAMES_QUICK_BALANCE_EXTRA_START',
  ATTEMPT_PURCHASE: 'GAMES_QUICK_BALANCE_ATTEMPT_PURCHASE',
} as const;

interface QuickBalanceSession {
  userId: string;
  rounds: QuickBalanceRoundInternal[];
  startTime: number;
  expiresAt: number;
}
const QUICK_BALANCE_SESSION_KEY = 'quick-balance';

export interface QuickBalanceStartPayload {
  rounds: QuickBalanceRoundView[];
  timeLimitMs: number;
  roundsInSeries: number;
  serverStartTime: number;
  balanceBefore: number;
  balanceAfter: number;
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
}

export type QuickBalanceVerifyReason =
  | 'success'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface QuickBalanceVerifyResult {
  won: boolean;
  reason: QuickBalanceVerifyReason;
  reward: number;
  balanceAfter: number | null;
  progress: number;
  roundsInSeries: number;
  reactionMs: number | null;
}

export class QuickBalanceInsufficientBalanceError extends Error {
  constructor() {
    super('Недостаточно бонусов для запуска «Быстрого баланса»');
    this.name = 'QuickBalanceInsufficientBalanceError';
  }
}

export class QuickBalanceDailyLimitError extends Error {
  constructor() {
    super('Достигнут суточный лимит попыток в «Быстром балансе»');
    this.name = 'QuickBalanceDailyLimitError';
  }
}

const SESSION_TTL_MS =
  ROUNDS_IN_SERIES * TIME_LIMIT_MS + 30_000;

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

function getUtcDayBounds(): { start: Date; end: Date } {
  const dayKey = toUtcDayKey(new Date());
  const start = new Date(`${dayKey}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export async function countQuickBalanceAttemptsToday(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const { start, end } = getUtcDayBounds();

  return db.bonusTransaction.count({
    where: {
      userId,
      type: QUICK_BALANCE_TX.START,
      createdAt: { gte: start, lt: end },
    },
  });
}

export async function getQuickBalancePurchasedAttemptsAvailable(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  return getGamePurchasedAttemptsAvailable(userId, QUICK_BALANCE_TX, db);
}

export async function purchaseQuickBalanceAttempt(userId: string) {
  return purchaseGameAttempt(
    userId,
    QUICK_BALANCE_TX,
    'Покупка доп. попытки в «Быстром балансе»',
    SEQUENCE_EXTRA_ATTEMPT_COST,
  );
}

export async function getQuickBalancePlayerStats(userId: string): Promise<{
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
}> {
  const [dailyAttemptsUsed, purchasedAttemptsAvailable, dailyAttemptPurchasesUsed] =
    await Promise.all([
      countQuickBalanceAttemptsToday(userId),
      getQuickBalancePurchasedAttemptsAvailable(userId),
      countGameAttemptPurchasesToday(userId, QUICK_BALANCE_TX),
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

export async function startQuickBalanceGame(
  userId: string,
): Promise<QuickBalanceStartPayload> {
  const rounds = generateQuickBalanceSeries();
  const startTime = Date.now();

  const balances = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const attemptsToday = await countQuickBalanceAttemptsToday(userId, tx);
    const purchasedAvailable = await getQuickBalancePurchasedAttemptsAvailable(
      userId,
      tx,
    );
    const attemptSlot = resolveGameAttemptSlot({
      attemptsToday,
      dailyLimit: DAILY_ATTEMPT_LIMIT,
      purchasedAvailable,
    });

    if (!attemptSlot) {
      throw new QuickBalanceDailyLimitError();
    }

    const { usesExtraAttempt } = attemptSlot;

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceBefore = walletBefore.availableBonuses;

    if (balanceBefore < GAME_COST) {
      throw new QuickBalanceInsufficientBalanceError();
    }

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: GAME_COST,
        type: usesExtraAttempt
          ? QUICK_BALANCE_TX.EXTRA_START
          : QUICK_BALANCE_TX.START,
        description: usesExtraAttempt
          ? 'Списание бонусов за доп. запуск «Быстрого баланса»'
          : 'Списание бонусов за запуск «Быстрого баланса»',
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    const dailyAttemptsUsed = usesExtraAttempt
      ? attemptsToday
      : attemptsToday + 1;
    const purchasedAttemptsAvailable = await getQuickBalancePurchasedAttemptsAvailable(
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

  await saveRuntimeSession<QuickBalanceSession>({
    userId,
    gameKey: QUICK_BALANCE_SESSION_KEY,
    payload: {
      userId,
      rounds,
      startTime,
      expiresAt: startTime + SESSION_TTL_MS,
    },
    expiresAtMs: startTime + SESSION_TTL_MS,
  });

  return {
    rounds: toRoundViews(rounds),
    timeLimitMs: TIME_LIMIT_MS,
    roundsInSeries: ROUNDS_IN_SERIES,
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
        comment: 'Награда за победу в «Быстром балансе»',
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    return walletAfter.availableBonuses;
  });
}

function buildLossResult(
  reason: QuickBalanceVerifyReason,
  progress: number,
  reactionMs: number | null,
): QuickBalanceVerifyResult {
  return {
    won: false,
    reason,
    reward: 0,
    balanceAfter: null,
    progress,
    roundsInSeries: ROUNDS_IN_SERIES,
    reactionMs,
  };
}

export async function verifyQuickBalanceChoices(
  userId: string,
  choices: QuickBalanceComparison[],
  timedOut = false,
): Promise<QuickBalanceVerifyResult> {
  const session = await takeRuntimeSession<QuickBalanceSession>(
    userId,
    QUICK_BALANCE_SESSION_KEY,
  );

  if (!session) {
    console.error('[Games] quick-balance: active session not found', { userId });
    return buildLossResult('no_active_session', 0, null);
  }

  const reactionMs = Date.now() - session.startTime;
  const maxTotalMs =
    ROUNDS_IN_SERIES * TIME_LIMIT_MS + ROUNDS_IN_SERIES * GAME_PING_BUFFER_MS;
  const serverTimedOut = isGameReactionTimedOut(reactionMs, maxTotalMs);
  const { valid, progress } = validateQuickBalanceChoices(
    session.rounds,
    choices,
  );

  if (!valid) {
    return buildLossResult('wrong_answer', progress, reactionMs);
  }

  if (choices.length < ROUNDS_IN_SERIES) {
    if (timedOut || serverTimedOut) {
      return buildLossResult('timeout', progress, reactionMs);
    }

    return buildLossResult('no_active_session', progress, reactionMs);
  }

  if (isGameReactionTimedOut(reactionMs, maxTotalMs)) {
    return buildLossResult('timeout', ROUNDS_IN_SERIES, reactionMs);
  }

  const balanceAfter = await grantWinReward(userId);

  return {
    won: true,
    reason: 'success',
    reward: WIN_REWARD,
    balanceAfter,
    progress: ROUNDS_IN_SERIES,
    roundsInSeries: ROUNDS_IN_SERIES,
    reactionMs,
  };
}

export type { QuickBalanceComparison, QuickBalanceRoundView };
