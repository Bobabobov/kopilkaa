"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  type: "application" | "login";
  title: string;
  description: string;
  icon: string;
  timestamp: string;
  color: string;
}

export default function ProfileActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Пока что используем моковые данные, позже заменим на реальный API
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        type: "application",
        title: "Создана заявка",
        description: "Заявка на помощь",
        icon: "📝",
        timestamp: "2 дня назад",
        color: "green",
      },
      {
        id: "2",
        type: "login",
        title: "Вход в систему",
        description: "Последний вход",
        icon: "🔑",
        timestamp: "3 дня назад",
        color: "gray",
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
      case "yellow":
        return "bg-lime-100 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400";
      case "green":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "gray":
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

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
      transition={{ delay: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 h-fit"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            Активность
          </h3>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Нет активности
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id || `activity-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50 dark:hover:from-emerald-900/10 dark:hover:to-green-900/10 rounded-xl transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {activity.title}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getColorClasses(activity.color)}`}
                    >
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs truncate mt-1">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
