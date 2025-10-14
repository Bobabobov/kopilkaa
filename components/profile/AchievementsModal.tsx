"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";

interface AchievementData {
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

interface AchievementStats {
  unlockedAchievements: number;
  totalAchievements: number;
  completionPercentage: number;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    case 'SPECIAL':
      return LucideIcons.Star;
    case 'COMMUNITY':
      return LucideIcons.Heart;
    case 'CREATIVITY':
      return LucideIcons.Palette;
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

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Автоскрытие скроллбаров
  useAutoHideScrollbar();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      fetch("/api/achievements/user")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.success) {
            setAchievements(data.data.achievements || []);
            setStats(data.data.stats || null);
          }
        })
        .catch(() => setError("Ошибка загрузки достижений"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, mounted]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="achievements-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="achievements-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] border border-[#abd1c6]/30 mx-4 flex flex-col custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center">
                  <LucideIcons.Trophy size="lg" className="text-[#001e1d]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffffe]">
                    Все достижения
                  </h2>
                  <p className="text-[#abd1c6]">
                    {achievements.length}{" "}
                    {achievements.length === 1
                      ? "достижение"
                      : achievements.length < 5
                        ? "достижения"
                        : "достижений"}
                    {stats && (
                      <span className="ml-2">
                        • {stats.unlockedAchievements} из {stats.totalAchievements} получено
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <LucideIcons.X size="sm" className="text-[#fffffe]" />
              </button>
            </div>
          </div>

          {/* Статистика */}
          {stats && (
            <div className="px-6 py-4 border-b border-[#abd1c6]/20 bg-[#abd1c6]/5">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#f9bc60] mb-1">{stats.unlockedAchievements}</div>
                  <div className="text-sm text-[#abd1c6]">Получено</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#abd1c6] mb-1">{stats.totalAchievements}</div>
                  <div className="text-sm text-[#abd1c6]">Всего</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#e16162] mb-1">{Math.round(stats.completionPercentage)}%</div>
                  <div className="text-sm text-[#abd1c6]">Прогресс</div>
                </div>
              </div>
            </div>
          )}

          {/* Контент */}
          <div className="overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9bc60] mx-auto mb-4"></div>
                <p className="text-[#abd1c6]">Загрузка достижений...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 text-[#f9bc60]">⚠️</div>
                <h3 className="text-xl font-bold mb-2 text-[#fffffe]">
                  Ошибка загрузки
                </h3>
                <p className="text-[#abd1c6]">{error}</p>
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🏆</div>
                <h3 className="text-xl font-bold mb-3 text-[#fffffe]">
                  Пока нет достижений
                </h3>
                <p className="text-[#abd1c6] mb-6">
                  Создавайте заявки, играйте в игры и общайтесь с сообществом
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map((userAchievement, index) => {
                  const IconComponent = getAchievementIcon(userAchievement.achievement.type, userAchievement.achievement.name) || LucideIcons.Star;
                  const rarityColor = getRarityColor(userAchievement.achievement.rarity);
                  const rarityName = getRarityName(userAchievement.achievement.rarity);
                  
                  return (
                    <motion.div
                      key={userAchievement.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.02 * index,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="bg-[#abd1c6]/10 border border-[#abd1c6]/20 rounded-xl p-4 hover:bg-[#abd1c6]/15 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Иконка достижения */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                          style={{ 
                            backgroundColor: rarityColor + '20'
                          }}
                        >
                          <IconComponent 
                            size="lg" 
                            style={{ color: rarityColor }}
                          />
                        </div>
                        
                        {/* Информация о достижении */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-[#fffffe]">
                              {userAchievement.achievement.name}
                            </h3>
                            <span 
                              className="text-xs px-3 py-1 rounded-full font-medium"
                              style={{
                                backgroundColor: rarityColor + '20',
                                color: rarityColor
                              }}
                            >
                              {rarityName}
                            </span>
                          </div>
                          <p className="text-[#abd1c6] mb-2">
                            {userAchievement.achievement.description}
                          </p>
                          <p className="text-[#94a1b2] text-sm">
                            Получено: {new Date(userAchievement.unlockedAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        {/* Галочка */}
                        <div className="w-8 h-8 bg-[#abd1c6]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <LucideIcons.Check className="text-[#abd1c6]" size="sm" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
