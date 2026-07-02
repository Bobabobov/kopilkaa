import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { getExtraAttemptCost } from '@/lib/games/extraAttemptCost';
import {
  GameAttemptPurchaseInsufficientBalanceError,
  countGameAttemptPurchasesToday,
  getDailyAttemptPurchasesRemaining,
  getGamePurchasedAttemptsAvailable,
  purchaseGameAttempt,
  resolveGameAttemptSlot,
} from '@/lib/games/gameAttemptPurchases';
import { evaluateDailyQuests } from '@/lib/games/quests';
import { isGameReactionTimedOut } from '@/lib/games/pingBuffer';
import {
  peekRuntimeSession,
  saveRuntimeSession,
  takeRuntimeSession,
} from '@/lib/games/runtimeSessionStore';

export const TIME_LIMIT_MS = 2000;
export const DAILY_ATTEMPT_LIMIT = 10;

export { getExtraAttemptCost } from '@/lib/games/extraAttemptCost';

export const MATH_SPRINT_TX = {
  START: 'GAMES_MATH_SPRINT_START',
  EXTRA_START: 'GAMES_MATH_SPRINT_EXTRA_START',
  ATTEMPT_PURCHASE: 'GAMES_MATH_SPRINT_ATTEMPT_PURCHASE',
} as const;

export type MathSprintDifficulty = 'easy' | 'medium' | 'hard';

export interface MathSprintDifficultyConfig {
  cost: number;
  reward: number;
  label: string;
}

/** Экономика и подпись каждого уровня сложности. */
export const MATH_SPRINT_DIFFICULTIES: Record<
  MathSprintDifficulty,
  MathSprintDifficultyConfig
> = {
  easy: { cost: 5, reward: 8, label: 'Лёгкий' },
  medium: { cost: 15, reward: 25, label: 'Средний' },
  hard: { cost: 30, reward: 55, label: 'Сложный' },
};

/**
 * @deprecated Используйте MATH_SPRINT_DIFFICULTIES['medium'].cost.
 * Оставлено для обратной совместимости со «средним» уровнем.
 */
export const GAME_COST = MATH_SPRINT_DIFFICULTIES.medium.cost;

/**
 * @deprecated Используйте MATH_SPRINT_DIFFICULTIES['medium'].reward.
 */
export const WIN_REWARD = MATH_SPRINT_DIFFICULTIES.medium.reward;

export function isMathSprintDifficulty(
  value: unknown,
): value is MathSprintDifficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

const SESSION_TTL_MS = TIME_LIMIT_MS + 60_000;
const READY_START_GRACE_MS = 1200;

interface MathSprintSession {
  userId: string;
  difficulty: MathSprintDifficulty;
  correctAnswer: number;
  reward: number;
  startTime: number;
  timerStarted: boolean;
  expiresAt: number;
}
const MATH_SPRINT_SESSION_KEY = 'math-sprint';

export interface MathSprintQuestionPayload {
  difficulty: MathSprintDifficulty;
  questionText: string;
  options: number[];
  balanceBefore: number;
  balanceAfter: number;
  serverStartTime: number;
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
}

export interface MathSprintPurchaseResult {
  balanceAfter: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
  cost: number;
}

export type MathSprintAnswerReason =
  | 'success'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface MathSprintAnswerResult {
  won: boolean;
  reason: MathSprintAnswerReason;
  reactionMs: number | null;
  reward: number;
  balanceAfter: number | null;
  difficulty: MathSprintDifficulty | null;
}

export class MathSprintInsufficientBalanceError extends Error {
  constructor() {
    super('Недостаточно бонусов для запуска математического спринта');
    this.name = 'MathSprintInsufficientBalanceError';
  }
}

export class MathSprintDailyLimitError extends Error {
  constructor() {
    super('Достигнут суточный лимит попыток в математическом спринте');
    this.name = 'MathSprintDailyLimitError';
  }
}

export class MathSprintPurchaseInsufficientBalanceError extends GameAttemptPurchaseInsufficientBalanceError {}

