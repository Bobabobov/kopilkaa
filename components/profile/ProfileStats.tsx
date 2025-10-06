"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

export default function ProfileStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем общую статистику
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
    >
      {/* Статистика */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 cursor-pointer max-w-md mx-auto"
        onClick={() => (window.location.href = "/stats")}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Статистика
          </h3>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Загрузка...
            </p>
          ) : stats ? (
            <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
              <p>Всего заявок: {stats.applications.total}</p>
              <p>Одобрено: {stats.applications.approved}</p>
              <p>Пользователей: {stats.users.total}</p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Отслеживайте свой прогресс
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
