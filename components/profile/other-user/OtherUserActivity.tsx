// components/profile/OtherUserActivity.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
        return "📝";
      case "profile_updated":
        return "👤";
      default:
        return "📌";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "application_created":
        return "text-emerald-600 dark:text-emerald-400";
      case "profile_updated":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-lime-500/10 to-green-500/10 rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#f9bc60] rounded-lg flex items-center justify-center text-[#001e1d] text-lg">
              ⚡
            </div>
            <h3 className="text-lg font-semibold text-[#fffffe]">Активность</h3>
          </div>
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-[#f9bc60] border-t-transparent rounded-full mx-auto"></div>
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#f9bc60] rounded-lg flex items-center justify-center text-[#001e1d] text-lg">
            ⚡
          </div>
          <h3 className="text-lg font-semibold text-[#fffffe]">Активность</h3>
        </div>

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
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id || `other-activity-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-start gap-4 p-4 rounded-2xl bg-[#001e1d]/30 border border-[#abd1c6]/10 hover:bg-[#001e1d]/40 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold text-[#fffffe] mb-1"
                  >
                    {activity.description}
                  </div>
                  <div className="text-xs text-[#94a3b8]">
                    {new Date(activity.createdAt).toLocaleString("ru-RU")}
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
