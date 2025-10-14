"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ActivityItem {
  id: string;
  type: "application" | "login";
  title: string;
  description: string;
  timestamp: string;
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
        timestamp: "2 дня назад",
      },
      {
        id: "2",
        type: "login",
        title: "Вход в систему",
        description: "Последний вход",
        timestamp: "3 дня назад",
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
          <div className="space-y-3">
            <div className="h-16 bg-[#abd1c6]/10 rounded-xl"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "application":
        return <LucideIcons.FileText className="text-[#f9bc60]" size="md" />;
      case "login":
        return <LucideIcons.User className="text-[#f9bc60]" size="md" />;
      default:
        return <LucideIcons.Clock className="text-[#f9bc60]" size="md" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
          <LucideIcons.Clock className="text-[#f9bc60]" size="sm" />
        </div>
        <h3 className="text-xl font-bold text-[#fffffe]">
          Активность
        </h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <LucideIcons.Clock className="text-[#abd1c6]" size="lg" />
          </div>
          <p className="text-[#abd1c6] text-sm">
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
              transition={{ delay: 0.1 * index }}
              className="bg-[#001e1d]/40 rounded-2xl p-4 border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-[#fffffe] text-sm">
                      {activity.title}
                    </h4>
                    <span className="text-[#abd1c6] text-xs">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-[#abd1c6] text-xs">
                    {activity.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
