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
      <div className="p-6 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#abd1c6]">Загрузка подробной статистики...</p>
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
      transition={{ duration: 0.5 }}
      className="p-6 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-2 bg-[#f9bc60]/20 rounded-lg">
          <LucideIcons.BarChart3 className="w-5 h-5 text-[#f9bc60]" />
        </div>
        <h2 className="text-xl font-bold text-[#fffffe]">Подробная статистика</h2>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity:1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-6 border-b border-[#abd1c6]/20 pb-4"
      >
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon;
          return (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#f9bc60] text-[#001e1d] font-semibold'
                  : 'bg-[#004643]/30 text-[#abd1c6] hover:bg-[#004643]/50'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 bg-[#004643]/20 rounded-xl border border-[#abd1c6]/10"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="w-5 h-5 text-current" />
                      </motion.div>
                      <div>
                        <motion.p
                          className="text-3xl font-bold text-[#fffffe] leading-tight"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          {metric.value}
                        </motion.p>
                        <p className="text-sm text-[#abd1c6] leading-tight whitespace-normal">
                          {metric.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Success Breakdown */}
            {stats.applications.total > 0 && (
              <div className="p-6 bg-[#004643]/20 rounded-2xl border border-[#abd1c6]/10 space-y-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[#abd1c6]/80">Успешность заявок</p>
                    <p className="text-[#fffffe] font-medium">
                      Одобрено {stats.applications.approved} из {stats.applications.total} заявок
                    </p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#f9bc60]">
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
                        className="p-3 rounded-xl bg-[#001e1d]/30 border border-[#abd1c6]/10 flex items-center gap-3"
                      >
                        <div
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${item.color}20`, color: item.color }}
                        >
                          <IconComponent className="w-4 h-4 text-current" />
                        </div>
                        <div>
                          <p className="text-[#fffffe] font-semibold leading-tight">{item.label}</p>
                          <p className="text-sm text-[#abd1c6]">
                            {item.value} · {item.percent}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-[#f9bc60]/10 border border-[#f9bc60]/20 text-sm text-[#f9bc60]">
                  {successHint}
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
                  className="p-6 bg-[#004643]/20 rounded-xl border border-[#abd1c6]/10 hover:bg-[#004643]/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      <IconComponent 
                        className="w-6 h-6 text-current"
                      />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#fffffe]">
                        {item.value}
                      </p>
                      <p className="text-[#abd1c6]">{item.label}</p>
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
                  className="p-6 bg-[#004643]/20 rounded-xl border border-[#abd1c6]/10 hover:bg-[#004643]/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      <IconComponent 
                        className="w-6 h-6 text-current"
                      />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#fffffe]">
                        {item.value}
                      </p>
                      <p className="text-[#abd1c6]">{item.label}</p>
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
                className="p-4 bg-[#004643]/20 rounded-xl border border-[#abd1c6]/10 hover:bg-[#004643]/30 transition-colors"
              >
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}  
                  >
                    <LucideIcons.Award 
                      className="w-6 h-6 text-current"
                    />
                  </div>
                  <p className="text-2xl font-bold text-[#fffffe] mb-1">
                    {item.value}
                  </p>
                  <p className="text-sm text-[#abd1c6]">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}