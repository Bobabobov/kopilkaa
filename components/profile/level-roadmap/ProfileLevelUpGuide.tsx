'use client';

import Link from 'next/link';
import { ArrowRight, Lightbulb, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAmount, formatExperience } from '@/lib/format';
import {
  BONUS_LEVEL_LABEL,
  bonusesToDisplayExperience,
  displayExperienceToBonusesNeeded,
} from '@/lib/userLevel/economy';
import { MAX_ACTIVE_PROFILE_LEVEL } from '@/lib/level-config';
import type { UserLevelProgress } from '@/lib/userLevel';

interface ProfileLevelUpGuideProps {
  userLevel: UserLevelProgress;
  availableBonuses?: number;
  className?: string;
}

const LEVEL_UP_STEPS = [
  {
    title: 'Заработайте бонусы',
    description:
      'Добрые дела, ежедневный бонус, сундук и игры',
  },
  {
    title: 'Вложите в опыт',
  },
] as const;

export function ProfileLevelUpGuide({
  userLevel,
  availableBonuses = 0,
  className,
}: ProfileLevelUpGuideProps) {
  const { xpToNextLevel, nextLevel, level } = userLevel;
  const bonusesNeeded = displayExperienceToBonusesNeeded(xpToNextLevel);
  const investableXp = bonusesToDisplayExperience(availableBonuses);
  const hasBonuses = availableBonuses > 0;
  const isMaxActiveLevel = level >= MAX_ACTIVE_PROFILE_LEVEL;

  return (
    <div
      className={cn(
        'rounded-xl border border-emerald-500/15 bg-emerald-950/25 px-3.5 py-3 sm:px-4',
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400"
          aria-hidden
        >
          <Lightbulb className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Как повысить уровень
          </p>

          <ol className="mt-2.5 space-y-2">
            {LEVEL_UP_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-2 text-xs leading-snug text-zinc-300 sm:text-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-950/60 text-[10px] font-bold text-emerald-400">
                  {index + 1}
                </span>
                <span>
                  <span className="font-medium text-zinc-100">{step.title}</span>
                  {' — '}
                  {'description' in step ? (
                    step.description
                  ) : (
                    <>
                      В блоке «Баланс бонусов»{' '}
                      <span className="lg:hidden">сверху</span>
                      <span className="hidden lg:inline">справа</span>
                      {` — ${BONUS_LEVEL_LABEL}`}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ol>

          {isMaxActiveLevel && (
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Сейчас доступны уровни 1–{MAX_ACTIVE_PROFILE_LEVEL}. Опыт можно
              копить — следующие вехи появятся позже.
            </p>
          )}

          {xpToNextLevel > 0 && (
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-zinc-400">
              <TrendingUp
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                aria-hidden
              />
              <span>
                До уровня {nextLevel}: ещё{' '}
                <span className="font-medium text-zinc-200">
                  {formatExperience(xpToNextLevel)} опыта
                </span>
                {bonusesNeeded > 0 && (
                  <>
                    {' '}
                    (~{formatAmount(bonusesNeeded)} бонусов при вложении)
                  </>
                )}
              </span>
            </p>
          )}

          {hasBonuses && (
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-emerald-300/90">
              <Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                На балансе {formatAmount(availableBonuses)} бонусов — это{' '}
                <span className="font-medium text-emerald-200">
                  +{formatExperience(investableXp)} опыта
                </span>
                , если вложить сейчас.{' '}
                <Link
                  href="#profile-wallet"
                  className="inline-flex items-center gap-0.5 font-semibold text-emerald-300 underline-offset-2 hover:underline"
                >
                  Вложить
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
