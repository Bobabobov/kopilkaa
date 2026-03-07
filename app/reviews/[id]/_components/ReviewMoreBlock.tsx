"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function ReviewMoreBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#abd1c6]/20"
      aria-label="Ещё материалы"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#94a1b2] mb-4">
        Продолжить чтение
      </p>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <Link
          href="/reviews"
          className="group inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 px-4 py-3 text-sm font-semibold text-[#abd1c6] transition-all hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f9bc60]/20 text-[#f9bc60] transition-transform group-hover:scale-105">
            <LucideIcons.MessageCircle size="sm" />
          </span>
          Все отзывы
        </Link>
        <Link
          href="/stories"
          className="group inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 px-4 py-3 text-sm font-semibold text-[#abd1c6] transition-all hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#abd1c6]/20 text-[#abd1c6] transition-transform group-hover:scale-105">
            <LucideIcons.BookOpen size="sm" />
          </span>
          Истории участников
        </Link>
      </div>
    </motion.section>
  );
}
