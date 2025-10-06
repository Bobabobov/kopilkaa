// components/applications/UserTimeStats.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface UserTimeStatsData {
  userId: string;
  user: {
    email: string;
    name: string | null;
    hideEmail?: boolean;
  };
  page: string;
  period: string;
  totalTime: number;
  totalVisits: number;
  averageTime: number;
}

interface UserTimeStatsProps {
  userId: string;
  applicationId?: string;
}

export default function UserTimeStats({
  userId,
  applicationId,
}: UserTimeStatsProps) {
  const [data, setData] = useState<UserTimeStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const url = `/api/page-visits/user-stats?userId=${userId}&page=/applications${applicationId ? `&applicationId=${applicationId}` : ""}`;
        const response = await fetch(url);
        if (response.ok) {
          const stats = await response.json();
          setData(stats);
        }
      } catch (error) {
        console.error("Ошибка загрузки статистики пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId, applicationId]);

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
        className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          Загружаем статистику времени...
        </div>
      </motion.div>
    );
  }

  if (!data || data.totalVisits === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="text-center text-blue-600 dark:text-blue-400">
          <div className="text-2xl mb-2">⏱️</div>
          <div className="font-medium">Время написания заявки (ОБНОВЛЕНО)</div>
          <div className="text-sm mt-1">
            Нет данных о времени, проведенном на странице заявок
          </div>
          {data && (
            <div className="text-xs mt-2 text-blue-500 dark:text-blue-300">
              {data.period}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
    >
      <div className="text-center">
        <div className="text-2xl mb-3">⏱️</div>
        <div className="font-bold text-emerald-700 dark:text-emerald-300 text-lg mb-2">
          Время написания заявки
        </div>

        <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">
          Автор:{" "}
          {data.user.name ||
            (!data.user.hideEmail
              ? data.user.email.split("@")[0]
              : "Пользователь")}
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
            {formatTime(data.totalTime)}
          </div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400">
            времени на написание заявок
          </div>
        </div>

        <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-3">
          {data.period}
        </div>
      </div>
    </motion.div>
  );
}