function getUtcDayBounds(): { start: Date; end: Date } {
  const dayKey = toUtcDayKey(new Date());
  const start = new Date(`${dayKey}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export async function countMathSprintAttemptsToday(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const { start, end } = getUtcDayBounds();

  return db.bonusTransaction.count({
    where: {
      userId,
      type: MATH_SPRINT_TX.START,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function getPurchasedAttemptsAvailable(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  return getGamePurchasedAttemptsAvailable(userId, MATH_SPRINT_TX, db);
}

export async function getMathSprintPlayerStats(userId: string): Promise<{
  dailyAttemptsUsed: number;
  dailyAttemptsLeft: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
}> {
  const [dailyAttemptsUsed, purchasedAttemptsAvailable, dailyAttemptPurchasesUsed] =
    await Promise.all([
      countMathSprintAttemptsToday(userId),
      getPurchasedAttemptsAvailable(userId),
      countGameAttemptPurchasesToday(userId, MATH_SPRINT_TX),
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

export async function purchaseMathSprintAttempt(
  userId: string,
  difficulty: MathSprintDifficulty,
): Promise<MathSprintPurchaseResult> {
  const attemptCost = getExtraAttemptCost(difficulty);
  const label = MATH_SPRINT_DIFFICULTIES[difficulty].label.toLowerCase();

  return purchaseGameAttempt(
    userId,
    MATH_SPRINT_TX,
    `Покупка доп. попытки в мат. спринте (${label})`,
    attemptCost,
  );
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

type MathOperator = '+' | '-' | '*' | '/';

interface GeneratedOperands {
  questionText: string;
  correctAnswer: number;
}

function pickOperator(operators: MathOperator[]): MathOperator {
  return operators[crypto.randomInt(0, operators.length)];
}

/** Лёгкий: одно- и двузначные +/−, табличное × до 10. */
function generateEasyOperands(): GeneratedOperands {
  const operator = pickOperator(['+', '-', '*']);

  if (operator === '+') {
    const num1 = crypto.randomInt(8, 24);
    const num2 = crypto.randomInt(6, 18);
    return { questionText: `${num1} + ${num2} = ?`, correctAnswer: num1 + num2 };
  }

  if (operator === '*') {
    const num1 = crypto.randomInt(4, 10);
    const num2 = crypto.randomInt(4, 10);
    return { questionText: `${num1} × ${num2} = ?`, correctAnswer: num1 * num2 };
  }

  const high = crypto.randomInt(20, 42);
  const low = crypto.randomInt(5, 16);
  return { questionText: `${high} - ${low} = ?`, correctAnswer: high - low };
}

/** Средний: двузначные +/−, усиленное × и деление без остатка. */
function generateMediumOperands(): GeneratedOperands {
  const operator = pickOperator(['+', '-', '*', '/']);

  if (operator === '/') {
    const divisor = crypto.randomInt(3, 9);
    const quotient = crypto.randomInt(5, 15);
    const dividend = divisor * quotient;
    return { questionText: `${dividend} / ${divisor} = ?`, correctAnswer: quotient };
  }

  if (operator === '*') {
    const num1 = crypto.randomInt(7, 17);
    const num2 = crypto.randomInt(6, 12);
    return { questionText: `${num1} × ${num2} = ?`, correctAnswer: num1 * num2 };
  }

  if (operator === '+') {
    const num1 = crypto.randomInt(28, 78);
    const num2 = crypto.randomInt(19, 56);
    return { questionText: `${num1} + ${num2} = ?`, correctAnswer: num1 + num2 };
  }

  const num1 = crypto.randomInt(58, 99);
  const num2 = crypto.randomInt(18, 47);
  return { questionText: `${num1} - ${num2} = ?`, correctAnswer: num1 - num2 };
}

/** Сложный: крупные числа, тяжёлое × и деление с большим делимым. */
function generateHardOperands(): GeneratedOperands {
  const operator = pickOperator(['+', '-', '*', '/']);

  if (operator === '/') {
    const divisor = crypto.randomInt(6, 14);
    const quotient = crypto.randomInt(9, 24);
    const dividend = divisor * quotient;
    return { questionText: `${dividend} / ${divisor} = ?`, correctAnswer: quotient };
  }

  if (operator === '*') {
    const num1 = crypto.randomInt(18, 49);
    const num2 = crypto.randomInt(7, 12);
    return { questionText: `${num1} × ${num2} = ?`, correctAnswer: num1 * num2 };
  }

  if (operator === '+') {
    const num1 = crypto.randomInt(95, 189);
    const num2 = crypto.randomInt(48, 96);
    return { questionText: `${num1} + ${num2} = ?`, correctAnswer: num1 + num2 };
  }

  const num1 = crypto.randomInt(160, 299);
  const num2 = crypto.randomInt(42, 98);
  return { questionText: `${num1} - ${num2} = ?`, correctAnswer: num1 - num2 };
}

function generateOperands(difficulty: MathSprintDifficulty): GeneratedOperands {
  switch (difficulty) {
    case 'easy':
      return generateEasyOperands();
    case 'hard':
      return generateHardOperands();
    case 'medium':
    default:
      return generateMediumOperands();
  }
}

function buildWrongAnswerOffsets(
  correctAnswer: number,
  difficulty: MathSprintDifficulty,
): number[] {
  const spread = Math.max(4, Math.round(Math.abs(correctAnswer) * 0.08));

  switch (difficulty) {
    case 'easy':
      return [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, -6, 6, -8, 8];
    case 'medium':
      return [
        -spread * 2,
        -spread,
        -Math.round(spread * 0.6),
        -3,
        -2,
        -1,
        1,
        2,
        3,
        Math.round(spread * 0.6),
        spread,
        spread * 2,
        -12,
        12,
      ];
    case 'hard':
    default:
      return [
        -spread * 3,
        -spread * 2,
        -spread,
        -Math.round(spread * 0.5),
        -7,
        -4,
        -2,
        2,
        4,
        7,
        Math.round(spread * 0.5),
        spread,
        spread * 2,
        spread * 3,
        -15,
        15,
        -20,
        20,
      ];
  }
}

function generateWrongOptions(
  correctAnswer: number,
  difficulty: MathSprintDifficulty,
): number[] {
  const wrongAnswers = new Set<number>();
  const offsets = buildWrongAnswerOffsets(correctAnswer, difficulty);

  while (wrongAnswers.size < 3) {
    const offset = offsets[crypto.randomInt(0, offsets.length)];
    const candidate = correctAnswer + offset;

    if (candidate === correctAnswer || candidate < 0 || wrongAnswers.has(candidate)) {
      continue;
    }

    wrongAnswers.add(candidate);
  }

  return Array.from(wrongAnswers);
}

export async function generateMathQuestion(
  userId: string,
  difficulty: MathSprintDifficulty,
): Promise<MathSprintQuestionPayload> {
  const config = MATH_SPRINT_DIFFICULTIES[difficulty];
  const { questionText, correctAnswer } = generateOperands(difficulty);
  const answerOptions = shuffleArray([
    correctAnswer,
    ...generateWrongOptions(correctAnswer, difficulty),
  ]);

  const result = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const attemptsToday = await countMathSprintAttemptsToday(userId, tx);
    const purchasedAvailable = await getPurchasedAttemptsAvailable(userId, tx);
    const attemptSlot = resolveGameAttemptSlot({
      attemptsToday,
      dailyLimit: DAILY_ATTEMPT_LIMIT,
      purchasedAvailable,
    });

    if (!attemptSlot) {
      throw new MathSprintDailyLimitError();
    }

    const { usesExtraAttempt } = attemptSlot;

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceBefore = walletBefore.availableBonuses;

    if (balanceBefore < config.cost) {
      throw new MathSprintInsufficientBalanceError();
    }

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: config.cost,
        type: usesExtraAttempt
          ? MATH_SPRINT_TX.EXTRA_START
          : MATH_SPRINT_TX.START,
        description: usesExtraAttempt
          ? `Списание бонусов за доп. запуск математического спринта (${config.label})`
          : `Списание бонусов за запуск математического спринта (${config.label})`,
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    const dailyAttemptsUsed = usesExtraAttempt
      ? attemptsToday
      : attemptsToday + 1;
    const purchasedAttemptsAvailable = await getPurchasedAttemptsAvailable(
      userId,
      tx,
    );

    await evaluateDailyQuests(userId, {}, tx);

    return {
      balanceBefore,
      balanceAfter: walletAfter.availableBonuses,
      dailyAttemptsUsed,
      dailyAttemptsLeft: Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed),
      purchasedAttemptsAvailable,
    };
  });

  const createdAt = Date.now();

  await saveRuntimeSession<MathSprintSession>({
    userId,
    gameKey: MATH_SPRINT_SESSION_KEY,
    payload: {
      userId,
      difficulty,
      correctAnswer,
      reward: config.reward,
      startTime: 0,
      timerStarted: false,
      expiresAt: createdAt + SESSION_TTL_MS,
    },
    expiresAtMs: createdAt + SESSION_TTL_MS,
  });

  return {
    difficulty,
    questionText,
    options: answerOptions,
    balanceBefore: result.balanceBefore,
    balanceAfter: result.balanceAfter,
    serverStartTime: createdAt,
    dailyAttemptsUsed: result.dailyAttemptsUsed,
    dailyAttemptsLeft: result.dailyAttemptsLeft,
    purchasedAttemptsAvailable: result.purchasedAttemptsAvailable,
  };
}

export async function submitMathSprintAnswer(
  userId: string,
  selectedAnswer: number,
): Promise<MathSprintAnswerResult> {
  const session = await takeRuntimeSession<MathSprintSession>(
    userId,
    MATH_SPRINT_SESSION_KEY,
  );

  if (!session) {
    console.error('[Games] math-sprint: active session not found', { userId });
    return {
      won: false,
      reason: 'no_active_session',
      reactionMs: null,
      reward: 0,
      balanceAfter: null,
      difficulty: null,
    };
  }

  if (!session.timerStarted || session.startTime <= 0) {
    console.error('[Games] math-sprint: timer not started yet', {
      userId,
      timerStarted: session.timerStarted,
      startTime: session.startTime,
    });
    return {
      won: false,
      reason: 'no_active_session',
      reactionMs: null,
      reward: 0,
      balanceAfter: null,
      difficulty: session.difficulty,
    };
  }

  const answeredAt = Date.now();
  const reactionMs = answeredAt - session.startTime;

  if (isGameReactionTimedOut(reactionMs, TIME_LIMIT_MS)) {
    return {
      won: false,
      reason: 'timeout',
      reactionMs,
      reward: 0,
      balanceAfter: null,
      difficulty: session.difficulty,
    };
  }

  if (selectedAnswer !== session.correctAnswer) {
    return {
      won: false,
      reason: 'wrong_answer',
      reactionMs,
      reward: 0,
      balanceAfter: null,
      difficulty: session.difficulty,
    };
  }

  const reward = session.reward;
  const config = MATH_SPRINT_DIFFICULTIES[session.difficulty];

  const balanceAfter = await prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    await tx.goodDeedBonusGrant.create({
      data: {
        userId,
        amountBonuses: reward,
        comment: `Награда за победу в математическом спринте (${config.label})`,
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    return walletAfter.availableBonuses;
  });

  return {
    won: true,
    reason: 'success',
    reactionMs,
    reward,
    balanceAfter,
    difficulty: session.difficulty,
  };
}

export async function acknowledgeMathSprintReady(
  userId: string,
): Promise<{ serverStartTime: number; timeLimitMs: number } | null> {
  const session = await peekRuntimeSession<MathSprintSession>(
    userId,
    MATH_SPRINT_SESSION_KEY,
  );

  if (!session) {
    console.error('[Games] math-sprint: ready without active session', { userId });
    return null;
  }

  const startTime = Date.now() + READY_START_GRACE_MS;

  await saveRuntimeSession<MathSprintSession>({
    userId,
    gameKey: MATH_SPRINT_SESSION_KEY,
    payload: {
      ...session,
      startTime,
      timerStarted: true,
      expiresAt: startTime + SESSION_TTL_MS,
    },
    expiresAtMs: startTime + SESSION_TTL_MS,
  });

  return {
    serverStartTime: startTime,
    timeLimitMs: TIME_LIMIT_MS,
  };
}

export async function hasActiveMathSprintSession(userId: string): Promise<boolean> {
  const session = await peekRuntimeSession<MathSprintSession>(
    userId,
    MATH_SPRINT_SESSION_KEY,
  );
  return session !== null;
}
