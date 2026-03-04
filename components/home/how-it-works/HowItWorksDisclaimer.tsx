"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

export function HowItWorksDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-10 flex justify-center"
    >
      <div
        className="inline-flex items-start gap-3 rounded-2xl px-5 py-4 max-w-2xl text-left"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(249, 188, 96, 0.12)", color: "#f9bc60" }}
        >
          <Info className="w-4 h-4" />
        </span>
        <p className="text-sm leading-relaxed pt-0.5" style={{ color: "#abd1c6" }}>
          «Копилка» — платформа, которая самостоятельно оказывает финансовую поддержку пользователям. Средства предоставляются безвозмездно и не являются займом.
        </p>
      </div>
    </motion.div>
  );
}
