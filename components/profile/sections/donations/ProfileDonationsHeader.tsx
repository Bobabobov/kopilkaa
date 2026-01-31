import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatRub } from "@/lib/format";

interface ProfileDonationsHeaderProps {
  totalDonated: number;
  donationsCount: number;
}

export function ProfileDonationsHeader({
  totalDonated,
  donationsCount,
}: ProfileDonationsHeaderProps) {
  return (
    <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">
              Мои оплаты
            </h3>
            <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5">
              Всего: {formatRub(totalDonated)}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg sm:text-xl font-bold text-[#f9bc60]">
            {donationsCount}
          </div>
          <div className="text-[10px] sm:text-xs text-[#abd1c6]">платежей</div>
        </div>
      </div>
    </div>
  );
}
