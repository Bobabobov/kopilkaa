'use client';

import { ArrowDownToLine, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LevelMilestoneEducation } from '@/lib/level-config';

interface ProfileLevelEducationBlockProps {
  education: LevelMilestoneEducation;
  className?: string;
}

export function ProfileLevelEducationBlock({
  education,
  className,
}: ProfileLevelEducationBlockProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a1b2]">
        {education.title}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {education.items.map((item, index) => {
          const Icon = index === 0 ? TrendingUp : ArrowDownToLine;
          const accent =
            index === 0
              ? 'border-emerald-500/20 bg-emerald-950/35 text-emerald-300'
              : 'border-[#f9bc60]/20 bg-[#f9bc60]/8 text-[#f9bc60]';

          return (
            <div
              key={item.label}
              className={cn('rounded-xl border px-3 py-3', accent)}
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {item.label}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#abd1c6]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
