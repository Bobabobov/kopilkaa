import { Prisma } from '@prisma/client';
import { isUserAllowedAdmin } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';

export const MAX_DAILY_ATTEMPT_PURCHASES = 5;

/** @deprecated Используйте getExtraAttemptCost из extraAttemptCost.ts */
export const EXTRA_ATTEMPT_COST = 7;

export interface GameAttemptTransactionTypes {
  START: string;
  EXTRA_START: string;
  ATTEMPT_PURCHASE: string;
}

export interface GameAttemptPurchaseResult {
  balanceAfter: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesUsed: number;
  dailyAttemptPurchasesRemaining: number;
  cost: number;
}

export class GameAttemptPurchaseInsufficientBalanceError extends Error {
  readonly requiredBonuses: number;

  constructor(requiredBonuses: number) {
    super(
      `Недостаточно бонусов для покупки дополнительной попытки (нужно ${requiredBonuses})`,
    );
    this.name = 'GameAttemptPurchaseInsufficientBalanceError';
    this.requiredBonuses = requiredBonuses;
  }
}

export class GameAttemptPurchaseDailyLimitError extends Error {
  constructor() {
    super(
      `Достигнут суточный лимит покупок доп. попыток (${MAX_DAILY_ATTEMPT_PURCHASES} в день)`,
    );
    this.name = 'GameAttemptPurchaseDailyLimitError';
  }
}

async function hasUnlimitedGameAttempts(userId: string): Promise<boolean> {
  return isUserAllowedAdmin(userId);
}

function getUtcDayBounds(): { start: Date; end: Date } {
  const dayKey = toUtcDayKey(new Date());
  const start = new Date(`${dayKey}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
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

async function countTransactionsToday(
  userId: string,
  type: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const { start, end } = getUtcDayBounds();

  return db.bonusTransaction.count({
    where: {
      userId,
      type,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function countGameAttemptPurchasesToday(
  userId: string,
  types: GameAttemptTransactionTypes,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const unlimitedAttempts = await hasUnlimitedGameAttempts(userId);
  if (unlimitedAttempts) {
    return 0;
  }
  return countTransactionsToday(userId, types.ATTEMPT_PURCHASE, db);
}

export function getDailyAttemptPurchasesRemaining(
  purchasesToday: number,
): number {
  return Math.max(0, MAX_DAILY_ATTEMPT_PURCHASES - purchasesToday);
}

export async function getGamePurchasedAttemptsAvailable(
  userId: string,
  types: GameAttemptTransactionTypes,
  db: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const unlimitedAttempts = await hasUnlimitedGameAttempts(userId);
  if (unlimitedAttempts) {
    return 1;
  }

  const [purchased, used] = await Promise.all([
    countTransactionsToday(userId, types.ATTEMPT_PURCHASE, db),
    countTransactionsToday(userId, types.EXTRA_START, db),
  ]);

  return Math.max(0, purchased - used);
}

export async function purchaseGameAttempt(
  userId: string,
  types: GameAttemptTransactionTypes,
  purchaseDescription: string,
  attemptCost: number,
): Promise<GameAttemptPurchaseResult> {
  const unlimitedAttempts = await hasUnlimitedGameAttempts(userId);
  if (unlimitedAttempts) {
    const wallet = await computeGoodDeedBonusWalletInTx(prisma, userId);
    return {
      balanceAfter: wallet.availableBonuses,
      purchasedAttemptsAvailable: 1,
      dailyAttemptPurchasesUsed: 0,
      dailyAttemptPurchasesRemaining: MAX_DAILY_ATTEMPT_PURCHASES,
      cost: 0,
    };
  }

  return prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const purchasesToday = await countGameAttemptPurchasesToday(
      userId,
      types,
      tx,
    );

    if (purchasesToday >= MAX_DAILY_ATTEMPT_PURCHASES) {
      throw new GameAttemptPurchaseDailyLimitError();
    }

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);

    if (walletBefore.availableBonuses < attemptCost) {
      throw new GameAttemptPurchaseInsufficientBalanceError(attemptCost);
    }

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: attemptCost,
        type: types.ATTEMPT_PURCHASE,
        description: purchaseDescription,
      },
    });

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    const purchasedAttemptsAvailable = await getGamePurchasedAttemptsAvailable(
      userId,
      types,
      tx,
    );
    const dailyAttemptPurchasesUsed = purchasesToday + 1;

    return {
      balanceAfter: walletAfter.availableBonuses,
      purchasedAttemptsAvailable,
      dailyAttemptPurchasesUsed,
      dailyAttemptPurchasesRemaining: getDailyAttemptPurchasesRemaining(
        dailyAttemptPurchasesUsed,
      ),
      cost: attemptCost,
    };
  });
}

export interface ResolveGameAttemptSlotInput {
  attemptsToday: number;
  dailyLimit: number;
  purchasedAvailable: number;
}

export function resolveGameAttemptSlot(
  input: ResolveGameAttemptSlotInput,
): { usesExtraAttempt: boolean } | null {
  const { attemptsToday, dailyLimit, purchasedAvailable } = input;

  if (attemptsToday < dailyLimit) {
    return { usesExtraAttempt: false };
  }

  if (purchasedAvailable <= 0) {
    return null;
  }

  return { usesExtraAttempt: true };
}
