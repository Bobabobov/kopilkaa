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
      return <LucideIcons.FileText className="w-4 h-4 text-[#f9bc60]" />;
    case "profile_updated":
      return <LucideIcons.User className="w-4 h-4 text-[#f9bc60]" />;
    case "donation":
      return <LucideIcons.Heart className="w-4 h-4 text-[#f9bc60]" />;
    default:
      return <LucideIcons.Activity className="w-4 h-4 text-[#f9bc60]" />;
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg p-4 sm:p-5 md:p-6"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
            <div className="h-5 bg-white/10 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-16 bg-white/5 rounded-xl"></div>
            <div className="h-16 bg-white/5 rounded-xl"></div>
            <div className="h-16 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg"
    >
      {/* Подсветки */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#abd1c6]/10 blur-2xl rounded-full" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg">
            <LucideIcons.Activity className="w-5 h-5 text-[#f9bc60]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Активность</h3>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Activity className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">Пока нет активности</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id || `other-activity-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#f9bc60]/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border border-[#f9bc60]/30 flex items-center justify-center flex-shrink-0 shadow-md">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white mb-1">
                    {activity.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <LucideIcons.Calendar className="w-3 h-3" />
                    <span>{relativeTime(activity.createdAt)}</span>
                    <span>•</span>
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
