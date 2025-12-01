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
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Заголовок */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.Award className="text-[#f9bc60]" size="sm" />
              {stats && stats.unlockedAchievements > 0 && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#10B981] rounded-full flex items-center justify-center border border-[#001e1d]">
                  <span className="text-white text-[9px] sm:text-[10px] font-bold">{stats.unlockedAchievements}</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Достижения</h3>
              {stats && (
                <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5 truncate">
                  {stats.unlockedAchievements} из {stats.totalAchievements}
                </p>
              )}
            </div>
          </div>
          
          {stats && (
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-[#f9bc60]">
                {Math.round(stats.completionPercentage)}%
              </div>
              <div className="text-[10px] sm:text-xs text-[#abd1c6]">прогресс</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6">

      {!achievements.length ? (
        <div className="text-center py-8 sm:py-10 md:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <LucideIcons.Star className="text-[#abd1c6]" size="xl" />
          </div>
          <p className="text-sm sm:text-base text-[#abd1c6] font-medium mb-1">Нет достижений</p>
          <p className="text-xs sm:text-sm text-[#abd1c6]/60 px-4">
            Выполняйте задания для получения
          </p>
        </div>
      ) : (
        <>
          {/* Прогресс-бар */}
          {stats && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#abd1c6]/60">Прогресс</span>
                <span className="text-xs font-bold text-[#f9bc60]">
                  {stats.unlockedAchievements}/{stats.totalAchievements}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#001e1d]/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completionPercentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-[#f9bc60] to-[#e8a545] rounded-full"
                />
              </div>
            </div>
          )}

          {/* Список достижений */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 relative z-10">
            <AnimatePresence>
              {displayedAchievements.map((userAchievement, index) => {
                const IconComponent = getAchievementIcon(userAchievement.achievement.type, userAchievement.achievement.name) || LucideIcons.Star;
                const rarityColor = getRarityColor(userAchievement.achievement.rarity);
                const rarityName = getRarityName(userAchievement.achievement.rarity);
                
                return (
                  <motion.div
                    key={userAchievement.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                    className="group bg-[#001e1d]/30 rounded-lg p-3 sm:p-4 border relative overflow-hidden"
                    style={{ borderColor: rarityColor + '30' }}
                    whileHover={{ 
                      borderColor: rarityColor + '50',
                      backgroundColor: `${rarityColor}10`
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: rarityColor + '20',
                          color: rarityColor
                        }}
                      >
                        <IconComponent size="sm" className="text-current" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h4 className="font-semibold text-[#fffffe] text-xs sm:text-sm truncate">
                            {userAchievement.achievement.name}
                          </h4>
                          <span 
                            className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0"
                            style={{ 
                              backgroundColor: `${rarityColor}20`,
                              color: rarityColor
                            }}
                          >
                            {rarityName}
                          </span>
                        </div>
                        <p className="text-xs text-[#abd1c6] line-clamp-2">
                          {userAchievement.achievement.description}
                        </p>
                        <p className="text-xs text-[#abd1c6]/60 mt-1">
                          {new Date(userAchievement.unlockedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Кнопка "Показать все" */}
          {achievements.length > 2 && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 rounded-lg border border-[#f9bc60]/20 text-[#f9bc60] text-xs sm:text-sm font-medium transition-colors"
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <LucideIcons.Award size="sm" />
                <span className="whitespace-nowrap">Показать все {achievements.length} достижений</span>
              </div>
            </button>
          )}
        </>
      )}
      </div>

      {/* Модальное окно */}
      <AchievementsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </motion.div>
  );
}
