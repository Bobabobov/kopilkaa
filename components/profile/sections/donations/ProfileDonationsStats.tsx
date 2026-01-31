import { formatRub } from "@/lib/format";

interface ProfileDonationsStatsProps {
  totalDonated: number;
  donationsCount: number;
}

export function ProfileDonationsStats({
  totalDonated,
  donationsCount,
}: ProfileDonationsStatsProps) {
  return (
    <div className="p-4 xs:p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10 bg-[#001e1d]/20">
      <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4">
        <div className="text-center p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10">
          <div
            className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[#f9bc60] mb-0.5 xs:mb-1 truncate max-w-full tabular-nums"
            title={formatRub(totalDonated)}
          >
            {formatRub(totalDonated)}
          </div>
          <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6] leading-tight">
            Всего оплачено
          </div>
        </div>
        <div className="text-center p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10">
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#abd1c6] mb-0.5 xs:mb-1">
            {donationsCount}
          </div>
          <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6] leading-tight">
            Количество
          </div>
        </div>
      </div>
    </div>
  );
}
