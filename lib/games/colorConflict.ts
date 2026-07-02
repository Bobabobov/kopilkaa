import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import {
  COLOR_CONFLICT_COLOR_NAMES,
  COLOR_CONFLICT_PALETTE,
  toColorOptionView,
  type ColorConflictOptionView,
  type ColorConflictPaletteEntry,
} from '@/lib/games/colorConflictDisplay';
import { getExtraAttemptCost } from '@/lib/games/extraAttemptCost';
import {
  GameAttemptPurchaseInsufficientBalanceError,
  countGameAttemptPurchasesToday,
  getDailyAttemptPurchasesRemaining,
  getGamePurchasedAttemptsAvailable,
  purchaseGameAttempt,
  resolveGameAttemptSlot,
} from '@/lib/games/gameAttemptPurchases';
import { isGameReactionTimedOut } from '@/lib/games/pingBuffer';
import {
  deleteRuntimeSession,
  peekRuntimeSession,
  saveRuntimeSession,
} from '@/lib/games/runtimeSessionStore';

export type ColorConflictDifficulty = 'easy' | 'medium' | 'hard';

export const DAILY_ATTEMPT_LIMIT = 10;
export { getExtraAttemptCost } from '@/lib/games/extraAttemptCost';

export const COLOR_CONFLICT_TX = {
  START: 'GAMES_COLOR_CONFLICT_START',
  EXTRA_START: 'GAMES_COLOR_CONFLICT_EXTRA_START',
  ATTEMPT_PURCHASE: 'GAMES_COLOR_CONFLICT_ATTEMPT_PURCHASE',
} as const;

export {
  COLOR_CONFLICT_COLOR_NAMES,
  COLOR_CONFLICT_PALETTE,
  getColorEntryByName,
  getColorHexByName,
  toColorOptionView,
} from '@/lib/games/colorConflictDisplay';
export type { ColorConflictOptionView } from '@/lib/games/colorConflictDisplay';

export interface ColorConflictDifficultyConfig {
  cost: number;
  reward: number;
  seriesTarget: number;
  timeLimitMs: number;
  label: string;
}

export const COLOR_CONFLICT_DIFFICULTIES: Record<
  ColorConflictDifficulty,
  ColorConflictDifficultyConfig
> = {
  easy: {
    cost: 5,
    reward: 8,
    seriesTarget: 5,
    timeLimitMs: 2000,
    label: 'Лёгкий',
  },
  medium: {
    cost: 15,
    reward: 25,
    seriesTarget: 10,
    timeLimitMs: 2500,
    label: 'Средний',
  },
  hard: {
    cost: 30,
    reward: 55,
    seriesTarget: 15,
    timeLimitMs: 1800,
    label: 'Сложный',
  },
};

export function isColorConflictDifficulty(
  value: unknown,
): value is ColorConflictDifficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

const SESSION_TTL_MS = 5 * 60_000;
const READY_START_GRACE_MS = 1200;

interface ColorConflictSession {
  userId: string;
  difficulty: ColorConflictDifficulty;
  correctAnswer: string;
  streakIndex: number;
  seriesTarget: number;
  reward: number;
  timeLimitMs: number;
  startTime: number;
  expiresAt: number;
}
const COLOR_CONFLICT_SESSION_KEY = 'color-conflict';

export interface ColorConflictRoundPayload {
  wordText: string;
  displayColorHex: string;
  displayGlowRgb: string;
  options: ColorConflictOptionView[];
  currentRound: number;
  seriesTarget: number;
  timeLimitMs: number;
  serverStartTime: number;
}

export interface ColorConflictStartPayload extends ColorConflictRoundPayload {
  difficulty: ColorConflictDifficulty;
  balanceBefore: number;
  balanceAfter: number;
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
}

