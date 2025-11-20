// components/terms/TermsSection.tsx
"use client";

import { motion } from "framer-motion";

interface TermsSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function TermsSection({
  number,
  title,
  children,
  delay = 0,
}: TermsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="mb-8 sm:mb-12 pb-8 sm:pb-10 border-b border-[#abd1c6]/10 last:border-b-0 group"
    >
      <motion.h2
        whileHover={{ x: 5 }}
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#fffffe] mb-5 sm:mb-6 flex items-center gap-3 transition-all duration-300"
      >
        <motion.span
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center text-[#001e1d] text-sm sm:text-base font-bold shadow-lg group-hover:shadow-xl transition-all duration-300"
        >
          {number}
        </motion.span>
        <span className="group-hover:text-[#f9bc60] transition-colors duration-300">
          {title}
        </span>
      </motion.h2>
      <div className="space-y-4 sm:space-y-5 text-[#abd1c6] text-sm sm:text-base leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}
