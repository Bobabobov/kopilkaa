import { ApplicationStatus, GoodDeedSubmissionStatus, GoodDeedWithdrawalStatus } from '@prisma/client';
import { buildUserAccountLinks } from '@/lib/admin/buildUserAccountLinks';
import { buildBonusLedgerForUser } from '@/lib/admin/bonusLedger';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';
import type { AdminUserLinkRef } from '@/types/admin';

async function buildDeviceLinks(userId: string): Promise<AdminUserLinkRef[]> {
  const rows = await prisma.application.findMany({
    where: { userId, deviceFingerprint: { not: null } },
    select: { deviceFingerprint: true },
    distinct: ['deviceFingerprint'],
  });
  const fingerprints = rows
    .map((r) => r.deviceFingerprint)
    .filter((fp): fp is string => Boolean(fp));
  if (fingerprints.length === 0) return [];

  const otherApps = await prisma.application.findMany({
    where: {
      deviceFingerprint: { in: fingerprints },
      userId: { not: userId },
    },
    select: { userId: true },
    distinct: ['userId'],
    take: 20,
  });
  const otherIds = [...new Set(otherApps.map((a) => a.userId))];
  if (otherIds.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: otherIds } },
    select: { id: true, email: true, name: true },
  });
  const map = new Map(users.map((u) => [u.id, u]));
  return otherIds.map(
    (id) => map.get(id) ?? { id, email: null, name: null },
  );
}

