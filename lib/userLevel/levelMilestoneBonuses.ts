import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { economyActivitySince } from '@/lib/applications/economySinceReset';
import { MIN_WITHDRAWAL_PROFILE_LEVEL } from '@/lib/bonusWithdrawals/constants';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';

/** Одноразовый подарок при первом достижении 3 уровня в текущем экономическом цикле */
export const LEVEL_3_MILESTONE_BONUS_AMOUNT = 15;

export const LEVEL_3_MILESTONE_GRANT_COMMENT = 'level_3_milestone_bonus';

export function formatLevelThreeMilestoneBonusPerk(): string {
  return `+${LEVEL_3_MILESTONE_BONUS_AMOUNT} бон. на баланс при достижении 3 уровня`;
}

export async function hasLevel3MilestoneGrant(
  db: Prisma.TransactionClient | { goodDeedBonusGrant: Prisma.TransactionClient['goodDeedBonusGrant'] },
  userId: string,
  since?: Date | null,
): Promise<boolean> {
  const existing = await db.goodDeedBonusGrant.findFirst({
    where: {
      userId,
      comment: LEVEL_3_MILESTONE_GRANT_COMMENT,
      ...economyActivitySince(since),
    },
    select: { id: true },
  });
  return existing != null;
}

export async function grantLevel3MilestoneBonusIfEligible(
  tx: Prisma.TransactionClient,
  userId: string,
  previousLevel: number,
  newLevel: number,
): Promise<{ granted: boolean; amount: number }> {
  if (previousLevel >= MIN_WITHDRAWAL_PROFILE_LEVEL || newLevel < MIN_WITHDRAWAL_PROFILE_LEVEL) {
    return { granted: false, amount: 0 };
  }

  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { adminEconomyResetAt: true },
  });
  if (!user) return { granted: false, amount: 0 };

  if (await hasLevel3MilestoneGrant(tx, userId, user.adminEconomyResetAt)) {
    return { granted: false, amount: 0 };
  }

  await tx.goodDeedBonusGrant.create({
    data: {
      userId,
      amountBonuses: LEVEL_3_MILESTONE_BONUS_AMOUNT,
      comment: LEVEL_3_MILESTONE_GRANT_COMMENT,
    },
  });

  return { granted: true, amount: LEVEL_3_MILESTONE_BONUS_AMOUNT };
}

/** Для пользователей, которые уже были на 3+ уровне до появления награды */
export async function syncMissedLevel3MilestoneBonus(
  userId: string,
): Promise<{ granted: boolean; amount: number }> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true, adminEconomyResetAt: true },
    });
    if (!user) return { granted: false, amount: 0 };

    const profileLevel = resolveUserProfileLevel(user);
    if (profileLevel < MIN_WITHDRAWAL_PROFILE_LEVEL) {
      return { granted: false, amount: 0 };
    }

    return grantLevel3MilestoneBonusIfEligible(
      tx,
      userId,
      MIN_WITHDRAWAL_PROFILE_LEVEL - 1,
      profileLevel,
    );
  });
}
