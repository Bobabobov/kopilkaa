"use client";

import { motion } from "framer-motion";

export default function GamesHero() {
  return (
    <div className="relative mb-12 sm:mb-16 md:mb-20">
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center relative z-10"
      >
        {/* Бейдж */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#001e1d]/60 border border-[#f9bc60]/30 rounded-full mb-6 sm:mb-8 backdrop-blur-md shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="w-2 h-2 bg-[#f9bc60] rounded-full shadow-lg shadow-[#f9bc60]/50"
          ></motion.div>
          <span className="text-xs sm:text-sm font-medium text-[#f9bc60]">В разработке</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight"
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%",
              backgroundImage: "linear-gradient(90deg, #fffffe 0%, #f9bc60 25%, #e8a545 50%, #f9bc60 75%, #fffffe 100%)",
            }}
            className="bg-clip-text text-transparent inline-block"
          >
            🎮 Игры
          </motion.span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-[#abd1c6] mb-8 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Раздел игр сейчас в разработке. Мы готовим для вас мини‑игры, но пока
          запуск игр временно недоступен.
        </motion.p>
      </motion.div>
    </div>
  );
}

