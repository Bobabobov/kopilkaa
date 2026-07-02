'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatAmount } from '@/lib/format';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import type { FirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import {
  formatFirstWithdrawalBonusClaimHint,
  formatFirstWithdrawalBonusTeaserHint,
} from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';

interface ProfileFirstWithdrawalBonusClaimProps {
  bonus: FirstWithdrawalBonusStatus;
  className?: string;
  onClaimed?: () => void;
}

export function ProfileFirstWithdrawalBonusClaim({
  bonus,
  className,
  onClaimed,
}: ProfileFirstWithdrawalBonusClaimProps) {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (bonus.claimed || (!bonus.claimable && !bonus.promised)) {
    return null;
  }

  const handleClaim = async () => {
    if (!bonus.claimable || claiming) return;
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/bonuses/first-withdrawal-reward', {
        method: 'POST',
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(json, 'Не удалось забрать подарок'),
        );
      }
      invalidateProfileCache();
      onClaimed?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось забрать подарок');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-[#f9bc60]/25 bg-gradient-to-br from-[#f9bc60]/10 via-transparent to-transparent px-3.5 py-3',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f9bc60]">
            <Gift className="h-4 w-4 shrink-0" aria-hidden />
            Подарок за первый вывод
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-[#fffffe]">
            +{formatAmount(bonus.amount)} бон.
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#abd1c6]">
            {bonus.claimable
              ? formatFirstWithdrawalBonusClaimHint()
              : formatFirstWithdrawalBonusTeaserHint()}
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-300" role="alert">
              {error}
            </p>
          )}
        </div>
        {bonus.claimable && (
          <Button
            type="button"
            disabled={claiming}
            onClick={() => void handleClaim()}
            className="h-9 shrink-0 rounded-xl bg-[#f9bc60] px-4 text-xs font-semibold text-[#001e1d] hover:bg-[#ffd089] disabled:opacity-50"
          >
            {claiming ? '…' : 'Забрать'}
          </Button>
        )}
      </div>
    </div>
  );
}
