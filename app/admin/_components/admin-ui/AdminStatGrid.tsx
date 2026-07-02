import { cn } from '@/lib/utils';

export type AdminStatItem = {
  label: string;
  value: number | string;
  tone?: 'default' | 'pending' | 'success' | 'danger';
  highlight?: boolean;
};

const TONE_CLASS: Record<
  NonNullable<AdminStatItem['tone']>,
  { border: string; bg: string; value: string }
> = {
  default: {
    border: 'border-[#abd1c6]/25',
    bg: 'bg-[#abd1c6]/5',
    value: 'text-[#fffffe]',
  },
  pending: {
    border: 'border-[#f9bc60]/35',
    bg: 'bg-[#f9bc60]/10',
    value: 'text-[#f9bc60]',
  },
  success: {
    border: 'border-emerald-400/35',
    bg: 'bg-emerald-500/10',
    value: 'text-[#10B981]',
  },
  danger: {
    border: 'border-rose-400/35',
    bg: 'bg-rose-500/10',
    value: 'text-[#e16162]',
  },
};

interface AdminStatGridProps {
  items: AdminStatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function AdminStatGrid({
  items,
  className,
  columns = 4,
}: AdminStatGridProps) {
  const colClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
        ? 'grid-cols-2 sm:grid-cols-3'
        : 'grid-cols-2 md:grid-cols-4';

  return (
    <div className={cn('grid gap-3', colClass, className)}>
      {items.map((item) => {
        const tone = item.tone ?? 'default';
        const t = TONE_CLASS[tone];
        return (
          <div
            key={item.label}
            className={cn(
              'rounded-xl border-2 p-3 sm:p-4',
              t.border,
              t.bg,
              item.highlight && 'ring-1 ring-[#f9bc60]/30',
            )}
          >
            <p className={cn('text-2xl font-black tabular-nums', t.value)}>
              {item.value}
            </p>
            <p className="mt-1 text-xs font-medium text-[#abd1c6]/85">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
