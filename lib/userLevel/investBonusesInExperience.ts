import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { getLevelFromExperience } from '@/lib/userLevel/calculate';
import {
  bonusesToDisplayExperience,
  bonusesToStoredExperience,
  toDisplayExperience,
} from '@/lib/userLevel/economy';
import { grantLevel3MilestoneBonusIfEligible } from '@/lib/userLevel/levelMilestoneBonuses';

export class InvestBonusesInvalidAmountError extends Error {
  constructor(message = 'Укажите корректное количество бонусов') {
    super(message);
    this.name = 'InvestBonusesInvalidAmountError';
  }
}

export class InsufficientBonusesError extends Error {
  constructor(public readonly available: number) {
    super('Недостаточно бонусов для вложения');
    this.name = 'InsufficientBonusesError';
  }
}

export interface InvestBonusesResult {
  level: number;
  experience: number;
  investedBonuses: number;
  availableBonuses: number;
  bonusesInvestedInExperience: number;
  xpGained: number;
}

type DbClient = Prisma.TransactionClient | typeof prisma;

async function investBonusesInExperienceTx(
  tx: Prisma.TransactionClient,
  userId: string,
  amountBonuses: number,
): Promise<InvestBonusesResult> {
  if (!Number.isInteger(amountBonuses) || amountBonuses < 1) {
    throw new InvestBonusesInvalidAmountError();
  }

  const user = await tx.user.findUnique({
    where: { id: userId },
    select: {
      experience: true,
      bonusesInvestedInExperience: true,
    },
  });

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  const wallet = await computeGoodDeedBonusWalletInTx(tx, userId);

  if (amountBonuses > wallet.availableBonuses) {
    throw new InsufficientBonusesError(wallet.availableBonuses);
  }

  const xpGainedStored = bonusesToStoredExperience(amountBonuses);
  const storedExperience = user.experience + xpGainedStored;
  const displayExperience = toDisplayExperience(storedExperience);
  const bonusesInvestedInExperience =
    user.bonusesInvestedInExperience + amountBonuses;
  const previousLevel = getLevelFromExperience(
    toDisplayExperience(user.experience),
  );
  const level = getLevelFromExperience(displayExperience);

  await tx.user.update({
    where: { id: userId },
    data: {
      experience: storedExperience,
      bonusesInvestedInExperience,
      level,
    },
  });

  await grantLevel3MilestoneBonusIfEligible(tx, userId, previousLevel, level);

  const updatedWallet = await computeGoodDeedBonusWalletInTx(tx, userId);

  return {
    level,
    experience: displayExperience,
    investedBonuses: amountBonuses,
    availableBonuses: updatedWallet.availableBonuses,
    bonusesInvestedInExperience,
    xpGained: bonusesToDisplayExperience(amountBonuses),
  };
}

/** Вкладывает накопленные бонусы в опыт уровня (1 бонус = 0,5 опыта). */
export async function investBonusesInExperience(
  userId: string,
  amountBonuses: number,
  db: DbClient = prisma,
): Promise<InvestBonusesResult> {
  if ('$transaction' in db) {
    return db.$transaction((tx) =>
      investBonusesInExperienceTx(tx, userId, amountBonuses),
    );
  }

  return investBonusesInExperienceTx(db, userId, amountBonuses);
}
