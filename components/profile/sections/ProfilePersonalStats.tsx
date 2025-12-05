"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface DetailedStats {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    approvalRate: number;
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

export default function ProfilePersonalStats() {
  const [data, setData] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'social' | 'achievements'>('overview');

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        const response = await fetch('/api/profile/detailed-stats', {
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
  }, []);

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
          <LucideIcons.AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">Ошибка загрузки: {error}</p>
        </div>
      </div>
    );
  }

  if (!calculatedStats) return null;

  const stats = calculatedStats;
  const achievementsLabel = getRussianPlural(stats.achievements.total, [
    "Достижение",
    "Достижения",
    "Достижений",
  ]);
  const friendsLabel = getRussianPlural(stats.activity.friendsCount, [
    "Друг",
    "Друга",
    "Друзей",
  ]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: LucideIcons.PieChart },
    { id: 'applications' as const, label: 'Заявки', icon: LucideIcons.FileText },
    { id: 'social' as const, label: 'Социальное', icon: LucideIcons.Users },
    { id: 'achievements' as const, label: 'Достижения', icon: LucideIcons.Award },
  ];

  const totalApplications = stats.applications.total || 0;
  const approvedPercent = totalApplications
    ? Math.round((stats.applications.approved / totalApplications) * 100)
    : 0;
  const rejectedPercent = totalApplications
    ? Math.round((stats.applications.rejected / totalApplications) * 100)
    : 0;
  const pendingPercent = Math.max(0, 100 - approvedPercent - rejectedPercent);

  const successHint = (() => {
    if (totalApplications === 0) {
      return "Создайте первую заявку и проверьте, как быстро её увидит админ.";
    }

    if (totalApplications < 3) {
      return stats.applications.approved === totalApplications
        ? "Все ваши заявки одобрены — отличный старт!"
        : "Пока мало данных, но каждая подробная история повышает шанс на одобрение.";
    }

    // Используем локально вычисленный процент одобренных заявок,
    // чтобы избежать возможных расхождений в серверной статистике.
    if (approvedPercent >= 80) {
      return "Отличный результат: большинство ваших заявок одобряют. Продолжайте в том же духе!";
    }

    if (approvedPercent >= 60) {
      return "Хороший уровень одобрения. Ещё немного точнее формулируйте цель и сумму — и процент станет ещё выше.";
    }

    if (approvedPercent >= 40) {
      return "Есть куда расти. Попробуйте подробнее описывать цель и прикладывать доказательства — это повышает шанс одобрения.";
    }

    return "Почти все заявки отклоняются. Проверьте правила, уточните сумму и покажите, зачем именно нужны деньги.";
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 relative overflow-hidden"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#f9bc60]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#e16162]/10 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <LucideIcons.BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#f9bc60]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#fffffe]">Подробная статистика</h2>
        </div>
      </div>

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
          className="space-y-6"
        >
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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
                }
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10"
                  >
                    <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                      <div
                        className="p-1.5 sm:p-2 rounded-lg"
                        style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-[#fffffe] leading-tight">
                          {metric.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#abd1c6] leading-tight whitespace-normal mt-0.5">
                          {metric.label}
                        </p>
                      </div>
                    </div>
                  </div>
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
                      color: "#F59E0B",
                      icon: LucideIcons.Clock,
                    },
                    {
                      label: "Отклонено",
                      value: stats.applications.rejected,
                      percent: rejectedPercent,
                      color: "#EF4444",
                      icon: LucideIcons.XCircle,
                    },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="p-3 rounded-lg bg-[#001e1d]/20 border border-[#abd1c6]/10 flex items-center gap-2"
                      >
                        <div
                          className="p-1.5 rounded-lg"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          <IconComponent className="w-3.5 h-3.5 text-current" />
                        </div>
                        <div>
                          <p className="text-[#fffffe] font-medium text-xs leading-tight">{item.label}</p>
                          <p className="text-xs text-[#abd1c6]">
                            {item.value} · {item.percent}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-[#f9bc60]/10 rounded-lg border border-[#f9bc60]/20 text-xs text-[#f9bc60]">
                  <div className="flex items-start gap-2">
                    <LucideIcons.Lightbulb className="text-[#f9bc60] flex-shrink-0 mt-0.5" size="sm" />
                    <p>{successHint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                label: 'Ожидают', 
                value: stats.applications.pending, 
                color: '#F59E0B',
                icon: LucideIcons.Clock
              },
              { 
                label: 'Одобрено', 
                value: stats.applications.approved, 
                color: '#10B981',
                icon: LucideIcons.CheckCircle2
              },
              { 
                label: 'Отклонено', 
                value: stats.applications.rejected, 
                color: '#EF4444',
                icon: LucideIcons.XCircle
              },
              { 
                label: 'Общая сумма', 
                value: `₽${stats.applications.totalAmount}`, 
                color: '#3B82F6',
                icon: LucideIcons.DollarSign
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <IconComponent 
                        className="w-5 h-5 text-current"
                      />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#fffffe]">
                        {item.value}
                      </p>
                      <p className="text-xs text-[#abd1c6]">{item.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                label: 'Лайков поставлено', 
                value: stats.activity.likesGiven, 
                color: '#EF4444',
                icon: LucideIcons.ThumbsUp
              },
              { 
                label: 'Лайков получено', 
                value: stats.activity.likesReceived, 
                color: '#10B981',
                icon: LucideIcons.Heart
              },
              { 
                label: 'Количество друзей', 
                value: stats.activity.friendsCount, 
                color: '#8B5CF6',
                icon: LucideIcons.Users
              },
              { 
                label: 'Дней активности', 
                value: stats.activity.daysActive, 
                color: '#F59E0B',
                icon: LucideIcons.Calendar
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <IconComponent 
                        className="w-5 h-5 text-current"
                      />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#fffffe]">
                        {item.value}
                      </p>
                      <p className="text-xs text-[#abd1c6]">{item.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Обычные', 
                value: stats.achievements.common, 
                color: '#6B7280',
                rarity: 'COMMON'
              },
              { 
                label: 'Редкие', 
                value: stats.achievements.rare, 
                color: '#3B82F6',
                rarity: 'RARE'
              },
              { 
                label: 'Эпические', 
                value: stats.achievements.epic, 
                color: '#8B5CF6',
                rarity: 'EPIC'
              },
              { 
                label: 'Легендарные', 
                value: stats.achievements.legendary, 
                color: '#F59E0B',
                rarity: 'LEGENDARY'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10 text-center"
              >
                <div 
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}  
                >
                  <LucideIcons.Award 
                    className="w-5 h-5 text-current"
                  />
                </div>
                <p className="text-xl font-bold text-[#fffffe] mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-[#abd1c6]">{item.label}</p>
              </div>
            ))}
          </div>
        )}
        </motion.div>
      </AnimatePresence>
      </div>
    </motion.div>
  );
}