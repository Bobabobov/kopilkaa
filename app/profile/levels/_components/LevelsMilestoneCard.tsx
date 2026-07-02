'use client';

import {
  ArrowDownToLine,
  Check,
  Coins,
  Construction,
  Gift,
  Lock,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import type { LevelMilestoneDetail } from '@/lib/level-config';
import { cn } from '@/lib/utils';

interface LevelsMilestoneCardProps {
  detail: LevelMilestoneDetail;
  currentLevel: number;
  isCurrent: boolean;
}

function perkIcon(perk: string) {
  if (perk.includes('Вывод') || perk.includes('вывод') || perk.includes('СБП')) {
    return Wallet;
  }
  if (perk.includes('бонус') || perk.startsWith('+') || perk.includes('Подарок')) {
    return Gift;
  }
  if (perk.includes('Публикация') || perk.includes('бесплатно')) {
    return Coins;
  }
  if (perk.includes('Лимит') || perk.includes('гонорар')) {
    return TrendingUp;
  }
  return Check;
}

function isHighlightPerk(perk: string): boolean {
  return (
    perk.includes('бесплатно') ||
    perk.includes('Вывод') ||
    perk.includes('Подарок') ||
    perk.startsWith('+')
  );
}

export function LevelsMilestoneCard({
  detail,
  currentLevel,
  isCurrent,
}: LevelsMilestoneCardProps) {
  const isUnlocked = currentLevel >= detail.level;

  return (
    <article className="relative flex h-full flex-col overflow-hidden">
      {/* Фоновая цифра уровня */}
      <span
        className="pointer-events-none absolute -right-4 -top-6 select-none text-[7rem] font-black leading-none text-white/[0.03] sm:text-[9rem]"
        aria-hidden
      >
        {detail.level}
      </span>

      {/* Шапка */}
      <div className="relative border-b border-white/[0.06] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
                Уровень {detail.level}
              </h3>
              {isCurrent ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#f9bc60]/15 px-2 py-0.5 text-xs font-medium text-[#f9bc60]">
                  <Sparkles className="h-3 w-3" />
                  Ваш уровень
                </span>
              ) : null}
              {!isUnlocked && !detail.inDevelopment ? (
                <span className="inline-flex items-center gap-1 text-xs text-[#abd1c6]/45">
                  <Lock className="h-3 w-3" />
                  Не открыт
                </span>
              ) : null}
              {detail.inDevelopment ? (
                <span className="inline-flex items-center gap-1 text-xs text-[#abd1c6]/45">
                  <Construction className="h-3 w-3" />
                  Скоро
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-base text-[#abd1c6]/80">{detail.headline}</p>
          </div>

          {!detail.inDevelopment && detail.maxApplicationAmount != null ? (
            <div className="text-right">
              <p className="text-xs text-[#abd1c6]/50">Лимит гонорара</p>
              <p className="text-2xl font-semibold tabular-nums text-[#f9bc60]">
                {detail.maxApplicationAmount} ₽
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Контент */}
      <div className="relative flex-1 space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <ul className="space-y-1">
          {detail.newPerks.map((perk) => {
            const Icon = perkIcon(perk);
            const highlight = isHighlightPerk(perk);

            return (
              <li
                key={perk}
                className={cn(
                  'flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  highlight && isUnlocked && 'bg-[#f9bc60]/[0.06]',
                  !highlight && 'hover:bg-white/[0.02]',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    highlight && isUnlocked
                      ? 'bg-[#f9bc60]/15 text-[#f9bc60]'
                      : isUnlocked
                        ? 'bg-white/[0.05] text-[#abd1c6]'
                        : 'bg-white/[0.03] text-[#abd1c6]/35',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p
                  className={cn(
                    'pt-1 text-sm leading-relaxed',
                    isUnlocked ? 'text-[#e8f0ed]' : 'text-[#abd1c6]/50',
                    highlight && isUnlocked && 'font-medium text-[#fffffe]',
                  )}
                >
                  {perk}
                </p>
              </li>
            );
          })}
        </ul>

        {detail.upcomingHighlight ? (
          <p className="rounded-xl bg-emerald-500/[0.08] px-4 py-3 text-sm text-emerald-300/90">
            {detail.upcomingHighlight}
          </p>
        ) : null}

        {detail.education ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {detail.education.items.map((item, index) => {
              const Icon = index === 0 ? TrendingUp : ArrowDownToLine;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#f9bc60]" aria-hidden />
                    <p className="text-sm font-medium text-[#fffffe]">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#abd1c6]/65">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}

        {detail.hints && detail.hints.length > 0 ? (
          <div className="border-t border-white/[0.06] pt-4">
            <p className="mb-2 text-xs font-medium text-[#abd1c6]/45">
              Советы для этого уровня
            </p>
            <ul className="space-y-1.5">
              {detail.hints.map((hint) => (
                <li
                  key={hint}
                  className="text-sm leading-relaxed text-[#abd1c6]/60"
                >
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