export async function buildAdminUserDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      phone: true,
      phoneVerified: true,
      emailVerified: true,
      role: true,
      createdAt: true,
      lastSeen: true,
      lastCommentAt: true,
      level: true,
      experience: true,
      bonusesInvestedInExperience: true,
      isBanned: true,
      bannedUntil: true,
      bannedReason: true,
      bonusWithdrawalBlocked: true,
      adminEconomyResetAt: true,
      telegramUsername: true,
      telegramId: true,
      googleEmail: true,
      googleId: true,
      vkLink: true,
      telegramLink: true,
      youtubeLink: true,
      referralCode: true,
      hideEmail: true,
      hideFromHeroes: true,
      heroBadgeOverride: true,
      maxSequenceRecord: true,
      headerTheme: true,
    },
  });

  if (!user) return null;

  const [
    applicationStatsGroups,
    applications,
    links,
    sameDevice,
    wallet,
    reviews,
    goodDeedSubmissionGroups,
    goodDeedSubmissions,
    goodDeedWithdrawalGroups,
    goodDeedWithdrawals,
    referralRegistrations,
    referralInvitedCount,
    referredBy,
    referralClicksCount,
    friendshipsAccepted,
    friendshipsPending,
    donationsAgg,
    achievements,
    loginStreak,
    bonusLedger,
    uniqueIps,
    uniqueDevices,
  ] = await Promise.all([
    prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        status: true,
        amount: true,
        category: true,
        createdAt: true,
        submitterIp: true,
        clientDevice: true,
        clientTimezone: true,
        deviceFingerprint: true,
        isFirstFree: true,
        submitBonusCost: true,
      },
    }),
    buildUserAccountLinks(userId),
    buildDeviceLinks(userId),
    computeGoodDeedBonusWallet(userId),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        content: true,
        applicationId: true,
        createdAt: true,
        application: { select: { title: true } },
      },
    }),
    prisma.goodDeedSubmission.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.goodDeedSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: {
        id: true,
        taskTitle: true,
        status: true,
        reward: true,
        createdAt: true,
      },
    }),
    prisma.goodDeedWithdrawalRequest.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.goodDeedWithdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        amountBonuses: true,
        status: true,
        bankName: true,
        createdAt: true,
      },
    }),
    prisma.referralRegistration.findMany({
      where: { referrerUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        referredUserId: true,
        createdAt: true,
        bonusGrantedAt: true,
        referredUser: {
          select: { id: true, email: true, name: true, username: true },
        },
      },
    }),
    prisma.referralRegistration.count({ where: { referrerUserId: userId } }),
    prisma.referralRegistration.findUnique({
      where: { referredUserId: userId },
      select: {
        createdAt: true,
        referrer: { select: { id: true, email: true, name: true, username: true } },
      },
    }),
    prisma.referralClick.count({ where: { referrerUserId: userId } }),
    prisma.friendship.count({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
    }),
    prisma.friendship.count({
      where: {
        status: 'PENDING',
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
    }),
    prisma.donation.aggregate({
      where: { userId },
      _count: { _all: true },
      _sum: { amount: true },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
      take: 20,
      select: {
        unlockedAt: true,
        achievement: { select: { slug: true, name: true, rarity: true } },
      },
    }),
    prisma.loginStreakState.findUnique({
      where: { userId },
      select: { currentStreak: true, maxStreak: true, lastVisitDate: true },
    }),
    buildBonusLedgerForUser(userId),
    prisma.application.findMany({
      where: { userId, submitterIp: { not: null } },
      select: { submitterIp: true },
      distinct: ['submitterIp'],
      take: 10,
    }),
    prisma.application.findMany({
      where: { userId, deviceFingerprint: { not: null } },
      select: { deviceFingerprint: true, clientDevice: true },
      distinct: ['deviceFingerprint'],
      take: 10,
    }),
  ]);

  const applicationStats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  };
  for (const row of applicationStatsGroups) {
    const count = row._count._all;
    applicationStats.total += count;
    if (row.status === ApplicationStatus.PENDING) applicationStats.pending = count;
    if (row.status === ApplicationStatus.APPROVED) applicationStats.approved = count;
    if (row.status === ApplicationStatus.REJECTED) applicationStats.rejected = count;
  }

  const goodDeedStats = { pending: 0, approved: 0, rejected: 0, total: 0 };
  for (const row of goodDeedSubmissionGroups) {
    const count = row._count._all;
    goodDeedStats.total += count;
    if (row.status === GoodDeedSubmissionStatus.PENDING) goodDeedStats.pending = count;
    if (row.status === GoodDeedSubmissionStatus.APPROVED) goodDeedStats.approved = count;
    if (row.status === GoodDeedSubmissionStatus.REJECTED) goodDeedStats.rejected = count;
  }

  const withdrawalStats = { pending: 0, approved: 0, rejected: 0, total: 0 };
  for (const row of goodDeedWithdrawalGroups) {
    const count = row._count._all;
    withdrawalStats.total += count;
    if (row.status === GoodDeedWithdrawalStatus.PENDING) withdrawalStats.pending = count;
    if (row.status === GoodDeedWithdrawalStatus.APPROVED) withdrawalStats.approved = count;
    if (row.status === GoodDeedWithdrawalStatus.REJECTED) withdrawalStats.rejected = count;
  }

  const resolvedLevel = resolveUserProfileLevel(user);
  const linkCount =
    links.samePayment.length + links.sameIp.length + sameDevice.length;

  return {
    ...user,
    level: resolvedLevel,
    createdAt: user.createdAt.toISOString(),
    lastSeen: user.lastSeen?.toISOString() ?? null,
    lastCommentAt: user.lastCommentAt?.toISOString() ?? null,
    bannedUntil: user.bannedUntil?.toISOString() ?? null,
    adminEconomyResetAt: user.adminEconomyResetAt?.toISOString() ?? null,
    auth: {
      hasEmail: Boolean(user.email),
      hasPhone: Boolean(user.phone),
      hasGoogle: Boolean(user.googleId),
      hasTelegram: Boolean(user.telegramId),
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    },
    applicationStats,
    applications: applications.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      deviceFingerprintShort: app.deviceFingerprint
        ? `${app.deviceFingerprint.slice(0, 12)}…`
        : null,
    })),
    links: { ...links, sameDevice },
    linkCount,
    wallet: {
      availableBonuses: wallet.availableBonuses,
      grossBonuses: wallet.grossBonuses,
      withdrawnBonuses: wallet.withdrawnBonuses,
      pendingWithdrawalBonuses: wallet.pendingWithdrawalBonuses,
      withdrawalBlocked: wallet.withdrawalBlocked,
      bonusesInvestedInExperience: wallet.bonusesInvestedInExperience,
      totalEarnedBonuses: wallet.totalEarnedBonuses,
    },
    reviews: reviews.map((r) => ({
      id: r.id,
      content: r.content,
      applicationId: r.applicationId,
      applicationTitle: r.application?.title ?? null,
      createdAt: r.createdAt.toISOString(),
    })),
    goodDeeds: {
      stats: goodDeedStats,
      submissions: goodDeedSubmissions.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      })),
      withdrawals: {
        stats: withdrawalStats,
        items: goodDeedWithdrawals.map((w) => ({
          ...w,
          createdAt: w.createdAt.toISOString(),
        })),
      },
    },
    referrals: {
      clicksCount: referralClicksCount,
      invitedCount: referralInvitedCount,
      invited: referralRegistrations.map((r) => ({
        userId: r.referredUserId,
        name: r.referredUser.name,
        email: r.referredUser.email,
        username: r.referredUser.username,
        registeredAt: r.createdAt.toISOString(),
        bonusGrantedAt: r.bonusGrantedAt?.toISOString() ?? null,
      })),
      referredBy: referredBy
        ? {
            userId: referredBy.referrer.id,
            name: referredBy.referrer.name,
            email: referredBy.referrer.email,
            username: referredBy.referrer.username,
            registeredAt: referredBy.createdAt.toISOString(),
          }
        : null,
    },
    social: {
      friendsAccepted: friendshipsAccepted,
      friendsPending: friendshipsPending,
      donationsCount: donationsAgg._count._all,
      donationsTotal: donationsAgg._sum.amount ?? 0,
    },
    achievements: achievements.map((a) => ({
      slug: a.achievement.slug,
      name: a.achievement.name,
      rarity: a.achievement.rarity,
      unlockedAt: a.unlockedAt.toISOString(),
    })),
    loginStreak: loginStreak
      ? {
          current: loginStreak.currentStreak,
          max: loginStreak.maxStreak,
          lastVisitDate: loginStreak.lastVisitDate,
        }
      : null,
    bonusLedger,
    techTrace: {
      ips: uniqueIps.map((r) => r.submitterIp).filter(Boolean) as string[],
      devices: uniqueDevices.map((r) => ({
        fingerprintShort: r.deviceFingerprint
          ? `${r.deviceFingerprint.slice(0, 12)}…`
          : null,
        clientDevice: r.clientDevice,
      })),
    },
  };
}

export type BuiltAdminUserDetail = NonNullable<
  Awaited<ReturnType<typeof buildAdminUserDetail>>
>;
