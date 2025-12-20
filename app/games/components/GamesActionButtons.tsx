"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function GamesActionButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 md:mb-16"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/profile"
          className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] text-[#001e1d] font-black rounded-xl transition-all duration-300 shadow-xl shadow-[#f9bc60]/30 hover:shadow-[#f9bc60]/50 text-base sm:text-lg relative overflow-hidden group"
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              backgroundSize: "200% 100%"
            }}
          />
          <span className="relative z-10">Вернуться в профиль</span>
        </Link>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/applications"
          className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-[#001e1d]/60 hover:bg-[#001e1d]/80 text-[#fffffe] font-bold rounded-xl transition-all duration-300 border-2 border-[#abd1c6]/30 hover:border-[#f9bc60]/50 shadow-xl hover:shadow-[#f9bc60]/20 text-base sm:text-lg backdrop-blur-sm"
        >
          Подать заявку
        </Link>
      </motion.div>
    </motion.div>
  );
}

