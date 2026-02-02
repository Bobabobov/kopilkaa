// components/stories/StoryActions.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryActionsProps {
  isAd?: boolean;
  advertiserLink?: string;
}

export default function StoryActions({
  isAd = false,
  advertiserLink,
}: StoryActionsProps) {
  return (
    <div className="mt-12 pt-8 border-t border-[#abd1c6]/20 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
      {isAd && advertiserLink ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <a
              href={advertiserLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-8 py-4 text-[#001e1d] font-bold shadow-[0_8px_24px_rgba(249,188,96,0.35)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(249,188,96,0.4)] hover:-translate-y-1"
            >
              <LucideIcons.ExternalLink size="md" />
              Перейти на сайт
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              href="/advertising"
              className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/40 bg-[#001e1d]/50 px-8 py-4 text-[#abd1c6] font-semibold transition-all duration-300 hover:border-[#f9bc60]/50 hover:text-[#f9bc60] hover:bg-[#f9bc60]/10"
            >
              <LucideIcons.Megaphone size="md" />
              Разместить рекламу
            </Link>
          </motion.div>
        </>
      ) : (
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-8 py-4 text-[#001e1d] font-bold shadow-[0_8px_24px_rgba(249,188,96,0.3)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(249,188,96,0.35)] hover:-translate-y-1"
        >
          <LucideIcons.Plus size="md" />
          Подать заявку
        </Link>
      )}
    </div>
  );
}
