import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "./donationUtils";
import type { DonationsStats } from "./hooks/useOtherUserDonations";

interface DonationsHeaderProps {
  stats: DonationsStats;
}

export function DonationsHeader({ stats }: DonationsHeaderProps) {
  return (
    <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10 bg-gradient-to-r from-[#001e1d]/30 to-transparent">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#f9bc60]/30"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <LucideIcons.CreditCard className="text-[#001e1d]" size="sm" />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[#fffffe] truncate bg-gradient-to-r from-[#fffffe] to-[#f9bc60] bg-clip-text text-transparent">
              Оплаты
            </h3>
            <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5 font-medium">
              Всего: <span className="text-[#f9bc60] font-bold">{formatAmount(stats.totalDonated)}</span>
            </p>
          </div>
        </div>
        <motion.div
          className="text-right flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-[#f9bc60] to-[#e8a545] bg-clip-text text-transparent">
            {stats.donationsCount}
          </div>
          <div className="text-[10px] sm:text-xs text-[#abd1c6] font-medium">платежей</div>
        </motion.div>
      </div>
    </div>
  );
}
