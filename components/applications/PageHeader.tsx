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
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mb-6"
        >
          <img 
            src="/kopibym.png" 
            alt="Заявка" 
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#f9bc60] bg-clip-text text-transparent"
        >
          Подача заявки
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#abd1c6" }}
        >
          Расскажите свою историю — платформа рассмотрит её и примет решение о финансовой поддержке.
          <br />
          <span style={{ color: "#f9bc60" }}>
            Чем понятнее и честнее вы опишете ситуацию, тем проще платформе принять решение.
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
