import { ApplicationStatus, type Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { economyActivitySince } from '@/lib/applications/economySinceReset';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';

export type UserEconomyContext = {
  profileLevel: number;
  adminEconomyResetAt: Date | null;
  applicationSince: ReturnType<typeof economyActivitySince>;
  /** Все заявки с момента последнего админского сброса. */
  priorApplicationCount: number;
  lastApplicationCreatedAt: Date | null;
  /** Одобренные заявки с момента последнего админского сброса. */
  approvedApplicationCount: number;
  /** Последняя одобренная заявка в текущем цикле (для отзыва). */
  lastApprovedApplication: { id: string; title: string } | null;
};

/** Нужен ли отзыв перед следующей заявкой в текущем цикле. */
export function requiresReviewBeforeNextApplication(
  ctx: Pick<
    UserEconomyContext,
    'priorApplicationCount' | 'approvedApplicationCount'
  >,
): boolean {
  return (
    ctx.priorApplicationCount >= 1 && ctx.approvedApplicationCount >= 1
  );
}

export async function loadUserEconomyContext(
  db: Prisma.TransactionClient | typeof prisma,
  userId: string,
): Promise<UserEconomyContext | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      level: true,
      experience: true,
      adminEconomyResetAt: true,
    },
  });

  if (!user) return null;

  const applicationSince = economyActivitySince(user.adminEconomyResetAt);

  const [
    priorApplicationCount,
    lastApplication,
    approvedApplicationCount,
    lastApprovedApplication,
  ] = await Promise.all([
    db.application.count({
      where: { userId, ...applicationSince },
    }),
    db.application.findFirst({
      where: { userId, ...applicationSince },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    db.application.count({
      where: {
        userId,
        status: ApplicationStatus.APPROVED,
        ...applicationSince,
      },
    }),
    db.application.findFirst({
      where: {
        userId,
        status: ApplicationStatus.APPROVED,
        ...applicationSince,
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
    }),
  ]);

  return {
    profileLevel: resolveUserProfileLevel(user),
    adminEconomyResetAt: user.adminEconomyResetAt,
    applicationSince,
    priorApplicationCount,
    lastApplicationCreatedAt: lastApplication?.createdAt ?? null,
    approvedApplicationCount,
    lastApprovedApplication: lastApprovedApplication ?? null,
  };
}
