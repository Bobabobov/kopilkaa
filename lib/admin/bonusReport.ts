import {
  GoodDeedSubmissionStatus,
  GoodDeedWithdrawalStatus,
} from "@prisma/client";
import {
  BONUS_SOURCE_LABELS,
  BonusSourceCategory,
  categorizeBonusGrant,
} from "@/lib/admin/bonusGrantCategory";
import { prisma } from "@/lib/db";

export type BonusUserBreakdown = {
  goodDeeds: number;
  referrals: number;
  dailyBonus: number;
  adminManual: number;
  other: number;
};

export type BonusReportUserRow = {
  user: {
    id: string;
    name: string;
    username: string | null;
    email: string | null;
    avatar: string | null;
  };
  breakdown: BonusUserBreakdown;
  totalEarnedBonuses: number;
  availableBonuses: number;
  pendingWithdrawalBonuses: number;
  withdrawnBonuses: number;
  dailyClaimsCount: number;
  currentStreak: number;
  withdrawalBlocked: boolean;
};

export type BonusLedgerEntry = {
  id: string;
  category: BonusSourceCategory;
  categoryLabel: string;
  amountBonuses: number;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
};

export type BonusWithdrawItem = {
  id: string;
  amountBonuses: number;
  bankName: string;
  details: string;
  status: GoodDeedWithdrawalStatus;
  adminComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string | null;
    email: string | null;
    avatar: string | null;
  };
};

export type BonusReportSummary = {
  bySource: BonusUserBreakdown;
  totalEarned: number;
  totalAvailable: number;
  totalPendingWithdrawals: number;
  totalWithdrawn: number;
  usersWithBonuses: number;
  dailyClaimsTotal: number;
  pendingWithdrawalsCount: number;
};

export type BonusReport = {
  summary: BonusReportSummary;
  users: BonusReportUserRow[];
  ledger: BonusLedgerEntry[];
  withdrawals: BonusWithdrawItem[];
};

function emptyBreakdown(): BonusUserBreakdown {
  return {
    goodDeeds: 0,
    referrals: 0,
    dailyBonus: 0,
    adminManual: 0,
    other: 0,
  };
}

function addToBreakdown(
  breakdown: BonusUserBreakdown,
  category: BonusSourceCategory,
  amount: number,
) {
  breakdown[category] += amount;
}

function formatUserLabel(user: {
  name: string | null;
  username: string | null;
}): string {
  return user.name || user.username || "Пользователь";
}

