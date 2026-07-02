import { cn } from '@/lib/utils';

export type AdminStatusTone = 'pending' | 'success' | 'danger' | 'muted' | 'info';

const STYLES: Record<AdminStatusTone, string> = {
  pending: 'border-[#f9bc60]/50 bg-[#f9bc60]/15 text-[#ffd89a]',
  success: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200',
  danger: 'border-rose-400/50 bg-rose-500/15 text-rose-200',
  muted: 'border-[#abd1c6]/30 bg-[#abd1c6]/10 text-[#abd1c6]',
  info: 'border-sky-400/40 bg-sky-500/10 text-sky-200',
};

interface AdminStatusPillProps {
  children: React.ReactNode;
  tone?: AdminStatusTone;
  className?: string;
}

export function AdminStatusPill({
  children,
  tone = 'muted',
  className,
}: AdminStatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider',
        STYLES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
