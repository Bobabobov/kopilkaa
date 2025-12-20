"use client";

import { motion } from 'framer-motion';

export function StandardsHero() {
  return (
    <div className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-full mb-6 sm:mb-8 backdrop-blur-md"
          >
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#f9bc60] rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium text-[#abd1c6]">Полное руководство</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-[#fffffe] mb-4 sm:mb-6 tracking-tight leading-[1.05] px-2">
            Стандарты
            <br />
            <span className="bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] bg-clip-text text-transparent">
              рекламных блоков
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-[#abd1c6] max-w-2xl mx-auto leading-relaxed px-4">
            Всё, что нужно знать для эффективной рекламы на платформе
          </p>
        </motion.div>
      </div>
    </div>
  );
}
