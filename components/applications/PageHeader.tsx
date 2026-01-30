"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function PageHeader() {
  return (
    <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-[#f9bc60]/10 backdrop-blur-md px-5 py-8 sm:px-8 sm:py-10 text-center shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#f9bc60]/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#abd1c6]/10 blur-3xl" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            className="mx-auto mb-4 inline-flex items-center gap-3 rounded-full border border-[#f9bc60]/40 bg-[#f9bc60]/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#f9bc60]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f9bc60]/30 text-[#001e1d]">
              <LucideIcons.FileText size="sm" />
            </span>
            Подача заявки
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#f9bc60] bg-clip-text text-transparent"
          >
            Расскажите свою историю
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-[#abd1c6]"
          >
            Платформа рассмотрит заявку и примет решение о финансовой поддержке.
            <br />
            <span className="text-[#f9bc60] font-semibold">
              Чем понятнее и честнее вы опишете ситуацию, тем проще принять
              решение.
            </span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
