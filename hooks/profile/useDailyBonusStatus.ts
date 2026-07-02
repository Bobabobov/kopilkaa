'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { DAILY_BONUS_CLAIMED_EVENT } from '@/lib/dailyBonus/events';
import type { DailyBonusStatus } from '@/lib/dailyBonus/streakLogic';

type DailyBonusResponse = {
  success: boolean;
  data: DailyBonusStatus;
};

export function useDailyBonusStatus() {
  const [data, setData] = useState<DailyBonusStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/profile/daily-bonus', {
        method: 'GET',
        cache: 'no-store',
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось загрузить ежедневный бонус'),
        );
      }
      setData((raw as DailyBonusResponse).data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const onClaimed = () => {
      void fetchStatus();
    };
    window.addEventListener(DAILY_BONUS_CLAIMED_EVENT, onClaimed);
    return () => window.removeEventListener(DAILY_BONUS_CLAIMED_EVENT, onClaimed);
  }, [fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
}
