import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { formatHoursSinceLastApplication } from '@/lib/applications/applicationEconomy';
import { getMaxApplicationAmount } from '@/lib/level-config';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';
import type { ApplicationEconomyAdminInfo } from '@/app/admin/applications/[id]/_components/ApplicationEconomyBlock';

export async function buildApplicationEconomyAdminInfo(params: {
  applicationId: string;
  userId: string;
  createdAt: Date;
  userLevelAtSubmit: number | null;
  submitBonusCost: number;
  isFirstFree: boolean;
  requestedAmount: number;
  desiredAmount?: number | null;
}): Promise<ApplicationEconomyAdminInfo> {
  const {
    applicationId,
    userId,
    createdAt,
    userLevelAtSubmit,
    submitBonusCost,
    isFirstFree,
    requestedAmount,
    desiredAmount = null,
  } = params;

  const [user, previousApplication, wallet] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true },
    }),
    prisma.application.findFirst({
      where: {
        userId,
        id: { not: applicationId },
        createdAt: { lt: createdAt },
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    computeGoodDeedBonusWallet(userId),
  ]);

  const userLevel = resolveUserProfileLevel(user ?? {});
  const levelForLimit = userLevelAtSubmit ?? userLevel;

  return {
    userLevel,
    userLevelAtSubmit,
    helpLimit: getMaxApplicationAmount(levelForLimit),
    submitBonusCost,
    isFirstFree,
    hoursSincePrevious: formatHoursSinceLastApplication(
      previousApplication?.createdAt ?? null,
      createdAt,
    ),
    availableBonuses: wallet.availableBonuses,
    requestedAmount,
    desiredAmount,
  };
}