export async function buildAdminBonusReport(): Promise<BonusReport> {
  const [
    earnedByUser,
    grants,
    withdrawalsByUser,
    withdrawalRows,
    dailyClaimsAgg,
    dailyStates,
    recentSubmissions,
    recentGrants,
  ] = await Promise.all([
    prisma.goodDeedSubmission.groupBy({
      by: ["userId"],
      where: { status: GoodDeedSubmissionStatus.APPROVED },
      _sum: { reward: true },
    }),
    prisma.goodDeedBonusGrant.findMany({
      select: {
        id: true,
        userId: true,
        amountBonuses: true,
        comment: true,
        grantedById: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, username: true },
        },
      },
    }),
    prisma.goodDeedWithdrawalRequest.groupBy({
      by: ["userId", "status"],
      _sum: { amountBonuses: true },
    }),
    prisma.goodDeedWithdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        amountBonuses: true,
        bankName: true,
        details: true,
        status: true,
        adminComment: true,
        reviewedAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.dailyBonusClaim.groupBy({
      by: ["userId"],
      _count: { _all: true },
      _sum: { dailyBonus: true, milestoneBonus: true },
    }),
    prisma.dailyBonusState.findMany({
      select: { userId: true, currentStreak: true },
    }),
    prisma.goodDeedSubmission.findMany({
      where: {
        status: GoodDeedSubmissionStatus.APPROVED,
        reward: { gt: 0 },
      },
      orderBy: { updatedAt: "desc" },
      take: 80,
      select: {
        id: true,
        userId: true,
        reward: true,
        taskTitle: true,
        updatedAt: true,
        user: { select: { id: true, name: true, username: true, avatar: true } },
      },
    }),
    prisma.goodDeedBonusGrant.findMany({
      orderBy: { createdAt: "desc" },
      take: 120,
      select: {
        id: true,
        userId: true,
        amountBonuses: true,
        comment: true,
        grantedById: true,
        createdAt: true,
        user: { select: { id: true, name: true, username: true, avatar: true } },
      },
    }),
  ]);

  const userIds = new Set<string>();
  for (const row of earnedByUser) userIds.add(row.userId);
  for (const row of grants) userIds.add(row.userId);
  for (const row of withdrawalsByUser) userIds.add(row.userId);
  for (const row of withdrawalRows) userIds.add(row.user.id);
  for (const row of dailyClaimsAgg) userIds.add(row.userId);

  const users =
    userIds.size > 0
      ? await prisma.user.findMany({
          where: { id: { in: Array.from(userIds) } },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
            bonusWithdrawalBlocked: true,
          },
        })
      : [];
  const userMap = new Map(users.map((user) => [user.id, user]));

  const breakdownByUser = new Map<string, BonusUserBreakdown>();
  const getBreakdown = (userId: string) => {
    const existing = breakdownByUser.get(userId);
    if (existing) return existing;
    const fresh = emptyBreakdown();
    breakdownByUser.set(userId, fresh);
    return fresh;
  };

  const summaryBreakdown = emptyBreakdown();

  for (const row of earnedByUser) {
    const amount = row._sum.reward ?? 0;
    if (amount <= 0) continue;
    addToBreakdown(getBreakdown(row.userId), "goodDeeds", amount);
    addToBreakdown(summaryBreakdown, "goodDeeds", amount);
  }

  for (const grant of grants) {
    const category = categorizeBonusGrant(grant.comment, grant.grantedById);
    addToBreakdown(getBreakdown(grant.userId), category, grant.amountBonuses);
    addToBreakdown(summaryBreakdown, category, grant.amountBonuses);
  }

  const withdrawalsMap = new Map<
    string,
    { withdrawnBonuses: number; pendingWithdrawalBonuses: number }
  >();
  for (const row of withdrawalsByUser) {
    const current = withdrawalsMap.get(row.userId) ?? {
      withdrawnBonuses: 0,
      pendingWithdrawalBonuses: 0,
    };
    const amount = row._sum.amountBonuses ?? 0;
    if (row.status === GoodDeedWithdrawalStatus.APPROVED) {
      current.withdrawnBonuses += amount;
    } else if (row.status === GoodDeedWithdrawalStatus.PENDING) {
      current.pendingWithdrawalBonuses += amount;
    }
    withdrawalsMap.set(row.userId, current);
  }

  const dailyClaimsCountMap = new Map<string, number>();
  let dailyClaimsTotal = 0;
  for (const row of dailyClaimsAgg) {
    dailyClaimsCountMap.set(row.userId, row._count._all);
    dailyClaimsTotal += row._count._all;
  }

  const streakMap = new Map(
    dailyStates.map((row) => [row.userId, row.currentStreak]),
  );

  let totalAvailable = 0;
  let totalPendingWithdrawals = 0;
  let totalWithdrawn = 0;

  const userRows: BonusReportUserRow[] = Array.from(userIds)
    .map((userId) => {
      const user = userMap.get(userId);
      const breakdown = breakdownByUser.get(userId) ?? emptyBreakdown();
      const totalEarnedBonuses = Object.values(breakdown).reduce(
        (sum, value) => sum + value,
        0,
      );
      const wallet = withdrawalsMap.get(userId) ?? {
        withdrawnBonuses: 0,
        pendingWithdrawalBonuses: 0,
      };
      const availableBonuses = Math.max(
        0,
        totalEarnedBonuses -
          wallet.withdrawnBonuses -
          wallet.pendingWithdrawalBonuses,
      );

      totalAvailable += availableBonuses;
      totalPendingWithdrawals += wallet.pendingWithdrawalBonuses;
      totalWithdrawn += wallet.withdrawnBonuses;

      return {
        user: {
          id: userId,
          name: formatUserLabel(user ?? { name: null, username: null }),
          username: user?.username ?? null,
          email: user?.email ?? null,
          avatar: user?.avatar ?? null,
        },
        breakdown,
        totalEarnedBonuses,
        availableBonuses,
        pendingWithdrawalBonuses: wallet.pendingWithdrawalBonuses,
        withdrawnBonuses: wallet.withdrawnBonuses,
        dailyClaimsCount: dailyClaimsCountMap.get(userId) ?? 0,
        currentStreak: streakMap.get(userId) ?? 0,
        withdrawalBlocked: user?.bonusWithdrawalBlocked ?? false,
      };
    })
    .filter((row) => row.totalEarnedBonuses > 0 || row.availableBonuses > 0)
    .sort((a, b) => b.availableBonuses - a.availableBonuses);

  const ledgerFromSubmissions: BonusLedgerEntry[] = recentSubmissions.map(
    (row) => ({
      id: `submission-${row.id}`,
      category: "goodDeeds" as const,
      categoryLabel: BONUS_SOURCE_LABELS.goodDeeds,
      amountBonuses: row.reward,
      description: row.taskTitle
        ? `Задание: ${row.taskTitle}`
        : "Награда за доброе дело",
      createdAt: row.updatedAt.toISOString(),
      user: {
        id: row.user.id,
        name: formatUserLabel(row.user),
        username: row.user.username,
        avatar: row.user.avatar,
      },
    }),
  );

  const ledgerFromGrants: BonusLedgerEntry[] = recentGrants.map((grant) => {
    const category = categorizeBonusGrant(grant.comment, grant.grantedById);
    return {
      id: `grant-${grant.id}`,
      category,
      categoryLabel: BONUS_SOURCE_LABELS[category],
      amountBonuses: grant.amountBonuses,
      description: grant.comment?.trim() || BONUS_SOURCE_LABELS[category],
      createdAt: grant.createdAt.toISOString(),
      user: {
        id: grant.user.id,
        name: formatUserLabel(grant.user),
        username: grant.user.username,
        avatar: grant.user.avatar,
      },
    };
  });

  const ledger = [...ledgerFromSubmissions, ...ledgerFromGrants]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 150);

  const totalEarned = Object.values(summaryBreakdown).reduce(
    (sum, value) => sum + value,
    0,
  );

  const pendingWithdrawalsCount = withdrawalRows.filter(
    (row) => row.status === GoodDeedWithdrawalStatus.PENDING,
  ).length;

  return {
    summary: {
      bySource: summaryBreakdown,
      totalEarned,
      totalAvailable,
      totalPendingWithdrawals,
      totalWithdrawn,
      usersWithBonuses: userRows.length,
      dailyClaimsTotal,
      pendingWithdrawalsCount,
    },
    users: userRows,
    ledger,
    withdrawals: withdrawalRows.map((row) => ({
      id: row.id,
      amountBonuses: row.amountBonuses,
      bankName: row.bankName,
      details: row.details,
      status: row.status,
      adminComment: row.adminComment,
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      user: {
        id: row.user.id,
        name: formatUserLabel(row.user),
        username: row.user.username,
        email: row.user.email,
        avatar: row.user.avatar,
      },
    })),
  };
}
