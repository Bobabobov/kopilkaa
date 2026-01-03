// components/terms/TermsHeader.tsx
"use client";

import { motion } from "framer-motion";

export default function TermsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
      >
        <span className="bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent">
          Политика в отношении обработки персональных данных
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl text-[#abd1c6] mb-6"
      >
        (в соответствии с 152‑ФЗ «О персональных данных»)
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-[#abd1c6]/80"
      >
        <span>Сайт: https://kopilka-online.ru</span>
        <span>Раздел: /terms</span>
      </motion.div>
    </motion.div>
  );
}
