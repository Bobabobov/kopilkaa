import { cn } from '@/lib/utils';

export type AdminTabItem = {
  id: string;
  label: string;
  badge?: number | null;
};

interface AdminTabBarProps {
  tabs: AdminTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function AdminTabBar({
  tabs,
  activeId,
  onChange,
  className,
}: AdminTabBarProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'rounded-xl px-4 py-2.5 text-sm font-bold transition-all',
              active
                ? 'bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/30'
                : 'border-2 border-[#abd1c6]/20 bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#001e1d]/80 hover:text-[#fffffe]',
            )}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 ? (
              <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
