"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
          <LucideIcons.Stats className="text-[#f9bc60]" size="sm" />
        </div>
        <h3 className="text-xl font-bold text-[#fffffe]">
          Статистика
        </h3>
      </div>

      {!stats ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <LucideIcons.Stats className="text-[#abd1c6]" size="lg" />
          </div>
          <p className="text-[#abd1c6] text-sm">Нет данных</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Заявки */}
          <div className="bg-[#001e1d]/40 rounded-2xl p-4 border border-[#abd1c6]/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <LucideIcons.FileText className="text-[#f9bc60]" size="md" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[#fffffe] text-sm">
                    Мои заявки
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f9bc60] text-[#001e1d]">
                    {stats.applications.total}
                  </span>
                </div>
                <p className="text-[#abd1c6] text-xs">
                  Одобрено: {stats.applications.approved}
                </p>
              </div>
            </div>
          </div>

          {/* Дней в системе */}
          <div className="bg-[#001e1d]/40 rounded-2xl p-4 border border-[#abd1c6]/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <LucideIcons.Calendar className="text-[#f9bc60]" size="md" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[#fffffe] text-sm">
                    С нами
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f9bc60] text-[#001e1d]">
                    {stats.user.daysSinceRegistration}
                  </span>
                </div>
                <p className="text-[#abd1c6] text-xs">
                  {stats.user.daysSinceRegistration === 1
                    ? "день"
                    : stats.user.daysSinceRegistration < 5
                    ? "дня"
                    : "дней"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
