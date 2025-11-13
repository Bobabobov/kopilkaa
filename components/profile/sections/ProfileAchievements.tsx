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
            {stats && (
              <motion.p 
                className="text-xs text-[#abd1c6]/70"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {stats.unlockedAchievements} из {stats.totalAchievements} разблокировано
              </motion.p>
            )}
          </div>
        </div>
        
        {stats && (
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="text-2xl font-bold text-[#f9bc60]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {Math.round(stats.completionPercentage)}%
            </motion.div>
            <div className="text-xs text-[#abd1c6]/60">прогресс</div>
          </motion.div>
        )}
      </div>

      {!achievements.length ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <LucideIcons.Star className="text-[#abd1c6]" size="xl" />
          </div>
          <p className="text-[#abd1c6] font-medium mb-1">Нет достижений</p>
          <p className="text-sm text-[#abd1c6]/60">
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
          <div className="space-y-3 mb-4 relative z-10">
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
                    className="group bg-gradient-to-r from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl p-4 border relative overflow-hidden"
                    style={{ borderColor: rarityColor + '30' }}
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: rarityColor + '60',
                      backgroundColor: `${rarityColor}10`
                    }}
                  >
                    {/* Glow effect на hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 rounded-xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${rarityColor}20, transparent, ${rarityColor}10)`
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <motion.div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                        style={{ 
                          backgroundColor: rarityColor + '25',
                          color: rarityColor
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          boxShadow: `0 8px 20px ${rarityColor}40`
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <IconComponent size="lg" className="text-current relative z-10" />
                        
                        {/* Particle effect для редких достижений */}
                        {userAchievement.achievement.rarity === 'LEGENDARY' && (
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            animate={{ 
                              boxShadow: [
                                `0 0 0 0 ${rarityColor}40`,
                                `0 0 0 8px ${rarityColor}00`,
                                `0 0 0 0 ${rarityColor}40`
                              ]
                            }}
                            transition={{ 
                              repeat: Infinity,
                              duration: 2
                            }}
                          />
                        )}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <motion.h4 
                            className="font-bold text-[#fffffe] text-sm"
                            whileHover={{ color: rarityColor }}
                          >
                            {userAchievement.achievement.name}
                          </motion.h4>
                          <motion.span 
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${rarityColor}20`,
                              color: rarityColor
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {rarityName}
                          </motion.span>
                        </div>
                        <p className="text-xs text-[#abd1c6] line-clamp-2 group-hover:text-[#fffffe] transition-colors">
                          {userAchievement.achievement.description}
                        </p>
                        <p className="text-xs text-[#abd1c6]/60 mt-1">
                          Получено: {new Date(userAchievement.unlockedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      
                      {/* Chevron icon */}
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 2 }}
                      >
                        <LucideIcons.ChevronRight 
                          size="sm" 
                          className="text-[#abd1c6]"
                          style={{ color: rarityColor }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Кнопка "Показать все" */}
          {achievements.length > 2 && (
            <motion.button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#f9bc60]/10 to-[#f9bc60]/5 hover:from-[#f9bc60]/20 hover:to-[#f9bc60]/10 rounded-xl border border-[#f9bc60]/20 text-[#f9bc60] text-sm font-semibold transition-all duration-200 hover:border-[#f9bc60]/40 relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f9bc60]/0 via-[#f9bc60]/10 to-[#f9bc60]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center justify-center gap-2 relative z-10">
                <LucideIcons.Award size="sm" />
                <span>Показать все {achievements.length} достижений</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <LucideIcons.ArrowRight size="sm" />
                </motion.div>
              </div>
            </motion.button>
          )}
        </>
      )}

      {/* Модальное окно */}
      <AchievementsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </motion.div>
  );
}
