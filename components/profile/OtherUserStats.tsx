// components/profile/OtherUserStats.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type UserStats = {
  applicationsCount: number;
  daysSinceRegistration: number;
};

interface OtherUserStatsProps {
  userId: string;
}

export default function OtherUserStats({ userId }: OtherUserStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          const errorData = await response.json();
          console.error("Stats error:", errorData);
        }
      } catch (error) {
        console.error("Load stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-lg">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Статистика
            </h3>
          </div>
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-lg">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Статистика
            </h3>
          </div>
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Не удалось загрузить статистику
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-lg">
            📊
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Статистика
          </h3>
        </div>

        <div className="space-y-4">
          <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📝
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Заявки
              </span>
            </div>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {stats.applicationsCount}
            </span>
          </div>

          <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl hover:from-blue-100 hover:to-emerald-100 dark:hover:from-blue-900/30 dark:hover:to-emerald-900/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📅
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                На платформе
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {stats.daysSinceRegistration} дн.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
