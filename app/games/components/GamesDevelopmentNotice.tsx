"use client";

import { motion } from "framer-motion";

export default function GamesDevelopmentNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16"
    >
      <div className="relative overflow-hidden group">
        <div className="relative bg-gradient-to-br from-[#001e1d]/90 via-[#004643]/80 to-[#001e1d]/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-[#f9bc60]/40 hover:border-[#f9bc60]/60 transition-all duration-500 shadow-2xl shadow-[#f9bc60]/10">
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 2,
                ease: "easeInOut"
              }}
              className="text-4xl sm:text-5xl flex-shrink-0"
            >
              ⚠️
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-black text-[#f9bc60] mb-3 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] bg-clip-text text-transparent">
                Раздел в разработке
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-[#fffffe] leading-relaxed">
                Раздел игр сейчас временно «заморожен». Мы переделываем игры и механику,
                поэтому запуск недоступен. Как только всё будет готово — здесь появятся
                новые активные игры.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

