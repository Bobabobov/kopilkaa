// components/profile/OtherUserStats.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type UserStats = {
  applicationsCount: number;
  daysSinceRegistration: number;
};

interface OtherUserStatsProps {
  userId: string;
}

export default function OtherUserStats({ userId }: OtherUserStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          const errorData = await response.json();
          console.error("Stats error:", errorData);
        }
      } catch (error) {
        console.error("Load stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#f9bc60] rounded-lg flex items-center justify-center text-[#001e1d] text-lg">
              📊
            </div>
            <h3 className="text-lg font-semibold text-[#fffffe]">
              Статистика
            </h3>
          </div>
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-[#f9bc60] border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#f9bc60] rounded-lg flex items-center justify-center text-[#001e1d] text-lg">
              📊
            </div>
            <h3 className="text-lg font-semibold text-[#fffffe]">
              Статистика
            </h3>
          </div>
          <div className="text-center py-4">
            <p className="text-[#abd1c6] text-sm">
              Не удалось загрузить статистику
            </p>
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
            📊
          </div>
          <h3 className="text-lg font-semibold text-[#fffffe]">
            Статистика
          </h3>
        </div>

        <div className="space-y-4">
          <div className="group flex items-center justify-between p-4 bg-[#001e1d]/30 rounded-2xl hover:bg-[#001e1d]/40 transition-all duration-300 border border-[#abd1c6]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📝
              </div>
              <span className="text-sm font-medium text-[#abd1c6]">
                Заявки
              </span>
            </div>
            <span className="text-lg font-bold text-[#f9bc60]">
              {stats.applicationsCount}
            </span>
          </div>

          <div className="group flex items-center justify-between p-4 bg-[#001e1d]/30 rounded-2xl hover:bg-[#001e1d]/40 transition-all duration-300 border border-[#abd1c6]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#abd1c6]/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📅
              </div>
              <span className="text-sm font-medium text-[#abd1c6]">
                На платформе
              </span>
            </div>
            <span className="text-lg font-bold text-[#abd1c6]">
              {stats.daysSinceRegistration} дн.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
