import { cn } from '@/lib/utils';

export type AdminFilterChip = {
  id: string;
  label: string;
  count?: number;
};

interface AdminFilterChipsProps {
  items: AdminFilterChip[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function AdminFilterChips({
  items,
  activeId,
  onChange,
  className,
}: AdminFilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'min-h-[40px] rounded-xl px-3 py-2 text-sm font-bold transition-all',
              active
                ? 'bg-[#f9bc60] text-[#001e1d] shadow-md shadow-[#f9bc60]/25'
                : 'border-2 border-[#abd1c6]/20 bg-[#001e1d]/50 text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#fffffe]',
            )}
          >
            {item.label}
            {item.count != null ? (
              <span
                className={cn(
                  'ml-1.5 tabular-nums',
                  active ? 'opacity-90' : 'opacity-60',
                )}
              >
                ({item.count})
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