export type ColorConflictAnswerReason =
  | 'success'
  | 'continue'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface ColorConflictAnswerResult {
  gameOver: boolean;
  won: boolean;
  reason: ColorConflictAnswerReason;
  reactionMs: number | null;
  reward: number;
  balanceAfter: number | null;
  difficulty: ColorConflictDifficulty | null;
  currentStreak: number;
  seriesTarget: number;
  nextRound: ColorConflictRoundPayload | null;
}

export class ColorConflictInsufficientBalanceError extends Error {
  constructor() {
    super('Недостаточно бонусов для запуска «Цветового конфликта»');
    this.name = 'ColorConflictInsufficientBalanceError';
  }
}

export class ColorConflictDailyLimitError extends Error {
  constructor() {
    super('Достигнут суточный лимит попыток в «Цветовом конфликте»');
    this.name = 'ColorConflictDailyLimitError';
  }
}

export class ColorConflictPurchaseInsufficientBalanceError extends GameAttemptPurchaseInsufficientBalanceError {}

function getUtcDayBounds(): { start: Date; end: Date } {
  const dayKey = toUtcDayKey(new Date());
  const start = new Date(`${dayKey}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export async function countColorConflictAttemptsToday(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const { start, end } = getUtcDayBounds();

  return db.bonusTransaction.count({
    where: {
      userId,
      type: COLOR_CONFLICT_TX.START,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function getColorConflictPurchasedAttemptsAvailable(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  return getGamePurchasedAttemptsAvailable(userId, COLOR_CONFLICT_TX, db);
}

export async function purchaseColorConflictAttempt(
  userId: string,
  difficulty: ColorConflictDifficulty,
) {
  const attemptCost = getExtraAttemptCost(difficulty);
  const label = COLOR_CONFLICT_DIFFICULTIES[difficulty].label.toLowerCase();

  return purchaseGameAttempt(
    userId,
    COLOR_CONFLICT_TX,
    `Покупка доп. попытки в «Цветовом конфликте» (${label})`,
    attemptCost,
  );
}

export async function getColorConflictPlayerStats(userId: string): Promise<{
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
}> {
  const [dailyAttemptsUsed, purchasedAttemptsAvailable, dailyAttemptPurchasesUsed] =
    await Promise.all([
      countColorConflictAttemptsToday(userId),
      getColorConflictPurchasedAttemptsAvailable(userId),
      countGameAttemptPurchasesToday(userId, COLOR_CONFLICT_TX),
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

function pickRandomColor(): ColorConflictPaletteEntry {
  return COLOR_CONFLICT_PALETTE[
    crypto.randomInt(0, COLOR_CONFLICT_PALETTE.length)
  ];
}

function pickDifferentColor(
  exclude: ColorConflictPaletteEntry,
): ColorConflictPaletteEntry {
  const candidates = COLOR_CONFLICT_PALETTE.filter(
    (color) => color.name !== exclude.name,
  );
  return candidates[crypto.randomInt(0, candidates.length)];
}

function buildAnswerOptions(correctAnswer: string): ColorConflictOptionView[] {
  const wrongOptions = COLOR_CONFLICT_COLOR_NAMES.filter(
    (name) => name !== correctAnswer,
  );
  const shuffledWrong = shuffleArray(wrongOptions);
  return shuffleArray([
    correctAnswer,
    ...shuffledWrong.slice(0, 3),
  ]).map(toColorOptionView);
}

function generateRound(): {
  wordText: string;
  displayColor: ColorConflictPaletteEntry;
  correctAnswer: string;
  options: ColorConflictOptionView[];
} {
  const wordColor = pickRandomColor();
  const displayColor = pickDifferentColor(wordColor);

  return {
    wordText: wordColor.name,
    displayColor,
    correctAnswer: displayColor.name,
    options: buildAnswerOptions(displayColor.name),
  };
}

function buildRoundPayload(
  session: ColorConflictSession,
  round: ReturnType<typeof generateRound>,
  startTime: number,
): ColorConflictRoundPayload {
  return {
    wordText: round.wordText,
    displayColorHex: round.displayColor.hex,
    displayGlowRgb: round.displayColor.glowRgb,
    options: round.options,
    currentRound: session.streakIndex + 1,
    seriesTarget: session.seriesTarget,
    timeLimitMs: session.timeLimitMs,
    serverStartTime: startTime,
  };
}

function buildGameOverResult(
  session: ColorConflictSession | null,
  reason: ColorConflictAnswerReason,
  reactionMs: number | null,
  won: boolean,
  reward: number,
  balanceAfter: number | null,
  currentStreak: number,
): ColorConflictAnswerResult {
  return {
    gameOver: true,
    won,
    reason,
    reactionMs,
    reward,
    balanceAfter,
    difficulty: session?.difficulty ?? null,
    currentStreak,
    seriesTarget: session?.seriesTarget ?? 0,
    nextRound: null,
  };
}

export async function startColorConflictGame(
  userId: string,
  difficulty: ColorConflictDifficulty,
): Promise<ColorConflictStartPayload> {
  const config = COLOR_CONFLICT_DIFFICULTIES[difficulty];
  const round = generateRound();
  const startTime = Date.now();

  const balances = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const attemptsToday = await countColorConflictAttemptsToday(userId, tx);
    const purchasedAvailable = await getColorConflictPurchasedAttemptsAvailable(
      userId,
      tx,
    );
    const attemptSlot = resolveGameAttemptSlot({
      attemptsToday,
      dailyLimit: DAILY_ATTEMPT_LIMIT,
      purchasedAvailable,
    });

    if (!attemptSlot) {
      throw new ColorConflictDailyLimitError();
    }

    const { usesExtraAttempt } = attemptSlot;

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceBefore = walletBefore.availableBonuses;

    if (balanceBefore < config.cost) {
      throw new ColorConflictInsufficientBalanceError();
    }

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: config.cost,
        type: usesExtraAttempt
          ? COLOR_CONFLICT_TX.EXTRA_START
          : COLOR_CONFLICT_TX.START,
        description: usesExtraAttempt
          ? `Списание бонусов за доп. запуск «Цветового конфликта» (${config.label})`
          : `Списание бонусов за запуск «Цветового конфликта» (${config.label})`,
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    const dailyAttemptsUsed = usesExtraAttempt
      ? attemptsToday
      : attemptsToday + 1;
    const purchasedAttemptsAvailable =
      await getColorConflictPurchasedAttemptsAvailable(userId, tx);

    return {
      balanceBefore,
      balanceAfter: walletAfter.availableBonuses,
      dailyAttemptsUsed,
      dailyAttemptsLeft: Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed),
      purchasedAttemptsAvailable,
    };
  });

  const session: ColorConflictSession = {
    userId,
    difficulty,
    correctAnswer: round.correctAnswer,
    streakIndex: 0,
    seriesTarget: config.seriesTarget,
    reward: config.reward,
    timeLimitMs: config.timeLimitMs,
    startTime,
    expiresAt: startTime + SESSION_TTL_MS,
  };

  await saveRuntimeSession<ColorConflictSession>({
    userId,
    gameKey: COLOR_CONFLICT_SESSION_KEY,
    payload: session,
    expiresAtMs: session.expiresAt,
  });

  return {
    difficulty,
    balanceBefore: balances.balanceBefore,
    balanceAfter: balances.balanceAfter,
    dailyAttemptsUsed: balances.dailyAttemptsUsed,
    dailyAttemptsLeft: balances.dailyAttemptsLeft,
    purchasedAttemptsAvailable: balances.purchasedAttemptsAvailable,
    ...buildRoundPayload(session, round, startTime),
  };
}

export async function submitColorConflictAnswer(
  userId: string,
  selectedAnswer: string | null,
): Promise<ColorConflictAnswerResult> {
  const session = await peekRuntimeSession<ColorConflictSession>(
    userId,
    COLOR_CONFLICT_SESSION_KEY,
  );

  if (!session) {
    return buildGameOverResult(
      null,
      'no_active_session',
      null,
      false,
      0,
      null,
      0,
    );
  }

  const answeredAt = Date.now();
  const reactionMs = answeredAt - session.startTime;
  const currentStreakBefore = session.streakIndex;

  if (isGameReactionTimedOut(reactionMs, session.timeLimitMs)) {
    await deleteRuntimeSession(userId, COLOR_CONFLICT_SESSION_KEY);
    return buildGameOverResult(
      session,
      'timeout',
      reactionMs,
      false,
      0,
      null,
      currentStreakBefore,
    );
  }

  if (!selectedAnswer || selectedAnswer !== session.correctAnswer) {
    await deleteRuntimeSession(userId, COLOR_CONFLICT_SESSION_KEY);
    return buildGameOverResult(
      session,
      'wrong_answer',
      reactionMs,
      false,
      0,
      null,
      currentStreakBefore,
    );
  }

  const nextStreakIndex = session.streakIndex + 1;

  if (nextStreakIndex >= session.seriesTarget) {
    await deleteRuntimeSession(userId, COLOR_CONFLICT_SESSION_KEY);

    const config = COLOR_CONFLICT_DIFFICULTIES[session.difficulty];
    const reward = session.reward;

    const balanceAfter = await prisma.$transaction(async (tx) => {
      await lockUserRowIfSupported(tx, userId);

      await tx.goodDeedBonusGrant.create({
        data: {
          userId,
          amountBonuses: reward,
          comment: `Награда за победу в «Цветовом конфликте» (${config.label})`,
        },
      });

      const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
      return walletAfter.availableBonuses;
    });

    return buildGameOverResult(
      session,
      'success',
      reactionMs,
      true,
      reward,
      balanceAfter,
      nextStreakIndex,
    );
  }

  const nextRound = generateRound();
  const nextStartTime = Date.now();

  await saveRuntimeSession<ColorConflictSession>({
    userId,
    gameKey: COLOR_CONFLICT_SESSION_KEY,
    payload: {
      ...session,
      streakIndex: nextStreakIndex,
      correctAnswer: nextRound.correctAnswer,
      startTime: nextStartTime,
      expiresAt: nextStartTime + SESSION_TTL_MS,
    },
    expiresAtMs: nextStartTime + SESSION_TTL_MS,
  });

  return {
    gameOver: false,
    won: false,
    reason: 'continue',
    reactionMs,
    reward: 0,
    balanceAfter: null,
    difficulty: session.difficulty,
    currentStreak: nextStreakIndex,
    seriesTarget: session.seriesTarget,
    nextRound: buildRoundPayload(
      { ...session, streakIndex: nextStreakIndex },
      nextRound,
      nextStartTime,
    ),
  };
}

export async function hasActiveColorConflictSession(
  userId: string,
): Promise<boolean> {
  const session = await peekRuntimeSession<ColorConflictSession>(
    userId,
    COLOR_CONFLICT_SESSION_KEY,
  );
  return session !== null;
}

export interface ColorConflictReadyPayload {
  serverStartTime: number;
  timeLimitMs: number;
}

/** Сбрасывает таймер раунда после того, как клиент прокрутил экран к игре. */
export async function acknowledgeColorConflictRoundReady(
  userId: string,
): Promise<ColorConflictReadyPayload | null> {
  const session = await peekRuntimeSession<ColorConflictSession>(
    userId,
    COLOR_CONFLICT_SESSION_KEY,
  );
  if (!session) {
    return null;
  }

  const startTime = Date.now() + READY_START_GRACE_MS;

  await saveRuntimeSession<ColorConflictSession>({
    userId,
    gameKey: COLOR_CONFLICT_SESSION_KEY,
    payload: {
      ...session,
      startTime,
      expiresAt: startTime + SESSION_TTL_MS,
    },
    expiresAtMs: startTime + SESSION_TTL_MS,
  });

  return {
    serverStartTime: startTime,
    timeLimitMs: session.timeLimitMs,
  };
}
