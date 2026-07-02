'use client';

import Link from 'next/link';
import { ArrowRight, Check, Coins, Gift, Lightbulb, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAmount } from '@/lib/format';
import type { LevelMilestoneDetail } from '@/lib/level-config';

interface ProfileLevelOneQuestProps {
  quest: NonNullable<LevelMilestoneDetail['quest']>;
  availableBonuses: number;
  className?: string;
}

export function ProfileLevelOneQuest({
  quest,
  availableBonuses,
  className,
}: ProfileLevelOneQuestProps) {
  const progress = Math.min(
    100,
    Math.round((availableBonuses / quest.targetBonuses) * 100),
  );
  const isComplete = availableBonuses >= quest.targetBonuses;

  return (
    <div
      className={cn(
        'rounded-xl border border-[#f9bc60]/25 bg-gradient-to-br from-[#f9bc60]/10 via-transparent to-transparent px-3.5 py-3 sm:px-4',
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f9bc60]/15 text-[#f9bc60]"
          aria-hidden
        >
          {isComplete ? (
            <Check className="h-4 w-4" />
          ) : (
            <Target className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#f9bc60]">
            Мягкий квест · {quest.label}
          </p>
          <p className="mt-1 text-sm text-[#abd1c6]">{quest.description}</p>

          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/30"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Прогресс квеста: ${formatAmount(availableBonuses)} из ${quest.targetBonuses} бонусов`}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isComplete
                  ? 'bg-emerald-400'
                  : 'bg-gradient-to-r from-[#f9bc60] to-amber-300',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 font-mono text-xs text-zinc-300">
            <Coins className="mr-1 inline h-3.5 w-3.5 text-[#f9bc60]" aria-hidden />
            {formatAmount(availableBonuses)} / {quest.targetBonuses} бонусов
            {isComplete && (
              <span className="ml-2 text-emerald-400">Готово к 2-й истории</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProfileLevelHintsProps {
  hints: string[];
  className?: string;
}

export function ProfileLevelHints({ hints, className }: ProfileLevelHintsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#94a1b2]">
        <Lightbulb className="h-3.5 w-3.5 text-[#f9bc60]" aria-hidden />
        Как заработать первые бонусы
      </p>
      <ul className="space-y-2">
        {hints.map((hint) => (
          <li
            key={hint}
            className="flex items-start gap-2 text-xs leading-snug text-[#abd1c6] sm:text-sm"
          >
            <Gift className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden />
            <span>{hint}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          href="/good-deeds"
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-950/40 px-2.5 py-1.5 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-950/60"
        >
          Добрые дела
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 rounded-lg border border-[#f9bc60]/20 bg-[#f9bc60]/10 px-2.5 py-1.5 text-[11px] font-medium text-[#f9bc60] transition-colors hover:bg-[#f9bc60]/15"
        >
          Ежедневный сундук
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
