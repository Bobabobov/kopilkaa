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
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)",
            boxShadow: "0 10px 25px rgba(249, 188, 96, 0.3)",
          }}
        >
          <LucideIcons.FileText size="xl" className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{ color: "#fffffe" }}
        >
          📝 Подача заявки
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#abd1c6" }}
        >
          Расскажите свою историю и получите помощь от сообщества.
          <br />
          <span style={{ color: "#f9bc60" }}>
            Чем подробнее вы опишете ситуацию, тем больше шансов на поддержку.
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
