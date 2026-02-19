import { ApplicationStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  getEffectiveApprovedForTrust,
  getNextLevelRequirement,
  getTrustLevelFromEffectiveApproved,
  getTrustLimits,
  type TrustLevel,
} from "@/lib/trustLevel";

type TrustSnapshot = {
  approvedApplications: number;
  effectiveApprovedApplications: number;
  trustLevel: TrustLevel;
  limits: { min: number; max: number };
  supportRangeText: string;
  nextRequired: number | null;
  progressCurrent: number;
  progressTotal: number;
  progressText: string | null;
};

export async function computeUserTrustSnapshot(
  userId: string,
): Promise<TrustSnapshot> {
  const [approvedApplications, effectiveApprovedApplications, user] =
    await Promise.all([
      prisma.application.count({
        where: { userId, status: ApplicationStatus.APPROVED },
      }),
      prisma.application.count({
        where: {
          userId,
          status: ApplicationStatus.APPROVED,
          countTowardsTrust: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { trustDelta: true },
      }),
    ]);

  const trustDelta = user?.trustDelta ?? 0;
  const adjustedApproved = getEffectiveApprovedForTrust(
    effectiveApprovedApplications,
    trustDelta,
  );
  /* Уровень и лимиты — с учётом trustDelta, чтобы «понизить уровень» в админке реально понижал уровень и лимит (150 вместо 300). */
  const trustLevel = getTrustLevelFromEffectiveApproved(
    effectiveApprovedApplications,
    trustDelta,
  );
  const limits = getTrustLimits(trustLevel);
  const nextRequired = getNextLevelRequirement(trustLevel);
  /* Прогресс «X из Y» — по скорректированному числу, чтобы при понижении уровня отображалось 0 из 3, а не 3 из 3. */
  const progressCurrent =
    nextRequired === null
      ? Math.max(0, adjustedApproved)
      : Math.min(Math.max(0, adjustedApproved), nextRequired);
  const progressTotal = nextRequired ?? Math.max(0, adjustedApproved);
  const supportRangeText = `от ${limits.min.toLocaleString(
    "ru-RU",
  )} до ${limits.max.toLocaleString("ru-RU")} ₽`;
  const progressText =
    nextRequired === null
      ? null
      : `До пересмотра уровня — ещё ${Math.max(
          0,
          nextRequired - progressCurrent,
        )} одобренных заявок`;

  return {
    approvedApplications,
    effectiveApprovedApplications,
    trustLevel,
    limits,
    supportRangeText,
    nextRequired,
    progressCurrent,
    progressTotal,
    progressText,
  };
}
