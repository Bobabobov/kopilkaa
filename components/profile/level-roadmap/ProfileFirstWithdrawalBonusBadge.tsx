'use client';

import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FIRST_WITHDRAWAL_BONUS_AMOUNT } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';

interface ProfileFirstWithdrawalBonusBadgeProps {
  className?: string;
}

export function ProfileFirstWithdrawalBonusBadge({
  className,
}: ProfileFirstWithdrawalBonusBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[#f9bc60]/35 bg-[#f9bc60]/12 px-2.5 py-1 text-[11px] font-semibold text-[#f9bc60]',
        className,
      )}
    >
      <Gift className="h-3.5 w-3.5" aria-hidden />
      Подарок +{FIRST_WITHDRAWAL_BONUS_AMOUNT} бон. за первый вывод
    </div>
  );
}
