import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";

interface StoriesSummaryBannerProps {
  totalPaid: number;
}

export function StoriesSummaryBanner({ totalPaid }: StoriesSummaryBannerProps) {
  return (
    <div className="container mx-auto px-4 pb-6 flex justify-center">
      <div className="relative overflow-hidden rounded-2xl border border-[#f9bc60]/45 bg-gradient-to-r from-[#f9bc60]/20 via-[#f9bc60]/10 to-[#abd1c6]/10 px-5 py-3 text-sm font-semibold text-[#f9bc60] shadow-[0_18px_36px_-20px_rgba(249,188,96,0.7)] backdrop-blur-md">
        <div className="absolute -top-6 -right-8 h-16 w-16 rounded-full bg-[#f9bc60]/25 blur-2xl" />
        <div className="absolute -bottom-8 -left-10 h-20 w-20 rounded-full bg-[#abd1c6]/20 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#f9bc60]/50 to-[#e8a545]/30 text-[#001e1d] shadow-inner">
            <LucideIcons.Ruble size="sm" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-wide text-[#dceee6]/80">
              Проект помог на сумму
            </span>
            <span className="text-lg sm:text-xl font-black text-[#f9bc60]">
              {formatAmount(totalPaid)} ₽
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
