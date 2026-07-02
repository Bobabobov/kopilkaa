import type { BonusLedgerUserGroup } from "@/lib/admin/bonusLedger";

export type BonusUserBreakdown = {
  goodDeeds: number;
  referrals: number;
  dailyBonus: number;
  dailyChest: number;
  adminManual: number;
  other: number;
};

export type BonusReportUserRow = {
  user: {
    id: string;
    name: string;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  breakdown: BonusUserBreakdown;
  totalEarnedBonuses: number;
  availableBonuses: number;
  pendingWithdrawalBonuses: number;
  withdrawnBonuses: number;
  dailyClaimsCount: number;
  currentStreak: number;
  withdrawalBlocked: boolean;
  level: number;
  experience: number;
  progressPercent: number;
};

export type WithdrawItem = {
  id: string;
  amountBonuses: number;
  profileLevel: number;
  bankName: string;
  details: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
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
  ledgerUsers: BonusLedgerUserGroup[];
  withdrawals: WithdrawItem[];
};
