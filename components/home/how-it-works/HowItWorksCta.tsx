"use client";

import { motion } from "framer-motion";

interface HowItWorksCtaProps {
  loading: boolean;
  onStartClick: () => void;
}

export function HowItWorksCta({ loading, onStartClick }: HowItWorksCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="text-center mt-16"
    >
      <button
        onClick={onStartClick}
        disabled={loading}
        className="inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{
          background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)",
          color: "#001e1d",
          boxShadow: "0 10px 40px rgba(249, 188, 96, 0.3)",
        }}
      >
        <span>{loading ? "Загрузка..." : "Рассказать историю"}</span>
        {!loading && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
