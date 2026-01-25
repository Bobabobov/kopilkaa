"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ImpactStat {
  label: string;
  value: number;
  icon: keyof typeof LucideIcons;
  color: string;
  description: string;
}

export default function CommunityImpact() {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реальности это будет из API
    const mockStats: ImpactStat[] = [
      {
        label: "Помогли людям",
        value: 42,
        icon: "Heart",
        color: "#e16162",
        description: "Человек получили помощь",
      },
      {
        label: "Собрано средств",
        value: 125000,
        icon: "Coin",
        color: "#f9bc60",
        description: "Рублей через ваши заявки",
      },
      {
        label: "Лайков получено",
        value: 156,
        icon: "ThumbsUp",
        color: "#abd1c6",
        description: "Ваши истории понравились",
      },
    ];

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 relative overflow-hidden"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#e16162]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#f9bc60]/10 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#e16162] to-[#d14d4e] rounded-lg flex items-center justify-center shadow-lg">
            <LucideIcons.Users className="text-white" size="sm" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#fffffe]">
              Влияние на сообщество
            </h3>
            <p className="text-xs text-[#abd1c6]">Ваш вклад в проект</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {stats.map((stat, index) => {
            const IconComponent =
              LucideIcons[stat.icon] || LucideIcons.Activity;
            const formattedValue =
              stat.value >= 1000
                ? `${(stat.value / 1000).toFixed(1)}K`
                : stat.value.toString();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#001e1d]/40 rounded-lg border border-[#abd1c6]/10 hover:border-[#abd1c6]/20 transition-all group"
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    border: `2px solid ${stat.color}40`,
                    color: stat.color,
                  }}
                >
                  <IconComponent size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {formattedValue}
                    </motion.span>
                    <span className="text-xs sm:text-sm text-[#abd1c6]">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#abd1c6]/70">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
