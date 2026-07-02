'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';
import type { ToastType } from '@/components/ui/BeautifulToast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BonusWithdrawModal } from '@/components/profile/BonusWithdrawModal';
import {
  bonusWithdrawalButtonLabel,
  bonusWithdrawalLevelMessage,
  canRequestBonusWithdrawal,
  isBonusWithdrawalLevelUnlocked,
} from '@/lib/bonusWithdrawals/eligibility';
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from '@/lib/admin/bonusWithdrawalBlock';
import type { GoodDeedsResponse } from '../types';

type Stats = Pick<
  GoodDeedsResponse['stats'],
  | 'totalEarnedBonuses'
  | 'availableBonuses'
  | 'pendingWithdrawalBonuses'
  | 'withdrawnBonuses'
  | 'hasPendingWithdrawal'
  | 'withdrawalBlocked'
>;

type Props = {
  stats: Stats;
  profileLevel: number;
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => void;
  onSuccess?: () => void;
};

export function GoodDeedsWithdrawSection({
  stats,
  profileLevel,
  showToast,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  const gate = {
    profileLevel,
    availableBonuses: stats.availableBonuses,
    hasPendingWithdrawal: stats.hasPendingWithdrawal,
    withdrawalBlocked: stats.withdrawalBlocked,
  };

  const canOpen = canRequestBonusWithdrawal(gate);

  return (
    <>
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/[0.12] bg-[#001e1d]/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:min-w-[260px]">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/15 text-[#f9bc60]">
            <Wallet className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
              Бонусы
            </p>
            <p className="text-2xl font-bold tabular-nums text-[#fffffe]">
              {stats.availableBonuses}{' '}
              <span className="text-base font-semibold text-[#abd1c6]">
                доступно
              </span>
            </p>
            <p className="text-xs text-[#94a1b2]">
              Начислено всего:{' '}
              <span className="font-semibold text-[#abd1c6]">
                {stats.totalEarnedBonuses}
              </span>
              {stats.withdrawnBonuses > 0 && (
                <>
                  {' '}
                  · Выведено:{' '}
                  <span className="font-semibold text-[#abd1c6]">
                    {stats.withdrawnBonuses}
                  </span>
                </>
              )}
            </p>
            {stats.pendingWithdrawalBonuses > 0 && (
              <p className="text-xs text-amber-200/95">
                В запросе на вывод: {stats.pendingWithdrawalBonuses} бонусов
              </p>
            )}
          </div>
        </div>

        {stats.hasPendingWithdrawal && (
          <Badge className="w-fit border-amber-500/40 bg-amber-500/15 text-amber-100">
            Запрос на вывод гонорара на проверке
          </Badge>
        )}

        {stats.withdrawalBlocked && (
          <Badge className="w-fit border-rose-500/40 bg-rose-500/15 text-rose-100">
            {BONUS_WITHDRAWAL_BLOCKED_MESSAGE}
          </Badge>
        )}

        {!isBonusWithdrawalLevelUnlocked(profileLevel) && (
          <p className="text-xs text-[#94a1b2]">{bonusWithdrawalLevelMessage()}</p>
        )}

        <Button
          type="button"
          disabled={!canOpen}
          onClick={() => setOpen(true)}
          className="h-11 w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] shadow-lg shadow-[#f9bc60]/15 hover:bg-[#f7b24a] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {bonusWithdrawalButtonLabel(gate)}
        </Button>
      </div>

      <BonusWithdrawModal
        open={open}
        onClose={() => setOpen(false)}
        profileLevel={profileLevel}
        availableBonuses={stats.availableBonuses}
        hasPendingWithdrawal={stats.hasPendingWithdrawal}
        withdrawalBlocked={stats.withdrawalBlocked}
        showToast={showToast}
        onSuccess={onSuccess}
      />
    </>
  );
}
