import Link from "next/link";
import { motion } from "framer-motion";

export function OtherUserQuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="pt-3 sm:pt-4 border-t border-[#abd1c6]/20"
    >
      <div className="grid grid-cols-2 gap-2">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Link
            href="/friends?tab=search"
            className="group px-3 py-2 bg-[#001e1d]/30 hover:bg-[#001e1d]/40 text-[#abd1c6] rounded-lg transition-all duration-200 text-center text-sm font-medium block border border-[#abd1c6]/10"
          >
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Поиск друзей
            </div>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Link
            href="/profile"
            className="group px-3 py-2 bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 text-[#f9bc60] rounded-lg transition-all duration-200 text-center text-sm font-semibold block border border-[#f9bc60]/20"
          >
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Мой профиль
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
