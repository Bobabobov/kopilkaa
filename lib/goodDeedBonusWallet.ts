import {
  GoodDeedSubmissionStatus,
  GoodDeedWithdrawalStatus,
  type Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { sumBonusTransactionsSpent } from "@/lib/bonusTransactions/log";
import { hasFirstWithdrawalBonusGrant, getFirstWithdrawalBonusStatus, type FirstWithdrawalBonusStatus } from "@/lib/bonusWithdrawals/firstWithdrawalBonus";
import { resolveUserProfileLevel } from "@/lib/userLevel/resolveProfileLevel";

export type GoodDeedBonusWallet = {
  totalEarnedBonuses: number;
  /** Брутто-баланс: начислено минус выведенное и заявки в ожидании. */
  grossBonuses: number;
  /** Бонусы, уже вложенные пользователем в опыт. */
  bonusesInvestedInExperience: number;
  /** Накопленные бонусы, доступные для вложения в опыт. */
  availableBonuses: number;
  /**
   * @deprecated Используйте availableBonuses или bonusesInvestedInExperience.
   */
  bonusesInLevel: number;
  pendingWithdrawalBonuses: number;
  withdrawnBonuses: number;
  hasPendingWithdrawal: boolean;
  /** Вывод бонусов больше недоступен. */
  withdrawalBlocked: boolean;
  withdrawalsDisabled: boolean;
  firstWithdrawalBonus: FirstWithdrawalBonusStatus;
  /** @deprecated Используйте firstWithdrawalBonus.claimable / promised */
  firstWithdrawalBonusEligible: boolean;
};

async function aggregateGoodDeedBonusWallet(
  db: Prisma.TransactionClient | typeof prisma,
  userId: string,
): Promise<GoodDeedBonusWallet> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      bonusesInvestedInExperience: true,
      bonusWithdrawalBlocked: true,
      level: true,
      experience: true,
      adminEconomyResetAt: true,
    },
  });

  const [earnedRow, grantsRow, bonusesSpentOnTransactions, hasFirstBonusGrant] =
    await Promise.all([
      db.goodDeedSubmission.aggregate({
        where: {
          userId,
          status: GoodDeedSubmissionStatus.APPROVED,
        },
        _sum: { reward: true },
      }),
      db.goodDeedBonusGrant.aggregate({
        where: { userId },
        _sum: { amountBonuses: true },
      }),
      sumBonusTransactionsSpent(db, userId, user?.adminEconomyResetAt),
      hasFirstWithdrawalBonusGrant(db, userId, user?.adminEconomyResetAt),
    ]);

  const totalEarnedBonuses =
    (earnedRow._sum.reward ?? 0) + (grantsRow._sum.amountBonuses ?? 0);

  const withdrawals = await db.goodDeedWithdrawalRequest.findMany({
    where: { userId },
    select: { status: true, amountBonuses: true, createdAt: true },
  });

  let withdrawnBonuses = 0;
  let pendingWithdrawalBonuses = 0;
  let pendingCount = 0;
  let approvedWithdrawalCount = 0;

  for (const w of withdrawals) {
    if (w.status === GoodDeedWithdrawalStatus.APPROVED) {
      withdrawnBonuses += w.amountBonuses;
      if (
        !user?.adminEconomyResetAt ||
        w.createdAt > user.adminEconomyResetAt
      ) {
        approvedWithdrawalCount += 1;
      }
    }
    if (w.status === GoodDeedWithdrawalStatus.PENDING) {
      pendingWithdrawalBonuses += w.amountBonuses;
      pendingCount += 1;
    }
  }

  const grossBonuses = Math.max(
    0,
    totalEarnedBonuses - withdrawnBonuses - pendingWithdrawalBonuses,
  );
  const bonusesInvestedInExperience = Math.max(
    0,
    user?.bonusesInvestedInExperience ?? 0,
  );
  const availableBonuses = Math.max(
    0,
    grossBonuses - bonusesInvestedInExperience - bonusesSpentOnTransactions,
  );

  const profileLevel = resolveUserProfileLevel(user ?? {});

  const firstWithdrawalBonus = getFirstWithdrawalBonusStatus(
    userId,
    profileLevel,
    approvedWithdrawalCount,
    hasFirstBonusGrant,
  );

  return {
    totalEarnedBonuses,
    grossBonuses,
    bonusesInvestedInExperience,
    availableBonuses,
    bonusesInLevel: availableBonuses,
    pendingWithdrawalBonuses,
    withdrawnBonuses,
    hasPendingWithdrawal: pendingCount > 0,
    withdrawalBlocked: user?.bonusWithdrawalBlocked ?? false,
    withdrawalsDisabled: false,
    firstWithdrawalBonus,
    firstWithdrawalBonusEligible:
      firstWithdrawalBonus.claimable || firstWithdrawalBonus.promised,
  };
}

export async function computeGoodDeedBonusWallet(
  userId: string,
): Promise<GoodDeedBonusWallet> {
  return aggregateGoodDeedBonusWallet(prisma, userId);
}

export async function computeGoodDeedBonusWalletInTx(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<GoodDeedBonusWallet> {
  return aggregateGoodDeedBonusWallet(tx, userId);
}
