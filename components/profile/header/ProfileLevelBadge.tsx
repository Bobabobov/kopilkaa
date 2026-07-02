'use client';

import Link from 'next/link';
import { LevelProgressRing } from '@/components/profile/LevelProgressRing';
import { cn } from '@/lib/utils';
import {
  formatLevelBadgeAriaLabel,
  getLevelBadgeInfo,
} from '@/lib/userLevel/levelBadges';
import { LEVEL_BADGE_TEXT_CLASS } from '@/lib/userLevel/levelRingThemes';

interface ProfileLevelBadgeProps {
  level: number;
  className?: string;
  /** Ссылка на страницу уровней (только для своего профиля) */
  href?: string;
}

export function ProfileLevelBadge({
  level,
  className,
  href,
}: ProfileLevelBadgeProps) {
  const badge = getLevelBadgeInfo(level);

  const content = (
    <div
      className={cn('flex flex-col items-center gap-1', className)}
      title={`${badge.label} — ${badge.title}`}
      aria-label={formatLevelBadgeAriaLabel(badge)}
    >
      <LevelProgressRing
        level={badge.level}
        progressPercent={100}
        size="badge"
        showPercent={false}
        showLevelPrefix={false}
        displayMode="emblem"
        tierLevel={badge.tierLevel}
        ariaLabel={formatLevelBadgeAriaLabel(badge)}
      />

      <span
        className={cn(
          'max-w-[6.5rem] truncate text-center text-[11px] font-semibold leading-tight [text-shadow:0_1px_8px_rgba(0,0,0,0.95)] sm:max-w-[7.5rem] sm:text-xs',
          LEVEL_BADGE_TEXT_CLASS,
        )}
      >
        {badge.label}
      </span>

      {badge.inDevelopment ? (
        <span className="text-[9px] font-medium uppercase tracking-wide text-[#f9bc60]/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
          скоро
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
