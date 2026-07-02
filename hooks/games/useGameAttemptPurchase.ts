'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  MAX_DAILY_ATTEMPT_PURCHASES,
  getDailyAttemptPurchasesRemaining,
} from '@/lib/games/gameAttemptPurchases';
import {
  type GameStakeDifficulty,
  getExtraAttemptCost,
} from '@/lib/games/extraAttemptCost';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';

interface PurchaseApiResponse {
  success: boolean;
  data: {
    balanceAfter: number;
    purchasedAttemptsAvailable: number;
    dailyAttemptPurchasesUsed: number;
    dailyAttemptPurchasesRemaining: number;
    cost: number;
  };
}

interface UseGameAttemptPurchaseOptions {
  purchaseUrl: string;
  initialPurchasedAttemptsAvailable: number;
  initialDailyAttemptPurchasesUsed?: number;
  dailyAttemptsLeft: number;
  balance: number;
  phase: string;
  isSubmitting: boolean;
  difficulty?: GameStakeDifficulty;
  onError: (message: string | null) => void;
  onBalanceChange: (balance: number) => void;
}

export function useGameAttemptPurchase({
  purchaseUrl,
  initialPurchasedAttemptsAvailable,
  initialDailyAttemptPurchasesUsed = 0,
  dailyAttemptsLeft,
  balance,
  phase,
  isSubmitting,
  difficulty = 'medium',
  onError,
  onBalanceChange,
}: UseGameAttemptPurchaseOptions) {
  const [purchasedAttemptsAvailable, setPurchasedAttemptsAvailable] = useState(
    initialPurchasedAttemptsAvailable,
  );
  const [dailyAttemptPurchasesUsed, setDailyAttemptPurchasesUsed] = useState(
    initialDailyAttemptPurchasesUsed,
  );
  const [isPurchasing, setIsPurchasing] = useState(false);

  const extraAttemptCost = useMemo(
    () => getExtraAttemptCost(difficulty),
    [difficulty],
  );

  const dailyAttemptPurchasesRemaining = getDailyAttemptPurchasesRemaining(
    dailyAttemptPurchasesUsed,
  );
  const canAffordPurchase = balance >= extraAttemptCost;
  const hasAttemptSlot = dailyAttemptsLeft > 0 || purchasedAttemptsAvailable > 0;
  const canPurchaseAttempt =
    phase === 'idle' &&
    !isSubmitting &&
    !isPurchasing &&
    dailyAttemptsLeft <= 0 &&
    canAffordPurchase &&
    dailyAttemptPurchasesRemaining > 0;

  const handlePurchaseAttempt = useCallback(async () => {
    if (!canPurchaseAttempt) {
      return;
    }

    onError(null);
    setIsPurchasing(true);

    try {
      const response = await fetch(purchaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
        cache: 'no-store',
      });

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось купить дополнительную попытку'),
        );
      }

      const payload = raw as PurchaseApiResponse;
      onBalanceChange(payload.data.balanceAfter);
      setPurchasedAttemptsAvailable(payload.data.purchasedAttemptsAvailable);
      setDailyAttemptPurchasesUsed(payload.data.dailyAttemptPurchasesUsed);
      invalidateProfileCache();
    } catch (purchaseError) {
      onError(
        purchaseError instanceof Error
          ? purchaseError.message
          : 'Не удалось купить дополнительную попытку',
      );
    } finally {
      setIsPurchasing(false);
    }
  }, [
    canPurchaseAttempt,
    difficulty,
    onBalanceChange,
    onError,
    purchaseUrl,
  ]);

  return {
    purchasedAttemptsAvailable,
    setPurchasedAttemptsAvailable,
    dailyAttemptPurchasesUsed,
    dailyAttemptPurchasesRemaining,
    maxDailyAttemptPurchases: MAX_DAILY_ATTEMPT_PURCHASES,
    isPurchasing,
    canAffordPurchase,
    canPurchaseAttempt,
    hasAttemptSlot,
    handlePurchaseAttempt,
    extraAttemptCost,
  };
}
