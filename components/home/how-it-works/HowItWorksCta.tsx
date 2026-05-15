"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

interface HowItWorksCtaProps {
  loading: boolean;
  onStartClick: () => void;
}

export function HowItWorksCta({ loading, onStartClick }: HowItWorksCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="text-center mt-12"
    >
      <button
        onClick={onStartClick}
        disabled={loading}
        className="inline-flex items-center gap-2.5 px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 md:hover:scale-[1.02] md:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
        style={{
          background:
            "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
          color: "#001e1d",
          boxShadow: "0 8px 32px rgba(249, 188, 96, 0.25)",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Загрузка...</span>
          </>
        ) : (
          <>
            <span>Рассказать историю</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.div>
  );
}
