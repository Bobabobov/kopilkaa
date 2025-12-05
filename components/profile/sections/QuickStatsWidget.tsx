"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface QuickStat {
  label: string;
  value: number | string;
  icon: keyof typeof LucideIcons;
  color: string;
  link?: string;
  trend?: "up" | "down" | "neutral";
}

export default function QuickStatsWidget() {
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // В реальности это будет из API
        const mockStats: QuickStat[] = [
          {
            label: "Заявок создано",
            value: 8,
            icon: "FileText",
            color: "#f9bc60",
            link: "/applications",
            trend: "up",
          },
          {
            label: "Пожертвовано",
            value: "12.5K",
            icon: "Heart",
            color: "#e16162",
            link: "/support",
            trend: "up",
          },
          {
            label: "Друзей",
            value: 24,
            icon: "Users",
            color: "#abd1c6",
            link: "/profile?friendsTab=friends",
            trend: "up",
          },
          {
            label: "Достижений",
            value: 15,
            icon: "Award",
            color: "#7f5af0",
            link: "/profile",
            trend: "neutral",
          },
        ];
        
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching quick stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 animate-pulse">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const IconComponent = LucideIcons[stat.icon] || LucideIcons.Activity;
        const content = (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group relative bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#abd1c6]/40"
          >
            {/* Декоративный градиент при наведении */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ 
                background: `radial-gradient(circle at center, ${stat.color}, transparent)`
              }}
            ></div>
            
            {/* Анимированная иконка */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative z-10 mb-3"
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: `${stat.color}20`,
                  border: `2px solid ${stat.color}40`,
                  color: stat.color
                }}
              >
                <IconComponent 
                  size="md"
                />
              </div>
            </motion.div>

            {/* Значение */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </motion.div>
              <p className="text-xs sm:text-sm text-[#abd1c6] font-medium">
                {stat.label}
              </p>
            </div>

            {/* Тренд индикатор */}
            {stat.trend && stat.trend !== "neutral" && (
              <div className="absolute top-3 right-3">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <LucideIcons.TrendingUp 
                    size="sm"
                    className={stat.trend === "up" ? "text-green-400" : "text-red-400"}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        );

        return stat.link ? (
          <Link key={index} href={stat.link}>
            {content}
          </Link>
        ) : (
          <div key={index}>{content}</div>
        );
      })}
    </div>
  );
}

