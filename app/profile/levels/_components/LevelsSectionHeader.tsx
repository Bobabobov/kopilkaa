'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LevelsSectionHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
  className?: string;
  aside?: ReactNode;
}

export function LevelsSectionHeader({
  kicker,
  title,
  subtitle,
  className,
  aside,
}: LevelsSectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-[#f9bc60]/50">
          {kicker}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#fffffe] sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#abd1c6]/60">
            {subtitle}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
