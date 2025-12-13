// components/profile/OtherUserActivity.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
};

interface OtherUserActivityProps {
  userId: string;
}

export default function OtherUserActivity({ userId }: OtherUserActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/activity`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        }
      } catch (error) {
        console.error("Load activities error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [userId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
    case "application_created":
      return <LucideIcons.FileText size="sm" />;
    case "profile_updated":
      return <LucideIcons.User size="sm" />;
    case "donation":
      return <LucideIcons.Heart size="sm" />;
    default:
      return <LucideIcons.Activity size="sm" />;
    }
  };

const relativeTime = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "вчера";
  if (days < 7) return `${days} дн назад`;
  return d.toLocaleDateString("ru-RU");
};

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[300px]">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-1/4"></div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10">
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center text-[#001e1d] text-xl shadow-lg shadow-[#f9bc60]/30"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            ⚡
          </motion.div>
          <h3 className="text-lg font-bold text-[#fffffe] bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent">
            Активность
          </h3>
        </motion.div>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#f9bc60]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-[#abd1c6] text-sm">
              Пока нет активности
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id || `other-activity-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-[#f9bc60]/20"
              >
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-[#f9bc60]/30 to-[#e8a545]/20 rounded-xl flex items-center justify-center text-lg text-[#001e1d] group-hover:scale-110 transition-transform shadow-md"
                  whileHover={{ rotate: 12, scale: 1.15 }}
                >
                  {getActivityIcon(activity.type)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold text-[#fffffe] mb-1"
                  >
                    {activity.description}
                  </div>
                  <div className="text-xs text-[#94a3b8] flex items-center gap-2">
                    <span>{relativeTime(activity.createdAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#94a3b8]/50" />
                    <span>{new Date(activity.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
