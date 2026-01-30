"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DonateButton from "@/components/donate/DonateButton";

export function HeroSectionCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="text-center mb-10"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
        <Link
          href="/applications"
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            color: "#001e1d",
            boxShadow: "0 10px 40px rgba(249, 188, 96, 0.3)",
          }}
        >
          Рассказать историю
        </Link>
        <DonateButton variant="large" className="w-full sm:w-auto" />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-center text-sm sm:text-base text-[#abd1c6]">
        <Link
          href="/stories"
          className="underline underline-offset-4 hover:text-[#fffffe] transition-colors"
        >
          Смотреть истории →
        </Link>
        <span className="hidden sm:inline text-[#abd1c6]/60">•</span>
        <a
          href="#how-it-works"
          className="underline underline-offset-4 hover:text-[#fffffe] transition-colors"
        >
          Как это работает
        </a>
      </div>
      <p className="mt-4 text-sm text-[#94a1b2] max-w-2xl mx-auto leading-relaxed">
        Решение не гарантировано. Мы стараемся помогать честно и по
        возможности.
      </p>
    </motion.div>
  );
}
