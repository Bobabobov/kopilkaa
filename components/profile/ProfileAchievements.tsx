// components/profile/ProfileAchievements.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AchievementStats as AchievementStatsType } from "@/lib/achievements/types";
import AchievementsModal from "./AchievementsModal";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
            <LucideIcons.Star className="text-[#f9bc60]" size="sm" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#fffffe]">
              Достижения
            </h3>
            {stats && (
              <p className="text-sm text-[#abd1c6]">
                {stats.unlockedAchievements} из {stats.totalAchievements}
              </p>
            )}
          </div>
        </div>
        
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-[#f9bc60]">
              {Math.round(stats.completionPercentage)}%
            </div>
            <div className="text-xs text-[#abd1c6]">завершено</div>
          </div>
        )}
      </div>

      {!achievements.length ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <LucideIcons.Star className="text-[#abd1c6]" size="lg" />
          </div>
          <p className="text-[#abd1c6] text-sm mb-2">Пока нет достижений</p>
          <p className="text-[#94a1b2] text-xs">
            Создавайте заявки, играйте в игры и общайтесь с сообществом!
          </p>
        </div>
      ) : (
        <>
          {/* Прогресс-бар */}
          {stats && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#abd1c6] mb-2">
                <span>Прогресс</span>
                <span>{stats.unlockedAchievements}/{stats.totalAchievements}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-[#abd1c6] to-[#f9bc60]"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Сетка достижений */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {displayedAchievements.map((userAchievement, index) => {
              const IconComponent = getAchievementIcon(userAchievement.achievement.type, userAchievement.achievement.name) || LucideIcons.Star;
              const rarityColor = getRarityColor(userAchievement.achievement.rarity);
              const rarityName = getRarityName(userAchievement.achievement.rarity);
              
              return (
                <motion.div
                  key={userAchievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#001e1d]/40 rounded-xl p-4 border border-[#abd1c6]/10 hover:border-[#abd1c6]/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: rarityColor + '20' }}
                    >
                      <IconComponent 
                        size="sm" 
                        style={{ color: rarityColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#fffffe] text-sm">
                          {userAchievement.achievement.name}
                        </h4>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: rarityColor + '20',
                            color: rarityColor 
                          }}
                        >
                          {rarityName}
                        </span>
                      </div>
                      <p className="text-[#abd1c6] text-xs mb-2">
                        {userAchievement.achievement.description}
                      </p>
                      <p className="text-[#94a1b2] text-xs">
                        Получено: {new Date(userAchievement.unlockedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-[#abd1c6] text-lg">✓</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Кнопка "Показать все" */}
          {achievements.length > 2 && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 px-4 bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 rounded-xl text-[#f9bc60] text-sm font-medium transition-colors"
            >
              Показать все ({achievements.length})
            </button>
          )}

        </>
      )}

      {/* Модальное окно со всеми достижениями */}
      <AchievementsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </motion.div>
  );
}
