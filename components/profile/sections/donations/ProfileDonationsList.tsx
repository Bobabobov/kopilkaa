import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatRelativeDate } from "@/lib/time";
import { formatRub } from "@/lib/format";
import type { Donation } from "./types";

interface ProfileDonationsListProps {
  donations: Donation[];
}

function formatServiceLabel(comment?: string | null) {
  if (!comment) return null;
  const v = comment.trim();
  if (!v) return null;
  if (v === "heroes_placement") return "Размещение в «Героях»";
  return v;
}

export function ProfileDonationsList({ donations }: ProfileDonationsListProps) {
  if (donations.length === 0) {
    return null;
  }

  return (
    <div className="p-4 xs:p-4 sm:p-5 md:p-6 space-y-2 xs:space-y-2.5 sm:space-y-3">
      {donations.slice(0, 3).map((donation, index) => (
        <motion.div
          key={donation.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-colors"
        >
          <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs xs:text-sm sm:text-base font-semibold text-[#fffffe]">
                {formatRub(donation.amount)}
              </div>
              {formatServiceLabel(donation.comment) && (
                <div className="text-[10px] xs:text-xs sm:text-sm text-[#abd1c6] truncate mt-0.5">
                  {formatServiceLabel(donation.comment)}
                </div>
              )}
              <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6]/60 mt-0.5 xs:mt-1">
                {formatRelativeDate(donation.createdAt)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
