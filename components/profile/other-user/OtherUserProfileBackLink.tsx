"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function OtherUserProfileBackLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-3 sm:mb-4"
    >
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-lg transition-all duration-200 group"
      >
        <LucideIcons.ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
          Мой профиль
        </span>
      </Link>
    </motion.div>
  );
}
