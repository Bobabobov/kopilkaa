'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LEVEL_EXCHANGE_LABEL,
  LEVEL_BENEFIT_HINT,
} from '@/lib/userLevel/economy';
import { formatAmount } from '@/lib/format';
import type { GoodDeedsResponse } from '../types';

type LevelStats = Pick<
  GoodDeedsResponse['stats'],
  'totalEarnedBonuses' | 'bonusesInLevel' | 'withdrawnBonuses'
>;

type Props = {
  stats: LevelStats;
  level?: number;
  className?: string;
};

export function GoodDeedsLevelSection({ stats, level, className }: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/12 bg-[#001e1d]/55 px-4 py-3 backdrop-blur-md ${className ?? ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#abd1c6]/80">
            В уровне профиля
          </p>
          <p className="mt-0.5 text-2xl font-black tabular-nums leading-none text-[#fffffe]">
            {formatAmount(stats.bonusesInLevel)}
            <span className="ml-1.5 text-sm font-semibold text-[#abd1c6]">
              опыта
            </span>
          </p>
          {level != null ? (
            <p className="mt-1 text-xs font-medium text-[#f9bc60]">
              Уровень {level}
            </p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10">
          <Sparkles className="h-4 w-4 text-[#f9bc60]" aria-hidden />
        </div>
      </div>

      <p className="mt-2 text-[11px] font-medium leading-snug text-[#abd1c6]">
        {LEVEL_EXCHANGE_LABEL}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-[#94a1b2]">
        {LEVEL_BENEFIT_HINT}
      </p>

      {stats.withdrawnBonuses > 0 ? (
        <p className="mt-1 text-[11px] text-[#94a1b2]">
          Ранее выведено: {formatAmount(stats.withdrawnBonuses)} бонусов
        </p>
      ) : null}

      <Button
        asChild
        size="sm"
        variant="outline"
        className="mt-3 h-9 w-full rounded-xl border-white/15 text-[#abd1c6] hover:bg-white/5"
      >
        <Link href="/profile">Открыть уровень в профиле</Link>
      </Button>
    </div>
  );
}
