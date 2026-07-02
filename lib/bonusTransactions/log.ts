import type { Prisma } from '@prisma/client';
import {
  BONUS_TRANSACTION_DESCRIPTIONS,
  BONUS_TRANSACTION_TYPES,
} from './constants';
import { economyActivitySince } from '@/lib/applications/economySinceReset';

type DbClient = Prisma.TransactionClient | {
  bonusTransaction: Prisma.TransactionClient['bonusTransaction'];
};

export async function logApplicationSubmitBonusTransaction(
  db: DbClient,
  params: {
    userId: string;
    applicationId: string;
    amount: number;
    isFirstFree: boolean;
  },
): Promise<void> {
  const { userId, applicationId, amount, isFirstFree } = params;

  await db.bonusTransaction.create({
    data: {
      userId,
      applicationId,
      amount: isFirstFree ? 0 : amount,
      type: BONUS_TRANSACTION_TYPES.APPLICATION_SUBMIT_FEE,
      description: isFirstFree
        ? BONUS_TRANSACTION_DESCRIPTIONS.FIRST_APPLICATION_FREE
        : BONUS_TRANSACTION_DESCRIPTIONS.APPLICATION_SUBMIT_FEE,
    },
  });
}

export async function sumBonusTransactionsSpent(
  db: Prisma.TransactionClient | typeof import('@/lib/db').prisma,
  userId: string,
  since?: Date | null,
): Promise<number> {
  const row = await db.bonusTransaction.aggregate({
    where: {
      userId,
      ...economyActivitySince(since),
    },
    _sum: { amount: true },
  });
  return Math.max(0, row._sum.amount ?? 0);
}
