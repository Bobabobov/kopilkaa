import {
  GoodDeedWithdrawalStatus,
  type Prisma,
} from '@prisma/client';
import { prisma } from '@/lib/db';
import { economyActivitySince } from '@/lib/applications/economySinceReset';
import { MIN_WITHDRAWAL_PROFILE_LEVEL } from '@/lib/bonusWithdrawals/constants';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';

/** Одноразовый подарок после первого одобренного вывода (забирается вручную) */
export const FIRST_WITHDRAWAL_BONUS_AMOUNT = 30;

export const FIRST_WITHDRAWAL_BONUS_GRANT_COMMENT = 'first_withdrawal_bonus';

export type FirstWithdrawalBonusStatus = {
  amount: number;
  promised: boolean;
  claimable: boolean;
  claimed: boolean;
};

export function emptyFirstWithdrawalBonusStatus(): FirstWithdrawalBonusStatus {
  return {
    amount: FIRST_WITHDRAWAL_BONUS_AMOUNT,
    promised: false,
    claimable: false,
    claimed: false,
  };
}

/** Текст перка в пути уровней */
export function formatFirstWithdrawalBonusPerk(): string {
  return `Подарок +${FIRST_WITHDRAWAL_BONUS_AMOUNT} бон. после первого вывода — заберите в профиле`;
}

export function formatFirstWithdrawalBonusTeaserHint(): string {
  return `После первого одобренного вывода на СБП появится кнопка «Забрать +${FIRST_WITHDRAWAL_BONUS_AMOUNT} бон.» на баланс — отдельно от суммы перевода.`;
}

export function formatFirstWithdrawalBonusClaimHint(): string {
  return `Первый вывод одобрен. Нажмите «Забрать», чтобы получить +${FIRST_WITHDRAWAL_BONUS_AMOUNT} бон. на баланс.`;
}

export async function hasFirstWithdrawalBonusGrant(
  db: Prisma.TransactionClient | { goodDeedBonusGrant: Prisma.TransactionClient['goodDeedBonusGrant'] },
  userId: string,
  since?: Date | null,
): Promise<boolean> {
  const existing = await db.goodDeedBonusGrant.findFirst({
    where: {
      userId,
      comment: FIRST_WITHDRAWAL_BONUS_GRANT_COMMENT,
      ...economyActivitySince(since),
    },
    select: { id: true },
  });
  return existing != null;
}

export async function isEligibleForFirstWithdrawalBonus(
  db: Prisma.TransactionClient,
  userId: string,
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { level: true, experience: true, adminEconomyResetAt: true },
  });
  if (!user) return false;

  const profileLevel = resolveUserProfileLevel(user);
  if (profileLevel < MIN_WITHDRAWAL_PROFILE_LEVEL) return false;

  const withdrawalSince = economyActivitySince(user.adminEconomyResetAt);
  const [approvedCount, hasGrant] = await Promise.all([
    db.goodDeedWithdrawalRequest.count({
      where: {
        userId,
        status: GoodDeedWithdrawalStatus.APPROVED,
        ...withdrawalSince,
      },
    }),
    hasFirstWithdrawalBonusGrant(db, userId, user.adminEconomyResetAt),
  ]);

  return approvedCount >= 1 && !hasGrant;
}

export function getFirstWithdrawalBonusStatus(
  _userId: string,
  profileLevel: number,
  approvedWithdrawalCount: number,
  hasGrant: boolean,
): FirstWithdrawalBonusStatus {
  const unlocked = profileLevel >= MIN_WITHDRAWAL_PROFILE_LEVEL;
  const claimed = hasGrant;

  return {
    amount: FIRST_WITHDRAWAL_BONUS_AMOUNT,
    promised: unlocked && !claimed && approvedWithdrawalCount === 0,
    claimable: unlocked && !claimed && approvedWithdrawalCount >= 1,
    claimed,
  };
}

export async function claimFirstWithdrawalBonus(
  userId: string,
): Promise<{ claimed: boolean; amount: number }> {
  return prisma.$transaction(async (tx) => {
    const result = await grantFirstWithdrawalBonusIfEligible(tx, userId);
    return { claimed: result.granted, amount: result.amount };
  });
}

/** @deprecated Автоначисление отключено — только ручной claim */
export async function syncMissedFirstWithdrawalBonus(
  _userId: string,
): Promise<{ granted: boolean; amount: number }> {
  return { granted: false, amount: 0 };
}

export async function grantFirstWithdrawalBonusIfEligible(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<{ granted: boolean; amount: number }> {
  if (!(await isEligibleForFirstWithdrawalBonus(tx, userId))) {
    return { granted: false, amount: 0 };
  }

  await tx.goodDeedBonusGrant.create({
    data: {
      userId,
      amountBonuses: FIRST_WITHDRAWAL_BONUS_AMOUNT,
      comment: FIRST_WITHDRAWAL_BONUS_GRANT_COMMENT,
    },
  });

  return { granted: true, amount: FIRST_WITHDRAWAL_BONUS_AMOUNT };
}
