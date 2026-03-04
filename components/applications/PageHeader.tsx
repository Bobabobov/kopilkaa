"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";

export default function PageHeader() {
  return (
    <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <Card variant="darkGlass" padding="lg" className="relative overflow-hidden text-center">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#f9bc60]/10 blur-3xl pointer-events-none" aria-hidden />
          <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#abd1c6]/8 blur-3xl pointer-events-none" aria-hidden />
          <CardContent className="relative py-8 sm:py-10 px-5 sm:px-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f9bc60]/25 text-[#001e1d]">
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
