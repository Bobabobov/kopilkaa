import { prisma } from '@/lib/db';
import {
  ADMIN_LEVEL_RESET_BONUS_COMMENT,
  ADMIN_LEVEL_RESET_STARTER_BONUSES,
  ADMIN_LEVEL_RESET_STARTER_BONUS_COMMENT,
} from '@/lib/admin/bonusWithdrawalBlock';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import {
  getTotalXpForLevel,
} from '@/lib/userLevel/calculate';
import { MAX_ACTIVE_PROFILE_LEVEL } from '@/lib/level-config/shared';
import { toDisplayExperience, toStoredExperience } from '@/lib/userLevel/economy';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';
import { grantLevel3MilestoneBonusIfEligible } from '@/lib/userLevel/levelMilestoneBonuses';

export class AdminUserLevelNotFoundError extends Error {
  constructor() {
    super('Пользователь не найден');
    this.name = 'AdminUserLevelNotFoundError';
  }
}

export class AdminUserLevelInvalidTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminUserLevelInvalidTargetError';
  }
}

export interface AdminUserLevelSnapshot {
  userId: string;
  level: number;
  experience: number;
  bonusesReset: number;
  starterBonusesGranted: number;
}

function mapUserLevel(
  user: {
    id: string;
    level: number;
    experience: number;
  },
  bonusesReset = 0,
  starterBonusesGranted = 0,
): AdminUserLevelSnapshot {
  const experience = toDisplayExperience(user.experience);
  const level = resolveUserProfileLevel(user);

  return {
    userId: user.id,
    level,
    experience,
    bonusesReset,
    starterBonusesGranted,
  };
}

/**
 * Сброс до 1 уровня: 0 опыта, обнуление баланса, стартовый пакет 30 бонусов
 * и новый экономический цикл (заявки, кулдауны, бонус за первый вывод).
 * Повышение уровня (+1) не сбрасывает цикл — меняются только права текущего уровня.
 */
export async function adminResetUserLevel(
  userId: string,
  adminId: string,
): Promise<AdminUserLevelSnapshot> {
  return prisma.$transaction(async (tx) => {
    const wallet = await computeGoodDeedBonusWalletInTx(tx, userId);
    let bonusesReset = 0;

    if (wallet.grossBonuses > 0) {
      bonusesReset = wallet.grossBonuses;
      await tx.goodDeedBonusGrant.create({
        data: {
          userId,
          amountBonuses: -bonusesReset,
          comment: ADMIN_LEVEL_RESET_BONUS_COMMENT,
          grantedById: adminId,
        },
      });
    }

    await tx.goodDeedBonusGrant.create({
      data: {
        userId,
        amountBonuses: ADMIN_LEVEL_RESET_STARTER_BONUSES,
        comment: ADMIN_LEVEL_RESET_STARTER_BONUS_COMMENT,
        grantedById: adminId,
      },
    });

    const user = await tx.user.update({
      where: { id: userId },
      data: {
        level: 1,
        experience: 0,
        bonusesInvestedInExperience: 0,
        bonusWithdrawalBlocked: false,
        adminEconomyResetAt: new Date(),
      },
      select: { id: true, level: true, experience: true },
    });

    return mapUserLevel(user, bonusesReset, ADMIN_LEVEL_RESET_STARTER_BONUSES);
  });
}

/** Установить указанный уровень (опыт — порог целевого уровня). История заявок сохраняется. */
export async function adminSetUserLevel(
  userId: string,
  targetLevel: number,
): Promise<AdminUserLevelSnapshot> {
  const clampedTarget = Math.min(
    MAX_ACTIVE_PROFILE_LEVEL,
    Math.max(1, Math.floor(targetLevel)),
  );

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, level: true, experience: true },
  });

  if (!user) {
    throw new AdminUserLevelNotFoundError();
  }

  const currentLevel = resolveUserProfileLevel(user);

  if (clampedTarget === currentLevel) {
    throw new AdminUserLevelInvalidTargetError(
      `У пользователя уже ${currentLevel} уровень`,
    );
  }

  const newDisplayExperience = getTotalXpForLevel(clampedTarget);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        level: clampedTarget,
        experience: toStoredExperience(newDisplayExperience),
      },
      select: { id: true, level: true, experience: true },
    });

    if (clampedTarget > currentLevel) {
      await grantLevel3MilestoneBonusIfEligible(
        tx,
        userId,
        currentLevel,
        clampedTarget,
      );
    }

    return mapUserLevel(updated);
  });
}

/** Повысить на 1 уровень (опыт — порог нового уровня). История заявок сохраняется. */
export async function adminAddUserLevel(
  userId: string,
): Promise<AdminUserLevelSnapshot> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, level: true, experience: true },
  });

  if (!user) {
    throw new AdminUserLevelNotFoundError();
  }

  const currentLevel = resolveUserProfileLevel(user);
  return adminSetUserLevel(userId, currentLevel + 1);
}
