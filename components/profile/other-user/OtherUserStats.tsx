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
      <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[160px]">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-[#abd1c6]/20 rounded w-32" />
          <div className="h-4 bg-[#abd1c6]/10 rounded w-24" />
          <div className="h-10 bg-[#abd1c6]/10 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[160px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#f9bc60] rounded-lg flex items-center justify-center text-[#001e1d] text-lg">
            📊
          </div>
          <h3 className="text-lg font-semibold text-[#fffffe]">Статистика</h3>
        </div>
        <p className="text-[#abd1c6] text-sm">Не удалось загрузить статистику</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[160px]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[#f9bc60] rounded-lg flex items-center justify-center text-[#001e1d] text-lg">
          📊
        </div>
        <h3 className="text-lg font-semibold text-[#fffffe]">Статистика</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#001e1d]/30 border border-[#abd1c6]/15">
          <span className="text-sm text-[#abd1c6]">Заявки</span>
          <span className="text-base font-bold text-[#f9bc60]">
            {stats.applicationsCount}
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#001e1d]/30 border border-[#abd1c6]/15">
          <span className="text-sm text-[#abd1c6]">На платформе</span>
          <span className="text-base font-bold text-[#abd1c6]">
            {stats.daysSinceRegistration} дн.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
