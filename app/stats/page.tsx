"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import UniversalBackground from "@/components/ui/UniversalBackground";

interface StatsData {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  users: {
    total: number;
    new: number;
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Загрузка статистики...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20">
        <div className="w-full px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                📊 Статистика
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Общая статистика платформы
              </p>
            </div>
            <Link
              href="/profile"
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300"
            >
              ← Назад к профилю
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="w-full px-6 pt-8 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Заявки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Заявки
                </h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.applications.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Всего заявок
                </div>
              </div>
            </motion.div>

            {/* Одобренные */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Одобрено
                </h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stats.applications.approved}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Успешных заявок
                </div>
              </div>
            </motion.div>

            {/* В ожидании */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">⏳</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  В ожидании
                </h3>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {stats.applications.pending}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  На рассмотрении
                </div>
              </div>
            </motion.div>

            {/* Пользователи */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Пользователи
                </h3>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stats.users.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Зарегистрировано
                </div>
              </div>
            </motion.div>
          </div>

          {/* Дополнительная статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Статистика заявок
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Одобрено:
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {stats.applications.approved}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Отклонено:
                  </span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {stats.applications.rejected}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    В ожидании:
                  </span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {stats.applications.pending}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.applications.approved / stats.applications.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Процент одобрения:{" "}
                  {Math.round(
                    (stats.applications.approved / stats.applications.total) *
                      100,
                  )}
                  %
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Активность пользователей
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Всего пользователей:
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {stats.users.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Новых за неделю:
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {stats.users.new}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Среднее заявок на пользователя:
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    {(stats.applications.total / stats.users.total).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
