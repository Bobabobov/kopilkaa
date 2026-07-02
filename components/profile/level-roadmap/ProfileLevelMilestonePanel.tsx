'use client';

import {
  Check,
  Clock,
  Coins,
  Lock,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LevelMilestoneDetail } from '@/lib/level-config';
import type { FirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { emptyFirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import {
  ProfileLevelHints,
  ProfileLevelOneQuest,
} from './ProfileLevelOneQuest';
import { ProfileLevelUpcomingHighlight } from './ProfileLevelUpcomingHighlight';
import { ProfileLevelEducationBlock } from './ProfileLevelEducationBlock';
import { ProfileFirstWithdrawalBonusClaim } from './ProfileFirstWithdrawalBonusClaim';

function perkIcon(perk: string) {
  if (perk.includes('бесплатно')) return Sparkles;
  if (perk.includes('Вывод') || perk.includes('вывод') || perk.includes('СБП'))
    return Wallet;
  if (perk.includes('бонусов') || perk.includes('бон.') || perk.includes('Скидка') || perk.startsWith('+'))
    return Coins;
  if (perk.includes('Интервал') || perk.includes('суток')) return Clock;
  if (perk.includes('Желаемая') || perk.includes('Желаемый')) return Sparkles;
  return Check;
}

interface ProfileLevelMilestonePanelProps {
  detail: LevelMilestoneDetail;
  currentLevel: number;
  availableBonuses?: number;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  onBonusClaimed?: () => void;
  mode?: 'profile' | 'guide';
  className?: string;
}

export function ProfileLevelMilestonePanel({
  detail,
  currentLevel,
  availableBonuses = 0,
  firstWithdrawalBonus = emptyFirstWithdrawalBonusStatus(),
  onBonusClaimed,
  mode = 'profile',
  className,
}: ProfileLevelMilestonePanelProps) {
  const isGuide = mode === 'guide';
  const isCurrent = currentLevel === detail.level;
  const isUnlocked = isGuide || currentLevel >= detail.level;
  const showLevelOneExtras =
    detail.level === 1 &&
    (isGuide || currentLevel <= 1) &&
    (detail.hints?.length || detail.quest);
  const showLevelTwoHighlight =
    detail.level === 2 &&
    detail.upcomingHighlight != null &&
    (isGuide || (currentLevel >= 2 && currentLevel < 3));
  const showLevelThreeExtras =
    detail.level === 3 &&
    detail.education != null &&
    (isGuide || (currentLevel >= 3 && currentLevel < 4));
  const showLevelThreeActions =
    !isGuide && currentLevel >= 3 && currentLevel < 4;

  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border transition-colors',
        isCurrent &&
          'border-[#f9bc60]/45 bg-gradient-to-br from-[#f9bc60]/14 via-[#f9bc60]/6 to-transparent shadow-[0_8px_28px_rgba(249,188,96,0.12)]',
        !isCurrent &&
          isUnlocked &&
          !detail.inDevelopment &&
          'border-[#abd1c6]/22 bg-[#abd1c6]/[0.06]',
        !isUnlocked && 'border-white/[0.06] bg-black/15',
        detail.inDevelopment &&
          !isCurrent &&
          'border border-dashed border-white/12 bg-white/[0.02]',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/[0.06] px-3.5 py-3 sm:px-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={cn(
                'text-sm font-semibold sm:text-base',
                isCurrent ? 'text-[#fffffe]' : 'text-[#abd1c6]',
              )}
            >
              Уровень {detail.level}
            </h4>
            {isCurrent && (
              <span className="rounded-full border border-[#f9bc60]/40 bg-[#f9bc60]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#f9bc60]">
                Ваш уровень
              </span>
            )}
            {!isUnlocked && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] text-[#94a1b2]">
                <Lock className="h-3 w-3" aria-hidden />
                Закрыто
              </span>
            )}
          </div>
          <p
            className={cn(
              'mt-0.5 text-xs',
              isCurrent ? 'text-[#f9bc60]/90' : 'text-[#94a1b2]',
            )}
          >
            {detail.headline}
          </p>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-xl px-2.5 py-1 text-xs font-semibold tabular-nums',
            detail.inDevelopment
              ? 'border border-dashed border-white/15 text-[#94a1b2]'
              : isCurrent
                ? 'border border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60]'
                : 'border border-white/10 bg-black/20 text-[#fffffe]',
          )}
        >
          {detail.inDevelopment
            ? 'скоро'
            : detail.maxApplicationAmount != null
              ? `до ${detail.maxApplicationAmount} ₽`
              : '—'}
        </span>
      </div>

      <div className="space-y-4 px-3.5 py-3 sm:px-4 sm:py-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94a1b2]">
            {isUnlocked ? 'На этом уровне' : 'Откроется'}
          </p>
          <ul className="space-y-2">
            {detail.newPerks.map((perk) => {
              const Icon = perkIcon(perk);
              const isHighlight =
                perk.includes('бесплатно') ||
                perk.includes('Желаемая') ||
                perk.includes('Скидка') ||
                perk.includes('СБП') ||
                perk.includes('Подарок +') ||
                perk.startsWith('+');
              return (
                <li
                  key={perk}
                  className={cn(
                    'flex items-start gap-2.5 text-xs leading-snug sm:text-sm',
                    isUnlocked ? 'text-[#abd1c6]' : 'text-[#94a1b2]/75',
                    isHighlight && 'font-medium text-[#fffffe]',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md',
                      isHighlight || isCurrent
                        ? 'bg-[#f9bc60]/15 text-[#f9bc60]'
                        : 'bg-white/[0.06] text-[#abd1c6]/80',
                    )}
                    aria-hidden
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                  <span>{perk}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {showLevelOneExtras && detail.hints && detail.hints.length > 0 && (
          <ProfileLevelHints hints={detail.hints} />
        )}

        {showLevelOneExtras && detail.quest && (
          isGuide ? (
            <div className="rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/8 px-3 py-2.5">
              <p className="text-xs font-semibold text-[#f9bc60]">
                Квест: {detail.quest.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#abd1c6]">
                {detail.quest.description}
              </p>
            </div>
          ) : (
            <ProfileLevelOneQuest
              quest={detail.quest}
              availableBonuses={availableBonuses}
            />
          )
        )}

        {showLevelTwoHighlight && detail.upcomingHighlight && (
          <ProfileLevelUpcomingHighlight text={detail.upcomingHighlight} />
        )}

        {showLevelThreeExtras && detail.education && (
          <ProfileLevelEducationBlock education={detail.education} />
        )}

        {showLevelThreeActions && (
          <>
            <ProfileFirstWithdrawalBonusClaim
              bonus={firstWithdrawalBonus}
              onClaimed={onBonusClaimed}
            />
            <a
              href="#profile-withdraw"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-600/30"
            >
              Перейти к выводу в профиле
            </a>
          </>
        )}
      </div>
    </article>
  );
}
