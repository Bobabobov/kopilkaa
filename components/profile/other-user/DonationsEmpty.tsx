import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function DonationsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
    >
      <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">
              Оплаты
            </h3>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6 text-center py-8 sm:py-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <LucideIcons.CreditCard className="text-[#abd1c6]" size="xl" />
        </div>
        <p className="text-sm sm:text-base text-[#abd1c6] font-medium mb-1">
          Пока нет оплат
        </p>
        <p className="text-xs sm:text-sm text-[#abd1c6]/60 px-4">
          Пользователь ещё не оплачивал размещение профиля в «Героях»
        </p>
      </div>
    </motion.div>
  );
}
