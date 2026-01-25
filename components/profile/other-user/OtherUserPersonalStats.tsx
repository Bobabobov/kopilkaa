"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface DetailedStats {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    averageAmount: number;
  };
  activity: {
    likesGiven: number;
    likesReceived: number;
    friendsCount: number;
    daysActive: number;
  };
  achievements: {
    total: number;
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  user: {
    createdAt: string;
  };
}

interface ApiResponse {
  detailedStats: DetailedStats;
}

interface OtherUserPersonalStatsProps {
  userId: string;
}

export default function OtherUserPersonalStats({
  userId,
}: OtherUserPersonalStatsProps) {
  const [data, setData] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/detailed-stats`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.detailedStats) {
          setData(result.detailedStats);
        } else {
          throw new Error("No detailed stats in response");
        }
      } catch (error) {
        console.error("Error fetching detailed stats:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load stats",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, [userId]);

  const calculatedStats = useMemo(() => {
    if (!data) return null;

    return {
      applications: data.applications,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg p-4 sm:p-5 md:p-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 animate-pulse space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
            <div className="h-5 bg-white/10 rounded w-40"></div>
          </div>
          <div className="h-40 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
        <div className="text-center py-8">
          <LucideIcons.AlertTriangle
            className="text-red-400 mx-auto mb-2"
            size="lg"
          />
          <p className="text-sm text-[#abd1c6]">{error}</p>
        </div>
      </div>
    );
  }

  if (!calculatedStats) {
    return null;
  }

  const stats = calculatedStats;
  const approvedPercent =
    stats.applications.total > 0
      ? Math.round(
          (stats.applications.approved / stats.applications.total) * 100,
        )
      : 0;
  const pendingPercent =
    stats.applications.total > 0
      ? Math.round(
          (stats.applications.pending / stats.applications.total) * 100,
        )
      : 0;
  const rejectedPercent =
    stats.applications.total > 0
      ? Math.round(
          (stats.applications.rejected / stats.applications.total) * 100,
        )
      : 0;

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

      <div className="relative z-10 p-4 sm:p-5 md:p-6 w-full">
        {/* Заголовок */}
        <motion.div
          className="flex items-center gap-3 mb-5 md:mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg">
            <LucideIcons.BarChart3 className="w-5 h-5 text-[#f9bc60]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Успешность заявок
            </h2>
          </div>
        </motion.div>

        {/* Success Breakdown */}
        {stats.applications.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 md:p-6 space-y-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/5 to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-white/60 mb-1">
                    Успешность заявок
                  </p>
                  <p className="text-white font-medium text-sm">
                    Одобрено {stats.applications.approved} из{" "}
                    {stats.applications.total} заявок
                  </p>
                </div>
                <div className="text-3xl font-bold text-[#f9bc60]">
                  {approvedPercent}%
                </div>
              </div>

              <div className="w-full bg-white/10 rounded-full h-5 overflow-hidden shadow-inner">
                <div className="flex h-full">
                  <motion.span
                    className="bg-[#10B981] transition-all duration-700"
                    initial={{ width: 0 }}
                    animate={{ width: `${approvedPercent}%` }}
                  />
                  <motion.span
                    className="bg-[#F97316] transition-all duration-700"
                    initial={{ width: 0 }}
                    animate={{ width: `${pendingPercent}%` }}
                  />
                  <motion.span
                    className="bg-[#EF4444] transition-all duration-700"
                    initial={{ width: 0 }}
                    animate={{ width: `${rejectedPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Одобрено",
                    value: stats.applications.approved,
                    percent: approvedPercent,
                    color: "#10B981",
                    icon: LucideIcons.CheckCircle2,
                  },
                  {
                    label: "В ожидании",
                    value: stats.applications.pending,
                    percent: pendingPercent,
                    color: "#F97316",
                    icon: LucideIcons.Clock,
                  },
                  {
                    label: "Отклонено",
                    value: stats.applications.rejected,
                    percent: rejectedPercent,
                    color: "#EF4444",
                    icon: LucideIcons.XCircle,
                  },
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div
                        className="p-2 rounded-lg shadow-md"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        <IconComponent className="w-4 h-4 text-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">
                          {item.value}
                        </div>
                        <div className="text-xs text-white/70">
                          {item.label}
                        </div>
                      </div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: item.color }}
                      >
                        {item.percent}%
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
