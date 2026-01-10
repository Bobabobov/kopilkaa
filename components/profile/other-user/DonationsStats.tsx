import { motion } from "framer-motion";
import { formatAmount } from "./donationUtils";
import type { DonationsStats as DonationsStatsType } from "./hooks/useOtherUserDonations";

interface DonationsStatsProps {
  stats: DonationsStatsType;
}

export function DonationsStats({ stats }: DonationsStatsProps) {
  return (
    <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10 bg-gradient-to-br from-[#001e1d]/30 to-[#001e1d]/10">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          className="text-center p-4 sm:p-5 bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#f9bc60]/20 shadow-lg hover:shadow-xl hover:shadow-[#f9bc60]/20 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#f9bc60] to-[#e8a545] bg-clip-text text-transparent mb-2 truncate max-w-full tabular-nums"
            title={formatAmount(stats.totalDonated)}
          >
            {formatAmount(stats.totalDonated)}
          </div>
          <div className="text-[10px] sm:text-xs text-[#abd1c6] font-medium">Всего оплачено</div>
        </motion.div>
        <motion.div
          className="text-center p-4 sm:p-5 bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20 shadow-lg hover:shadow-xl transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl sm:text-3xl font-bold text-[#abd1c6] mb-2">{stats.donationsCount}</div>
          <div className="text-[10px] sm:text-xs text-[#abd1c6] font-medium">Количество</div>
        </motion.div>
      </div>
    </div>
  );
}
