// components/applications/TimeStats.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimeStatsData {
  totalTime: number;
  totalVisits: number;
  averageTime: number;
}

export default function TimeStats() {
  const [data, setData] = useState<TimeStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(
          "/api/page-visits/stats?page=/applications&days=30",
        );
        if (response.ok) {
          const stats = await response.json();
          setData({
            totalTime: stats.totalTime || 0,
            totalVisits: stats.totalVisits || 0,
            averageTime: stats.averageTime || 0,
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}ч ${minutes % 60}м`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds % 60}с`;
    } else {
      return `${seconds}с`;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          Загружаем статистику...
        </div>
      </motion.div>
    );
  }

  if (!data || data.totalVisits === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="text-center text-blue-600 dark:text-blue-400">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Статистика времени</div>
          <div className="text-sm mt-1">
            Пока нет данных о времени, проведенном на этой странице
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
    >
      <div className="text-center">
        <div className="text-2xl mb-3">⏱️</div>
        <div className="font-bold text-emerald-700 dark:text-emerald-300 text-lg mb-2">
          Статистика времени на странице
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
              Общее время
            </div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {formatTime(data.totalTime)}
            </div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
              Посещений
            </div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {data.totalVisits}
            </div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
              Среднее время
            </div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {formatTime(data.averageTime)}
            </div>
          </div>
        </div>

        <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-3">
          За последние 30 дней
        </div>
      </div>
    </motion.div>
  );
}
