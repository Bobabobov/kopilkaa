"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface UserStats {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  user: {
    daysSinceRegistration: number;
  };
  tree?: {
    level: number;
    currentStreak: number;
  };
  achievements?: {
    total: number;
    rare: number;
  };
}

interface StatsSectionProps {
  userId: string;
}

export default function StatsSection({ userId }: StatsSectionProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profile/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-6 w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-300 dark:bg-gray-600 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Заявки",
      value: stats.applications.total,
      subtitle: `${stats.applications.approved} одобрено`,
      icon: "📝",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Дерево",
      value: stats.tree ? `Ур. ${stats.tree.level}` : "Не настроено",
      subtitle: stats.tree
        ? `${stats.tree.currentStreak} дней подряд`
        : "Система отключена",
      icon: "🌳",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Достижения",
      value: stats.achievements ? stats.achievements.total : 0,
      subtitle: stats.achievements
        ? `${stats.achievements.rare} редких`
        : "Система отключена",
      icon: "🏆",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "В системе",
      value: `${stats.user.daysSinceRegistration}д`,
      subtitle: "Дней с регистрации",
      icon: "📅",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-2"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Статистика и активность
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title || `stat-card-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`relative overflow-hidden bg-gradient-to-br ${card.color} rounded-xl p-4 text-white`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{card.icon}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-sm opacity-90">{card.subtitle}</div>
                  </div>
                </div>
                <div className="text-sm font-medium">{card.title}</div>
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
