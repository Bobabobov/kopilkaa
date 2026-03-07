// components/stories/StoryNavigation.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function StoryNavigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="pt-20 sm:pt-24 px-4 sm:px-6"
      aria-label="Навигация"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/60 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-[#abd1c6] transition-all duration-300 hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/15 hover:text-[#f9bc60] hover:shadow-[0_4px_20px_rgba(249,188,96,0.15)]"
        >
          <LucideIcons.ArrowLeft size="sm" />
          К списку историй
        </Link>
      </div>
    </motion.nav>
  );
}
