import { describe, expect, it, vi } from 'vitest';
import {
  LEVEL_3_MILESTONE_BONUS_AMOUNT,
  LEVEL_3_MILESTONE_GRANT_COMMENT,
  grantLevel3MilestoneBonusIfEligible,
} from '@/lib/userLevel/levelMilestoneBonuses';

function createMockTx(overrides?: {
  hasGrant?: boolean;
  adminEconomyResetAt?: Date | null;
}) {
  const hasGrant = overrides?.hasGrant ?? false;
  const adminEconomyResetAt = overrides?.adminEconomyResetAt ?? null;

  return {
    user: {
      findUnique: vi.fn().mockResolvedValue({ adminEconomyResetAt }),
    },
    goodDeedBonusGrant: {
      findFirst: vi.fn().mockResolvedValue(hasGrant ? { id: 'g1' } : null),
      create: vi.fn().mockResolvedValue({ id: 'new-grant' }),
    },
  };
}

describe('levelMilestoneBonuses', () => {
  it('не должно начислять бонус, если уровень не достиг 3', async () => {
    const tx = createMockTx();
    const result = await grantLevel3MilestoneBonusIfEligible(tx as never, 'u1', 2, 2);
    expect(result.granted).toBe(false);
    expect(tx.goodDeedBonusGrant.create).not.toHaveBeenCalled();
  });

  it('не должно начислять бонус повторно', async () => {
    const tx = createMockTx({ hasGrant: true });
    const result = await grantLevel3MilestoneBonusIfEligible(tx as never, 'u1', 2, 3);
    expect(result.granted).toBe(false);
    expect(tx.goodDeedBonusGrant.create).not.toHaveBeenCalled();
  });

  it('должно начислить +15 бонусов при переходе на 3 уровень', async () => {
    const tx = createMockTx();
    const result = await grantLevel3MilestoneBonusIfEligible(tx as never, 'u1', 2, 3);
    expect(result).toEqual({
      granted: true,
      amount: LEVEL_3_MILESTONE_BONUS_AMOUNT,
    });
    expect(tx.goodDeedBonusGrant.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        amountBonuses: LEVEL_3_MILESTONE_BONUS_AMOUNT,
        comment: LEVEL_3_MILESTONE_GRANT_COMMENT,
      },
    });
  });

  it('не должно начислять, если пользователь уже был на 3+ уровне', async () => {
    const tx = createMockTx();
    const result = await grantLevel3MilestoneBonusIfEligible(tx as never, 'u1', 3, 4);
    expect(result.granted).toBe(false);
    expect(tx.goodDeedBonusGrant.create).not.toHaveBeenCalled();
  });
});
