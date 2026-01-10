import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount, formatDonationDate, formatServiceLabel } from "./donationUtils";
import type { Donation } from "./hooks/useOtherUserDonations";

interface DonationItemProps {
  donation: Donation;
  index: number;
}

export function DonationItem({ donation, index }: DonationItemProps) {
  const serviceLabel = formatServiceLabel(donation.comment);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20 hover:border-[#f9bc60]/50 transition-all hover:shadow-lg hover:shadow-[#f9bc60]/20"
      whileHover={{ scale: 1.02, x: 5 }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <motion.div
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#f9bc60]/30 to-[#e8a545]/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
          whileHover={{ rotate: 15, scale: 1.1 }}
        >
          <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-base font-semibold text-[#fffffe]">{formatAmount(donation.amount)}</div>
          {serviceLabel && (
            <div className="text-xs sm:text-sm text-[#abd1c6] truncate mt-0.5">{serviceLabel}</div>
          )}
          <div className="text-[10px] sm:text-xs text-[#abd1c6]/60 mt-1">{formatDonationDate(donation.createdAt)}</div>
        </div>
      </div>
    </motion.div>
  );
}
