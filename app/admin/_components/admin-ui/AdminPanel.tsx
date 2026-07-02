import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  accent?: 'gold' | 'neutral';
}

export function AdminPanel({
  title,
  subtitle,
  children,
  className,
  headerClassName,
  accent = 'gold',
}: AdminPanelProps) {
  const border =
    accent === 'gold'
      ? 'border-[#f9bc60]/30'
      : 'border-[#abd1c6]/20';
  const headerBg =
    accent === 'gold'
      ? 'border-[#f9bc60]/20 bg-[#f9bc60]/10'
      : 'border-[#abd1c6]/15 bg-white/5';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-[#004643]/90 to-[#001e1d]/95 shadow-lg shadow-black/15',
        border,
        className,
      )}
    >
      <div className={cn('border-b px-4 py-3', headerBg, headerClassName)}>
        <h2 className="text-base font-bold text-[#fffffe] sm:text-lg">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[#abd1c6]/80">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
