import {
  GoodDeedSubmissionStatus,
  GoodDeedWithdrawalStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";

export type GoodDeedBonusWallet = {
  totalEarnedBonuses: number;
  availableBonuses: number;
  pendingWithdrawalBonuses: number;
  withdrawnBonuses: number;
  hasPendingWithdrawal: boolean;
};

export async function computeGoodDeedBonusWallet(
  userId: string,
): Promise<GoodDeedBonusWallet> {
  const earnedRow = await prisma.goodDeedSubmission.aggregate({
    where: {
      userId,
      status: GoodDeedSubmissionStatus.APPROVED,
    },
    _sum: { reward: true },
  });
  const totalEarnedBonuses = earnedRow._sum.reward ?? 0;

  const withdrawals = await prisma.goodDeedWithdrawalRequest.findMany({
    where: { userId },
    select: { status: true, amountBonuses: true },
  });

  let withdrawnBonuses = 0;
  let pendingWithdrawalBonuses = 0;
  let pendingCount = 0;

  for (const w of withdrawals) {
    if (w.status === GoodDeedWithdrawalStatus.APPROVED) {
      withdrawnBonuses += w.amountBonuses;
    }
    if (w.status === GoodDeedWithdrawalStatus.PENDING) {
      pendingWithdrawalBonuses += w.amountBonuses;
      pendingCount += 1;
    }
  }

  const availableBonuses = Math.max(
    0,
    totalEarnedBonuses - withdrawnBonuses - pendingWithdrawalBonuses,
  );

  return {
    totalEarnedBonuses,
    availableBonuses,
    pendingWithdrawalBonuses,
    withdrawnBonuses,
    hasPendingWithdrawal: pendingCount > 0,
  };
}
