"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function ProfileStreak() {
  const [streak, setStreak] = useState({ days: 7, longest: 12 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реальности это будет из API
    setTimeout(() => {
      setStreak({ days: 7, longest: 12 });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/2"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const flameIntensity = Math.min(streak.days / 10, 1);
  const flameColor = streak.days >= 7 ? "#f9bc60" : streak.days >= 3 ? "#e16162" : "#abd1c6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-[#004643] via-[#001e1d] to-[#004643] rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 relative overflow-hidden"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f9bc60]/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#e16162]/10 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                filter: [`drop-shadow(0 0 8px ${flameColor}40)`, `drop-shadow(0 0 16px ${flameColor}60)`, `drop-shadow(0 0 8px ${flameColor}40)`]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${flameColor}20`,
              border: `2px solid ${flameColor}40`,
              color: flameColor
              }}
            >
              <LucideIcons.Zap 
                size="md"
              />
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe]">
                Серия активности
              </h3>
              <p className="text-xs text-[#abd1c6]">
                Дней подряд
              </p>
            </div>
          </div>
        </div>

        {/* Основной индикатор */}
        <div className="mb-4">
          <div className="flex items-end gap-2 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold"
              style={{ color: flameColor }}
            >
              {streak.days}
            </motion.div>
            <span className="text-lg sm:text-xl text-[#abd1c6] mb-1">
              дней
            </span>
          </div>
          
          {/* Прогресс-бар серии */}
          <div className="relative h-3 bg-[#001e1d] rounded-full overflow-hidden border border-[#abd1c6]/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(streak.days / streak.longest) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full relative"
              style={{ 
                background: `linear-gradient(90deg, ${flameColor}, ${flameColor}dd)`,
                boxShadow: `0 0 10px ${flameColor}40`
              }}
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              ></motion.div>
            </motion.div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center justify-between pt-3 border-t border-[#abd1c6]/10">
          <div className="text-center flex-1">
            <div className="text-lg sm:text-xl font-bold text-[#f9bc60]">
              {streak.longest}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6]">
              Рекорд
            </div>
          </div>
          <div className="h-8 w-px bg-[#abd1c6]/20"></div>
          <div className="text-center flex-1">
            <div className="text-lg sm:text-xl font-bold text-[#abd1c6]">
              {streak.days >= 7 ? "🔥" : streak.days >= 3 ? "⭐" : "💪"}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6]">
              Статус
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


