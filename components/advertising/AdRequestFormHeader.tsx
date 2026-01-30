"use client";

import { motion } from "framer-motion";

export function AdRequestFormHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-16 text-center"
    >
      <h2 className="text-5xl md:text-6xl font-bold text-[#fffffe] mb-4">
        Оставьте заявку
      </h2>
      <p className="text-xl md:text-2xl text-[#abd1c6] max-w-2xl mx-auto">
        Расскажите о себе. Остальное обсудим лично.
      </p>
    </motion.div>
  );
}
