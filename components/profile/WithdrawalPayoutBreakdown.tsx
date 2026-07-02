'use client';

import { cn } from '@/lib/utils';
import {
  calculateWithdrawalPayout,
  getWithdrawalCommissionPercent,
} from '@/lib/bonusWithdrawals/commission';
import { formatAmount } from '@/lib/format';

interface WithdrawalPayoutBreakdownProps {
  amountBonuses: number;
  profileLevel: number;
  variant?: 'user' | 'admin';
  className?: string;
}

export function WithdrawalPayoutBreakdown({
  amountBonuses,
  profileLevel,
  variant = 'user',
  className,
}: WithdrawalPayoutBreakdownProps) {
  const breakdown = calculateWithdrawalPayout(amountBonuses, profileLevel);
  const commissionPercent = getWithdrawalCommissionPercent(profileLevel);

  if (breakdown.amountBonuses <= 0) {
    return null;
  }

  const isAdmin = variant === 'admin';

  return (
    <div
      className={cn(
        'rounded-xl border px-3.5 py-3 text-sm',
        isAdmin
          ? 'border-emerald-500/30 bg-emerald-950/35'
          : 'border-[#abd1c6]/20 bg-black/20',
        className,
      )}
    >
      <p
        className={cn(
          'text-[11px] font-semibold uppercase tracking-wide',
          isAdmin ? 'text-emerald-300' : 'text-[#94a1b2]',
        )}
      >
        {isAdmin ? 'К переводу на СБП' : 'Расчёт выплаты'}
      </p>

      <dl className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <dt className={isAdmin ? 'text-[#abd1c6]' : 'text-[#94a1b2]'}>
            Списание с баланса
          </dt>
          <dd className="font-semibold tabular-nums text-[#fffffe]">
            {formatAmount(breakdown.amountBonuses)} бон.
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className={isAdmin ? 'text-[#abd1c6]' : 'text-[#94a1b2]'}>
            Комиссия {commissionPercent}%
          </dt>
          <dd className="font-semibold tabular-nums text-rose-300">
            −{formatAmount(breakdown.commissionRubles)} ₽
          </dd>
        </div>
        <div
          className={cn(
            'flex items-center justify-between gap-3 border-t pt-2',
            isAdmin ? 'border-emerald-500/20' : 'border-white/10',
          )}
        >
          <dt className="font-medium text-[#fffffe]">
            {isAdmin ? 'Перевести пользователю' : 'Получите на СБП'}
          </dt>
          <dd
            className={cn(
              'text-lg font-black tabular-nums',
              isAdmin ? 'text-emerald-300' : 'text-[#f9bc60]',
            )}
          >
            {formatAmount(breakdown.payoutRubles)} ₽
          </dd>
        </div>
      </dl>
    </div>
  );
}
