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

  if (nameLower.includes("первые шаги") || nameLower.includes("первая")) {
    return LucideIcons.Star;
  }
  if (nameLower.includes("помощник") || nameLower.includes("помощь")) {
    return LucideIcons.Users;
  }
  if (nameLower.includes("одобрен") || nameLower.includes("одобрение")) {
    return LucideIcons.CheckCircle;
  }
  if (nameLower.includes("активный") || nameLower.includes("активность")) {
    return LucideIcons.Zap;
  }
  if (nameLower.includes("эксперт") || nameLower.includes("мастер")) {
    return LucideIcons.Star;
  }
  if (nameLower.includes("друг") || nameLower.includes("дружба")) {
    return LucideIcons.Users;
  }
  if (nameLower.includes("игра") || nameLower.includes("игр")) {
    return LucideIcons.Star;
  }
  if (nameLower.includes("серия") || nameLower.includes("серий")) {
    return LucideIcons.Zap;
  }
  if (nameLower.includes("творч") || nameLower.includes("креатив")) {
    return LucideIcons.Palette;
  }
  if (nameLower.includes("сообществ") || nameLower.includes("коммун")) {
    return LucideIcons.Heart;
  }

  // Если не найдено по названию, используем тип
  switch (type) {
    case "APPLICATIONS":
      return LucideIcons.FileText;
    case "GAMES":
      return LucideIcons.Star;
    case "SOCIAL":
      return LucideIcons.Users;
    case "STREAK":
      return LucideIcons.Zap;
    case "COMMUNITY":
      return LucideIcons.Heart;
    case "CREATIVITY":
      return LucideIcons.Palette;
    case "SPECIAL":
      return LucideIcons.Star;
    default:
      return LucideIcons.Trophy;
  }
};

// Функция для получения цвета по редкости
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "COMMON":
      return "#94a1b2";
    case "RARE":
      return "#abd1c6";
    case "EPIC":
      return "#e16162";
    case "LEGENDARY":
      return "#f9bc60";
    case "EXCLUSIVE":
      return "#ff6b6b";
    default:
      return "#abd1c6";
  }
};

// Функция для получения русского названия редкости
const getRarityName = (rarity: string) => {
  switch (rarity) {
    case "COMMON":
      return "Обычное";
    case "RARE":
      return "Редкое";
    case "EPIC":
      return "Эпическое";
    case "LEGENDARY":
      return "Легендарное";
    case "EXCLUSIVE":
      return "Эксклюзивное";
    default:
      return "Неизвестное";
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

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const totalCount = achievements.length;
  const progress =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  const displayedAchievements = achievements.slice(0, 2); // Показываем только первые 2

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg p-4 sm:p-5 md:p-6"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-5 bg-white/10 rounded w-32"></div>
              <div className="h-3 bg-white/5 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-20 bg-white/5 rounded-xl"></div>
            <div className="h-20 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </motion.div>
    );
  }

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

      <div className="relative z-10 p-4 sm:p-5 md:p-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg flex-shrink-0">
              <LucideIcons.Award className="w-5 h-5 text-[#f9bc60]" />
              {stats && stats.unlockedAchievements > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-[#001e1d] shadow-lg">
                  <span className="text-white text-[10px] font-bold">
                    {stats.unlockedAchievements}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white">Достижения</h3>
              {stats && (
                <p className="text-xs text-white/60 mt-0.5">
                  {stats.unlockedAchievements} из {stats.totalAchievements}{" "}
                  разблокировано
                </p>
              )}
            </div>
          </div>

          {stats && (
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-[#f9bc60]">
                {Math.round(stats.completionPercentage)}%
              </div>
              <div className="text-xs text-white/60">прогресс</div>
            </div>
          )}
        </div>

        {!achievements.length ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Award className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">
              Нет достижений
            </p>
            <p className="text-xs text-white/60 px-4">
              Выполняйте задания для получения
            </p>
          </div>
        ) : (
          <>
            {/* Прогресс-бар */}
            {stats && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/60">Прогресс</span>
                  <span className="text-xs font-bold text-[#f9bc60]">
                    {stats.unlockedAchievements}/{stats.totalAchievements}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
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
            <div className="space-y-3 mb-4">
              <AnimatePresence>
                {displayedAchievements.map((userAchievement, index) => {
                  const IconComponent =
                    getAchievementIcon(
                      userAchievement.achievement.type,
                      userAchievement.achievement.name,
                    ) || LucideIcons.Star;
                  const rarityColor = getRarityColor(
                    userAchievement.achievement.rarity,
                  );
                  const rarityName = getRarityName(
                    userAchievement.achievement.rarity,
                  );

                  return (
                    <motion.div
                      key={userAchievement.id}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="group rounded-xl p-3 sm:p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                      style={{ borderColor: rarityColor + "40" }}
                      whileHover={{
                        borderColor: rarityColor + "60",
                        backgroundColor: `${rarityColor}10`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{
                            backgroundColor: rarityColor + "20",
                            color: rarityColor,
                          }}
                        >
                          <IconComponent className="w-5 h-5 text-current" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white text-sm truncate">
                              {userAchievement.achievement.name}
                            </h4>
                            <span
                              className="text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0"
                              style={{
                                backgroundColor: `${rarityColor}20`,
                                color: rarityColor,
                              }}
                            >
                              {rarityName}
                            </span>
                          </div>
                          <p className="text-xs text-white/70 line-clamp-2 mb-1">
                            {userAchievement.achievement.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-white/60">
                            <LucideIcons.Calendar className="w-3 h-3" />
                            <span>
                              {new Date(
                                userAchievement.unlockedAt,
                              ).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Кнопка "Показать все" */}
            {achievements.length > 2 && (
              <motion.button
                onClick={() => (window.location.href = "/achievements")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f9bc60]/40 text-sm font-medium text-white/80 hover:text-[#f9bc60] transition-all flex items-center justify-center gap-2"
              >
                <LucideIcons.Award className="w-4 h-4" />
                <span>Показать все достижения ({achievements.length})</span>
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Модальное окно убрали: переход теперь на страницу /achievements */}
    </motion.div>
  );
}
