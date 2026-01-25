import { LucideIcons } from "@/components/ui/LucideIcons";

interface PersonalStatCardProps {
  label: string;
  value: number | string;
  icon: keyof typeof LucideIcons;
  color?: string;
  hint?: string;
}

export function PersonalStatCard({
  label,
  value,
  icon,
  color = "#f9bc60",
  hint,
}: PersonalStatCardProps) {
  const Icon = LucideIcons[icon] || LucideIcons.Info;
  return (
    <div className="rounded-xl border border-[#abd1c6]/15 bg-[#001e1d]/30 p-3 sm:p-4 h-full overflow-hidden min-w-[170px] shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 min-w-0">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm text-[#abd1c6]/80 break-words whitespace-normal">
            {label}
          </div>
          <div className="text-lg sm:text-xl font-semibold text-[#fffffe] leading-tight break-words">
            {value}
          </div>
        </div>
      </div>
      {hint && (
        <div className="text-[11px] sm:text-xs text-[#abd1c6]/70 break-words">
          {hint}
        </div>
      )}
    </div>
  );
}
