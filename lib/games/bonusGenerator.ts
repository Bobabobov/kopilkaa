import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { evaluateDailyQuests } from '@/lib/games/quests';

export const GENERATOR_COST = 15;
export const MEGA_BONUS_AMOUNT = 500;
export const GENERATOR_RUN_ANIMATION_MS = 1800;

interface BonusGeneratorOutcome {
  reward: number;
  label: 'none' | 'small' | 'refund' | 'boost' | 'super' | 'mega';
}

export interface BonusGeneratorRunResult {
  cost: number;
  reward: number;
  netChange: number;
  balanceBefore: number;
  balanceAfter: number;
  isMegaBonus: boolean;
  label: BonusGeneratorOutcome['label'];
}

export class BonusGeneratorInsufficientBalanceError extends Error {
  constructor() {
    super('Недостаточно бонусов для запуска генератора');
    this.name = 'BonusGeneratorInsufficientBalanceError';
  }
}

const BONUS_DISTRIBUTION: Array<BonusGeneratorOutcome & { threshold: number }> = [
  { threshold: 3500, reward: 0, label: 'none' },
  { threshold: 6500, reward: 5, label: 'small' },
  { threshold: 8500, reward: 15, label: 'refund' },
  { threshold: 9500, reward: 30, label: 'boost' },
  { threshold: 9999, reward: 75, label: 'super' },
  { threshold: 10000, reward: MEGA_BONUS_AMOUNT, label: 'mega' },
];

function pickGeneratorOutcome(): BonusGeneratorOutcome {
  const value = crypto.randomInt(1, 10001);
  const outcome = BONUS_DISTRIBUTION.find((item) => value <= item.threshold);

  if (!outcome) {
    return { reward: 0, label: 'none' };
  }

  return {
    reward: outcome.reward,
    label: outcome.label,
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

export async function runBonusGeneratorForUser(
  userId: string,
): Promise<BonusGeneratorRunResult> {
  return prisma.$transaction(async (tx) => {
    await lockUserRowIfSupported(tx, userId);

    const walletBefore = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceBefore = walletBefore.availableBonuses;

    if (balanceBefore < GENERATOR_COST) {
      throw new BonusGeneratorInsufficientBalanceError();
    }

    const outcome = pickGeneratorOutcome();

    await tx.bonusTransaction.create({
      data: {
        userId,
        amount: GENERATOR_COST,
        type: 'GAMES_BONUS_GENERATOR_RUN',
        description: 'Списание бонусов за запуск генератора бонусов',
      },
    });

    if (outcome.reward > 0) {
      await tx.goodDeedBonusGrant.create({
        data: {
          userId,
          amountBonuses: outcome.reward,
          comment:
            outcome.label === 'mega'
              ? 'Мега-бонус за запуск генератора бонусов'
              : 'Начисление за запуск генератора бонусов',
        },
      });
    }

    await evaluateDailyQuests(userId, {}, tx);

    const walletAfter = await computeGoodDeedBonusWalletInTx(tx, userId);
    const balanceAfter = walletAfter.availableBonuses;

    return {
      cost: GENERATOR_COST,
      reward: outcome.reward,
      netChange: outcome.reward - GENERATOR_COST,
      balanceBefore,
      balanceAfter,
      isMegaBonus: outcome.reward === MEGA_BONUS_AMOUNT,
      label: outcome.label,
    };
  });
}
