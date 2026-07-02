import { describe, expect, it, vi } from 'vitest';
import {
  FIRST_WITHDRAWAL_BONUS_AMOUNT,
  FIRST_WITHDRAWAL_BONUS_GRANT_COMMENT,
  grantFirstWithdrawalBonusIfEligible,
  isEligibleForFirstWithdrawalBonus,
} from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { getTotalXpForLevel } from '@/lib/userLevel/calculate';
import { toStoredExperience } from '@/lib/userLevel/economy';

function createMockTx(overrides?: {
  approvedCount?: number;
  hasGrant?: boolean;
  profileLevel?: number;
  adminEconomyResetAt?: Date | null;
}) {
  const approvedCount = overrides?.approvedCount ?? 0;
  const hasGrant = overrides?.hasGrant ?? false;
  const profileLevel = overrides?.profileLevel ?? 3;
  const adminEconomyResetAt = overrides?.adminEconomyResetAt ?? null;
  const experience = toStoredExperience(getTotalXpForLevel(profileLevel));

  return {
    user: {
      findUnique: vi.fn().mockResolvedValue({
        level: profileLevel,
        experience,
        adminEconomyResetAt,
      }),
    },
    goodDeedWithdrawalRequest: {
      count: vi.fn().mockResolvedValue(approvedCount),
    },
    goodDeedBonusGrant: {
      findFirst: vi.fn().mockResolvedValue(hasGrant ? { id: 'g1' } : null),
      create: vi.fn().mockResolvedValue({ id: 'new-grant' }),
    },
  };
}

describe('firstWithdrawalBonus', () => {
  it('не должно считать eligible до первого одобренного вывода', async () => {
    const tx = createMockTx({ approvedCount: 0 });
    await expect(
      isEligibleForFirstWithdrawalBonus(tx as never, 'u1'),
    ).resolves.toBe(false);
  });

  it('не должно считать eligible ниже 3 уровня', async () => {
    const tx = createMockTx({ approvedCount: 1, profileLevel: 2 });
    await expect(
      isEligibleForFirstWithdrawalBonus(tx as never, 'u1'),
    ).resolves.toBe(false);
  });

  it('не должно давать бонус повторно', async () => {
    const tx = createMockTx({ hasGrant: true });
    const result = await grantFirstWithdrawalBonusIfEligible(tx as never, 'u1');
    expect(result.granted).toBe(false);
    expect(tx.goodDeedBonusGrant.create).not.toHaveBeenCalled();
  });

  it('должно начислить +30 бонусов при claim после первого вывода', async () => {
    const tx = createMockTx({ approvedCount: 1 });
    const result = await grantFirstWithdrawalBonusIfEligible(tx as never, 'u1');
    expect(result).toEqual({
      granted: true,
      amount: FIRST_WITHDRAWAL_BONUS_AMOUNT,
    });
    expect(tx.goodDeedBonusGrant.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        amountBonuses: FIRST_WITHDRAWAL_BONUS_AMOUNT,
        comment: FIRST_WITHDRAWAL_BONUS_GRANT_COMMENT,
      },
    });
  });

  it('должно считать eligible при одном одобренном выводе без гранта на 3 уровне', async () => {
    const tx = createMockTx({ approvedCount: 1, profileLevel: 3 });
    await expect(
      isEligibleForFirstWithdrawalBonus(tx as never, 'u1'),
    ).resolves.toBe(true);
  });

  it('не должно быть eligible без одобренных выводов', async () => {
    const tx = createMockTx({ approvedCount: 0 });
    await expect(
      isEligibleForFirstWithdrawalBonus(tx as never, 'u1'),
    ).resolves.toBe(false);
  });

  it('не должно быть eligible после второго одобренного вывода, если грант уже есть', async () => {
    const tx = createMockTx({ approvedCount: 2, hasGrant: true });
    await expect(
      isEligibleForFirstWithdrawalBonus(tx as never, 'u1'),
    ).resolves.toBe(false);
  });
});
