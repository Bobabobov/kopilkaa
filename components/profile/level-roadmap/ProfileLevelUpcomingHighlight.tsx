'use client';

import { ArrowUpRight, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileLevelUpcomingHighlightProps {
  text: string;
  className?: string;
}

export function ProfileLevelUpcomingHighlight({
  text,
  className,
}: ProfileLevelUpcomingHighlightProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-950/40 px-3.5 py-3',
        className,
      )}
    >
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400"
        aria-hidden
      >
        <Wallet className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          Дальше по пути
        </p>
        <p className="mt-1 text-sm font-medium text-[#fffffe]">{text}</p>
      </div>
    </div>
  );
}
