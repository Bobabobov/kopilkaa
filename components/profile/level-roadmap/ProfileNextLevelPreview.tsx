'use client';

import { ArrowUpRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getMaxApplicationAmount,
  getNextLevelMilestonePreview,
} from '@/lib/level-config';

interface ProfileNextLevelPreviewProps {
  currentLevel: number;
  className?: string;
}

export function ProfileNextLevelPreview({
  currentLevel,
  className,
}: ProfileNextLevelPreviewProps) {
  const preview = getNextLevelMilestonePreview(currentLevel);

  if (!preview) {
    return (
      <div
        className={cn(
          'rounded-xl border border-white/10 bg-black/20 px-3.5 py-3 text-xs text-[#94a1b2] sm:px-4 sm:text-sm',
          className,
        )}
      >
        Вы на максимальном активном уровне (5). Следующие вехи — в разработке.
      </div>
    );
  }

  const { nextLevel, detail } = preview;
  const currentLimit = getMaxApplicationAmount(currentLevel);
  const perkPreview = detail.newPerks.slice(0, 3);

  return (
    <div
      className={cn(
        'rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 via-emerald-950/30 to-transparent px-3.5 py-3 sm:px-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            До уровня {nextLevel}
          </p>
          <p className="mt-1 text-sm font-medium text-[#fffffe]">
            {detail.headline}
          </p>
          <p className="mt-1 text-xs text-[#94a1b2]">
            Сейчас: до {currentLimit} ₽
            {detail.maxApplicationAmount != null && (
              <>
                {' '}
                → до {detail.maxApplicationAmount} ₽
              </>
            )}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-black/25 px-2 py-1 text-[10px] text-[#94a1b2]">
          <Lock className="h-3 w-3" aria-hidden />
          Ур. {nextLevel}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {perkPreview.map((perk) => (
          <li
            key={perk}
            className="text-xs leading-snug text-[#abd1c6] sm:text-sm"
          >
            · {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}
