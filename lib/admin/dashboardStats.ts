import { prisma } from '@/lib/db';

export type AdminDashboardCounts = {
  applicationsPending: number;
  feedbackNew: number;
  goodDeedsPending: number;
  withdrawalsPending: number;
  adRequestsNew: number;
};

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
  const [
    applicationsPending,
    feedbackNew,
    goodDeedsPending,
    withdrawalsPending,
    adRequestsNew,
  ] = await Promise.all([
    prisma.application.count({ where: { status: 'PENDING' } }).catch(() => 0),
    prisma.siteFeedback.count({ where: { status: 'new' } }).catch(() => 0),
    prisma.goodDeedSubmission
      .count({ where: { status: 'PENDING' } })
      .catch(() => 0),
    prisma.goodDeedWithdrawalRequest
      .count({ where: { status: 'PENDING' } })
      .catch(() => 0),
    prisma.adRequest.count({ where: { status: 'new' } }).catch(() => 0),
  ]);

  return {
    applicationsPending,
    feedbackNew,
    goodDeedsPending,
    withdrawalsPending,
    adRequestsNew,
  };
}
