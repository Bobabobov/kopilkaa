// components/profile/ProfileAchievements.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AchievementStats as AchievementStatsType } from "@/lib/achievements/types";
import AchievementsModal from "../modals/AchievementsModal";

// Функция для получения иконки по типу и названию достижения
const getAchievementIcon = (type: string, name: string) => {
  // Сначала проверяем по названию для более специфичных иконок
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('первые шаги') || nameLower.includes('первая')) {
    return LucideIcons.Star;
  }
  if (nameLower.includes('помощник') || nameLower.includes('помощь')) {
    return LucideIcons.Users;
  }
  if (nameLower.includes('одобрен') || nameLower.includes('одобрение')) {
    return LucideIcons.CheckCircle;
  }
  if (nameLower.includes('активный') || nameLower.includes('активность')) {
    return LucideIcons.Zap;
  }
  if (nameLower.includes('эксперт') || nameLower.includes('мастер')) {
    return LucideIcons.Star;
  }
  if (nameLower.includes('друг') || nameLower.includes('дружба')) {
    return LucideIcons.Users;
  }
  if (nameLower.includes('игра') || nameLower.includes('игр')) {
    return LucideIcons.Star;
  }
  if (nameLower.includes('серия') || nameLower.includes('серий')) {
    return LucideIcons.Zap;
  }
  if (nameLower.includes('творч') || nameLower.includes('креатив')) {
    return LucideIcons.Palette;
  }
  if (nameLower.includes('сообществ') || nameLower.includes('коммун')) {
    return LucideIcons.Heart;
  }
  
  // Если не найдено по названию, используем тип
  switch (type) {
    case 'APPLICATIONS':
      return LucideIcons.FileText;
    case 'GAMES':
      return LucideIcons.Star;
    case 'SOCIAL':
      return LucideIcons.Users;
    case 'STREAK':
      return LucideIcons.Zap;
    case 'COMMUNITY':
      return LucideIcons.Heart;
    case 'CREATIVITY':
      return LucideIcons.Palette;
    case 'SPECIAL':
      return LucideIcons.Star;
    default:
      return LucideIcons.Trophy;
  }
};

// Функция для получения цвета по редкости
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'COMMON':
      return '#94a1b2';
    case 'RARE':
      return '#abd1c6';
    case 'EPIC':
      return '#e16162';
    case 'LEGENDARY':
      return '#f9bc60';
    case 'EXCLUSIVE':
      return '#ff6b6b';
    default:
      return '#abd1c6';
  }
};

// Функция для получения русского названия редкости
const getRarityName = (rarity: string) => {
  switch (rarity) {
    case 'COMMON':
      return 'Обычное';
    case 'RARE':
      return 'Редкое';
    case 'EPIC':
      return 'Эпическое';
    case 'LEGENDARY':
      return 'Легендарное';
    case 'EXCLUSIVE':
      return 'Эксклюзивное';
    default:
      return 'Неизвестное';
  }
};

interface UserAchievement {
  id: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    type: string;
    isExclusive: boolean;
  };
  unlockedAt: string;
}

export default function ProfileAchievements() {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<AchievementStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/achievements/user")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success) {
          setAchievements(data.data.achievements || []);
          setStats(data.data.stats || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  const displayedAchievements = achievements.slice(0, 2); // Показываем только первые 2

  if (loading) {
    return (
      <div className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-[#abd1c6]/10 rounded-xl"></div>
            <div className="h-20 bg-[#abd1c6]/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // displayedAchievements уже определен выше

  return (
    <motion.div 
      className="bg-gradient-to-br from-[#004643]/40 via-[#004643]/30 to-[#001e1d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#abd1c6]/20 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/5 via-transparent to-[#8B5CF6]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center shadow-lg relative"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <LucideIcons.Award className="text-[#001e1d]" size="lg" />
            {stats && stats.unlockedAchievements > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-white text-xs font-bold">{stats.unlockedAchievements}</span>
              </motion.div>
            )}
          </motion.div>
          <div>
            <motion.h3 
              className="text-xl font-bold text-[#fffffe]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Достижения
            </motion.h3>
