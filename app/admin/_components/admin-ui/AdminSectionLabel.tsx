import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Accent = 'gold' | 'emerald' | 'rose' | 'sky';

const BAR: Record<Accent, string> = {
  gold: 'bg-[#f9bc60]',
  emerald: 'bg-[#10B981]',
  rose: 'bg-[#e16162]',
  sky: 'bg-sky-400',
};

interface AdminSectionLabelProps {
  children: ReactNode;
  accent?: Accent;
  className?: string;
}

export function AdminSectionLabel({
  children,
  accent = 'gold',
  className,
}: AdminSectionLabelProps) {
  return (
    <div className={cn('mb-2 flex items-center gap-2', className)}>
      <span className={cn('h-5 w-1 rounded-full', BAR[accent])} />
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#abd1c6]">
        {children}
      </h2>
    </div>
  );
}
