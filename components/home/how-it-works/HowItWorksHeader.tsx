"use client";

import { motion } from "framer-motion";
import { ListOrdered } from "lucide-react";

export function HowItWorksHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-14"
    >
      <span
        className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
        style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
      >
        <ListOrdered className="w-4 h-4" />
        Простая инструкция
      </span>
      <h2
        className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
        style={{ color: "#fffffe" }}
      >
        Как получить финансовую помощь
      </h2>
      <p
        className="text-lg md:text-xl max-w-2xl mx-auto"
        style={{ color: "#abd1c6" }}
      >
        4 шага: от регистрации до решения по вашей заявке
      </p>
    </motion.div>
  );
}
