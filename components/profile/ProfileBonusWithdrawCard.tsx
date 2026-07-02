'use client';

import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatAmount } from '@/lib/format';
import {
  getMinWithdrawalBonuses,
  MIN_WITHDRAWAL_PROFILE_LEVEL,
} from '@/lib/bonusWithdrawals/constants';
import {
  bonusWithdrawalButtonLabel,
  canRequestBonusWithdrawal,
  isBonusWithdrawalLevelUnlocked,
} from '@/lib/bonusWithdrawals/eligibility';
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from '@/lib/admin/bonusWithdrawalBlock';
import { formatWithdrawalCommissionHint } from '@/lib/bonusWithdrawals/commission';

interface ProfileBonusWithdrawCardProps {
  profileLevel: number;
  availableBonuses: number;
  bonusesInvestedInExperience?: number;
  hasPendingWithdrawal?: boolean;
  withdrawalBlocked?: boolean;
  onWithdrawClick: () => void;
  className?: string;
}

export function ProfileBonusWithdrawCard({
  profileLevel,
  availableBonuses,
  bonusesInvestedInExperience = 0,
  hasPendingWithdrawal = false,
  withdrawalBlocked = false,
  onWithdrawClick,
  className,
}: ProfileBonusWithdrawCardProps) {
  if (!isBonusWithdrawalLevelUnlocked(profileLevel)) {
    return null;
  }

  const minBonuses = getMinWithdrawalBonuses(profileLevel);
  const gate = {
    profileLevel,
    availableBonuses,
    hasPendingWithdrawal,
    withdrawalBlocked,
  };
  const canWithdraw = canRequestBonusWithdrawal(gate);
  const buttonLabel = bonusWithdrawalButtonLabel(gate);

  return (
    <section
      id="profile-withdraw"
      className={cn(
        'mt-5 rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/50 via-emerald-950/25 to-transparent p-4',
        className,
      )}
      aria-label="Вывод гонорара"
    >
      <div>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-[#fffffe]">
          <Wallet className="h-4 w-4 text-emerald-400" aria-hidden />
          Вывод на СБП
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#94a1b2]">
          {formatWithdrawalCommissionHint(profileLevel)} Выводятся только бонусы на балансе — не
          вложенные в опыт
          {bonusesInvestedInExperience > 0 && (
            <>
              {' '}
              ({formatAmount(bonusesInvestedInExperience)} вложено).
            </>
          )}
          .
        </p>
      </div>

      <p className="mt-3 font-mono text-xs text-zinc-300">
        Доступно к выводу:{' '}
        <span className="font-semibold text-emerald-400">
          {formatAmount(availableBonuses)} бон.
        </span>
        <span className="mx-1.5 text-zinc-600">·</span>
        минимум {minBonuses} бон.
      </p>

      <Button
        type="button"
        disabled={!canWithdraw}
        onClick={onWithdrawClick}
        className="mt-4 h-10 w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 sm:w-auto sm:min-w-[12rem]"
      >
        {canWithdraw ? 'Вывести на СБП' : buttonLabel}
      </Button>

      {withdrawalBlocked && (
        <p className="mt-3 text-xs leading-relaxed text-red-300/90">
          {BONUS_WITHDRAWAL_BLOCKED_MESSAGE}
        </p>
      )}

      {hasPendingWithdrawal && !withdrawalBlocked && (
        <p className="mt-3 text-xs text-[#f9bc60]">
          Заявка на вывод уже на проверке — дождитесь решения администрации.
        </p>
      )}

      {!canWithdraw &&
        !withdrawalBlocked &&
        !hasPendingWithdrawal &&
        availableBonuses < minBonuses && (
          <p className="mt-3 text-xs text-[#94a1b2]">
            Накопите ещё {formatAmount(minBonuses - availableBonuses)} бонусов
            до минимума вывода на {MIN_WITHDRAWAL_PROFILE_LEVEL} уровне.
          </p>
        )}
    </section>
  );
}
