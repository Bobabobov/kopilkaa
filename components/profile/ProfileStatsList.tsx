"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SiteIcons } from "@/components/ui/Icon";

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
}

export default function ProfileStatsList() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setStats(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20 h-fit">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20 h-fit"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SiteIcons.Stats size="md" className="text-green-500" />
          Моя статистика
        </h3>
      </div>

      {!stats ? (
        <div className="text-center py-4">
          <SiteIcons.Stats size="lg" className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-xs">Нет данных</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Заявки */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 p-2 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <SiteIcons.Document
              size="md"
              className="text-emerald-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                  Мои заявки
                </h4>
                <span className="px-1 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                  {stats.applications.total}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Одобрено: {stats.applications.approved}
              </p>
            </div>
          </motion.div>

          {/* Дней в системе */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 p-2 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <SiteIcons.Calendar
              size="md"
              className="text-orange-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                  В системе
                </h4>
                <span className="px-1 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                  {stats.user.daysSinceRegistration}д
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Дней с регистрации
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
