import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function SupportSocialPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="mt-6 sm:mt-7 rounded-2xl sm:rounded-3xl border border-[#f9bc60]/40 bg-gradient-to-r from-[#f9bc60]/18 via-[#e16162]/10 to-transparent px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-center gap-2 md:gap-2">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#f9bc60]/25 flex items-center justify-center">
          <LucideIcons.Share className="text-[#f9bc60]" size="sm" />
        </div>
        <span className="md:hidden text-[10px] font-semibold tracking-[0.14em] uppercase text-[#f9bc60] bg-[#f9bc60]/10 px-2 py-0.5 rounded-full">
          Рекомендуем
        </span>
        <span className="hidden md:inline-block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#f9bc60] bg-[#f9bc60]/10 px-2 py-0.5 rounded-full">
          Рекомендуем
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-[#fffffe]">
          Привяжите соцсети — они будут видны в «Героях проекта»
        </p>
        <p className="text-xs sm:text-sm text-[#ffd499] mt-1">
          VK, Telegram или YouTube будут отображаться рядом с вашим профилем в
          разделе «Герои проекта».
        </p>
      </div>
      <div className="flex-shrink-0">
        <Link
          href="/profile?settings=socials"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#f9bc60] text-[#001e1d] text-xs sm:text-sm font-semibold hover:bg-[#e8a545] transition-colors w-full md:w-auto justify-center"
        >
          <LucideIcons.User size="xs" />
          Привязать соцсети
        </Link>
      </div>
    </motion.div>
  );
}
