"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface LevelData {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}

export default function UserLevelProgress() {
  const [data, setData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        // В реальности это будет из API
        // Пока симулируем данные
        const mockData: LevelData = {
          currentLevel: 12,
          currentXP: 2450,
          nextLevelXP: 3000,
          totalXP: 12450,
        };

        setData(mockData);
      } catch (error) {
        console.error("Error fetching level:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/2"></div>
          <div className="h-4 bg-[#abd1c6]/10 rounded"></div>
        </div>
      </div>
    );
  }

  const progress = (data.currentXP / data.nextLevelXP) * 100;
  const xpNeeded = data.nextLevelXP - data.currentXP;

  const getLevelColor = (level: number) => {
    if (level < 5)
      return { bg: "from-[#abd1c6] to-[#94a1b2]", text: "#abd1c6" };
    if (level < 10)
      return { bg: "from-[#f9bc60] to-[#e8a545]", text: "#f9bc60" };
    if (level < 20)
      return { bg: "from-[#e16162] to-[#d14d4e]", text: "#e16162" };
    return { bg: "from-[#7f5af0] to-[#6d4cdb]", text: "#7f5af0" };
  };

  const levelColor = getLevelColor(data.currentLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 relative overflow-hidden"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f9bc60]/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#e16162]/10 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${levelColor.bg} rounded-lg flex items-center justify-center shadow-lg`}
            >
              <LucideIcons.Star className="text-white" size="md" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe]">
                Уровень {data.currentLevel}
              </h3>
              <p className="text-xs text-[#abd1c6]">
                {data.totalXP.toLocaleString("ru-RU")} опыта всего
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: levelColor.text }}
            >
              LVL
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="text-[#abd1c6]">
              {data.currentXP.toLocaleString("ru-RU")} /{" "}
              {data.nextLevelXP.toLocaleString("ru-RU")} XP
            </span>
            <span className="text-[#f9bc60] font-semibold">
              Осталось {xpNeeded.toLocaleString("ru-RU")} XP
            </span>
          </div>
          <div className="relative h-4 sm:h-5 bg-[#001e1d] rounded-full overflow-hidden border border-[#abd1c6]/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${levelColor.bg} rounded-full shadow-lg`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#fffffe]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Бонусы уровня */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-[#abd1c6]/10">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-[#f9bc60]">
              +{data.currentLevel * 5}%
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6]">К шансу</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-[#e16162]">
              {data.currentLevel}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6]">Бейджей</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-[#abd1c6]">
              {data.currentLevel >= 10 ? "⭐" : "🔒"}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6]">Премиум</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
