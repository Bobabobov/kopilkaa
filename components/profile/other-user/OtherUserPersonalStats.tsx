"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  getTrustLabel,
  getTrustLevelFromApprovedCount,
  getTrustLimits,
} from "@/lib/trustLevel";

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

const getRussianPlural = (
  count: number,
  forms: [string, string, string],
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (
    mod10 >= 2 &&
    mod10 <= 4 &&
    (mod100 < 10 || mod100 >= 20)
  )
    return forms[1];
  return forms[2];
};

interface OtherUserPersonalStatsProps {
  userId: string;
}

export default function OtherUserPersonalStats({ userId }: OtherUserPersonalStatsProps) {
  const [data, setData] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'social' | 'achievements'>('overview');

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/detailed-stats`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        
        if (result.detailedStats) {
          setData(result.detailedStats);
        } else {
          throw new Error('No detailed stats in response');
        }
      } catch (error) {
        console.error('Error fetching detailed stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load stats');
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
      activity: data.activity,
      achievements: data.achievements,
      user: data.user,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[400px]">
        <div className="animate-pulse space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-3 sm:pb-4 border-b border-[#abd1c6]/10">
            <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
            <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
            <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-24"></div>
            <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-28"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
          <div className="h-32 bg-[#abd1c6]/10 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
        <div className="text-center py-8">
          <LucideIcons.AlertTriangle className="text-red-400 mx-auto mb-2" size="lg" />
          <p className="text-sm text-[#abd1c6]">{error}</p>
        </div>
      </div>
    );
  }

  if (!calculatedStats) {
    return null;
  }

  const stats = calculatedStats;
  const approvedPercent = stats.applications.total > 0
    ? Math.round((stats.applications.approved / stats.applications.total) * 100)
    : 0;
  const pendingPercent = stats.applications.total > 0
    ? Math.round((stats.applications.pending / stats.applications.total) * 100)
    : 0;
  const rejectedPercent = stats.applications.total > 0
    ? Math.round((stats.applications.rejected / stats.applications.total) * 100)
    : 0;

  const friendsLabel = getRussianPlural(stats.activity.friendsCount, [
    "друг",
    "друга",
    "друзей",
  ]);
  const achievementsLabel = getRussianPlural(stats.achievements.total, [
    "достижение",
    "достижения",
    "достижений",
  ]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: LucideIcons.LayoutGrid },
    { id: 'applications' as const, label: 'Заявки', icon: LucideIcons.FileText },
    { id: 'social' as const, label: 'Социальное', icon: LucideIcons.Users },
    { id: 'achievements' as const, label: 'Достижения', icon: LucideIcons.Award },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6"
    >
      {/* Улучшенный заголовок */}
      <motion.div 
        className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#f9bc60]/30"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <LucideIcons.BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#001e1d]" />
        </motion.div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#fffffe] bg-gradient-to-r from-[#fffffe] to-[#f9bc60] bg-clip-text text-transparent">
            Подробная статистика
          </h2>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6 border-b border-[#abd1c6]/10 pb-3 sm:pb-4 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#f9bc60] text-[#001e1d]'
                  : 'text-[#abd1c6] hover:bg-[#001e1d]/30'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {[
                {
                  label: 'Всего заявок',
                  value: stats.applications.total,
                  icon: LucideIcons.FileText,
                  color: '#3B82F6'
                },
                {
                  label: 'Одобрено',
                  value: stats.applications.approved,
                  icon: LucideIcons.CheckCircle2,
                  color: '#10B981'
                },
                {
                  label: friendsLabel,
                  value: stats.activity.friendsCount,
                  icon: LucideIcons.Users,
                  color: '#8B5CF6'
                },
                {
                  label: achievementsLabel,
                  value: stats.achievements.total,
                  icon: LucideIcons.Award,
                  color: '#F59E0B'
                },
                {
                  label: 'Уровень доверия',
                  value: getTrustLabel(getTrustLevelFromApprovedCount(stats.applications.approved)),
                  subLabel: (() => {
                    const limits = getTrustLimits(getTrustLevelFromApprovedCount(stats.applications.approved));
                    return `от ${limits.min.toLocaleString('ru-RU')} до ${limits.max.toLocaleString('ru-RU')} ₽`;
                  })(),
                  icon: LucideIcons.Shield,
                  color: '#22A699'
                }
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-3 sm:p-4 bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all hover:shadow-lg hover:shadow-[#f9bc60]/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                      <motion.div
                        className="p-2 sm:p-2.5 rounded-xl shadow-md"
                        style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
                      </motion.div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-[#fffffe] leading-tight">
                          {metric.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#abd1c6] leading-tight whitespace-normal mt-0.5">
                          {metric.label}
                        </p>
                        {metric.subLabel && (
                          <p className="text-[10px] sm:text-xs text-[#8fb7aa] leading-tight whitespace-normal mt-0.5">
                            {metric.subLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Success Breakdown */}
            {stats.applications.total > 0 && (
              <div className="p-4 sm:p-5 md:p-6 bg-[#001e1d]/30 rounded-xl border border-[#abd1c6]/10 space-y-3 sm:space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-[#abd1c6] mb-1">Успешность заявок</p>
                    <p className="text-[#fffffe] font-medium text-xs sm:text-sm">
                      Одобрено {stats.applications.approved} из {stats.applications.total} заявок
                    </p>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#f9bc60]">
                    {approvedPercent}%
                  </div>
                </div>

                <div className="w-full bg-[#001e1d]/40 rounded-full h-4 overflow-hidden">
                  <div className="flex h-full">
                    <span
                      className="bg-[#10B981] transition-all duration-500"
                      style={{ width: `${approvedPercent}%` }}
                    />
                    <span
                      className="bg-[#F97316]/70 transition-all duration-500"
                      style={{ width: `${pendingPercent}%` }}
                    />
                    <span
                      className="bg-[#EF4444]/80 transition-all duration-500"
                      style={{ width: `${rejectedPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 sm:p-3 bg-[#001e1d]/20 rounded-lg"
                      >
                        <div
                          className="p-1.5 rounded-lg"
                          style={{ backgroundColor: `${item.color}20`, color: item.color }}
                        >
                          <IconComponent className="w-4 h-4 text-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-[#fffffe]">
                            {item.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-[#abd1c6]">
                            {item.label}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-bold" style={{ color: item.color }}>
                          {item.percent}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Всего', value: stats.applications.total, color: '#3B82F6' },
                { label: 'Одобрено', value: stats.applications.approved, color: '#10B981' },
                { label: 'В ожидании', value: stats.applications.pending, color: '#F97316' },
                { label: 'Отклонено', value: stats.applications.rejected, color: '#EF4444' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10 text-center"
                >
                  <div className="text-lg sm:text-xl font-bold text-[#fffffe] mb-1" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#abd1c6]">{item.label}</div>
                </div>
              ))}
            </div>
            {stats.applications.totalAmount > 0 && (
              <div className="p-4 bg-[#001e1d]/30 rounded-xl border border-[#abd1c6]/10">
                <div className="text-sm text-[#abd1c6] mb-2">Общая сумма заявок</div>
                <div className="text-2xl font-bold text-[#f9bc60]">
                  {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(stats.applications.totalAmount)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Друзей', value: stats.activity.friendsCount, icon: LucideIcons.Users, color: '#8B5CF6' },
                { label: 'Лайков поставлено', value: stats.activity.likesGiven, icon: LucideIcons.Heart, color: '#E91E63' },
                { label: 'Лайков получено', value: stats.activity.likesReceived, icon: LucideIcons.Heart, color: '#E91E63' },
                { label: 'Дней на платформе', value: stats.activity.daysActive, icon: LucideIcons.Calendar, color: '#F59E0B' },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10"
                  >
                    <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                      <div
                        className="p-1.5 sm:p-2 rounded-lg"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-[#fffffe] leading-tight">
                          {item.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#abd1c6] leading-tight whitespace-normal mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Всего', value: stats.achievements.total, color: '#94a1b2' },
                { label: 'Обычных', value: stats.achievements.common, color: '#94a1b2' },
                { label: 'Редких', value: stats.achievements.rare, color: '#abd1c6' },
                { label: 'Эпических', value: stats.achievements.epic, color: '#e16162' },
                { label: 'Легендарных', value: stats.achievements.legendary, color: '#f9bc60' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10 text-center"
                >
                  <div className="text-lg sm:text-xl font-bold text-[#fffffe] mb-1" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#abd1c6]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

