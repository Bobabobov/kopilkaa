// components/profile/other-user/OtherUserAchievements.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { AchievementStats as AchievementStatsType } from "@/lib/achievements/types";
import OtherUserAchievementsModal from "./OtherUserAchievementsModal";

interface UserAchievement {
  id: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    rarity: string;
    type: string;
  };
  unlockedAt: string;
}

interface OtherUserAchievementsProps {
  userId: string;
}

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
      return rarity;
  }
};

export default function OtherUserAchievements({ userId }: OtherUserAchievementsProps) {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<AchievementStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/achievements`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled && data?.success) {
          setAchievements(data.data.achievements || []);
          setStats(data.data.stats || null);
        }
      } catch (err) {
        console.error("Error loading other user achievements:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const displayedAchievements = achievements.slice(0, 3);

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
            <div className="h-16 bg-white/5 rounded-xl"></div>
            <div className="h-16 bg-white/5 rounded-xl"></div>
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg">
            <LucideIcons.Award className="w-5 h-5 text-[#f9bc60]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Достижения</h3>
            {stats && (
              <p className="text-xs text-white/60 mt-0.5">
                {stats.unlockedAchievements} из {stats.totalAchievements} разблокировано
              </p>
            )}
          </div>
        </div>

        {!achievements.length ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Award className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">Нет достижений</p>
            <p className="text-xs text-white/60">У пользователя пока нет достижений</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {displayedAchievements.map((ua, index) => {
                const rarityColor = ua.achievement.rarity === 'COMMON' ? '#94a1b2' :
                  ua.achievement.rarity === 'RARE' ? '#abd1c6' :
                  ua.achievement.rarity === 'EPIC' ? '#e16162' :
                  ua.achievement.rarity === 'LEGENDARY' ? '#f9bc60' : '#ff6b6b';
                
                return (
                  <motion.div
                    key={ua.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{ 
                        backgroundColor: rarityColor + '20',
                        color: rarityColor
                      }}
                    >
                      <LucideIcons.Star className="w-5 h-5 text-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {ua.achievement.name}
                        </p>
                        <span 
                          className="text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0"
                          style={{ 
                            backgroundColor: rarityColor + '20',
                            color: rarityColor
                          }}
                        >
                          {getRarityName(ua.achievement.rarity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <LucideIcons.Calendar className="w-3 h-3" />
                        <span>{new Date(ua.unlockedAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {achievements.length > 3 && (
              <motion.button
                type="button"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f9bc60]/40 text-sm font-medium text-white/80 hover:text-[#f9bc60] transition-all flex items-center justify-center gap-2"
              >
                <span>Показать все достижения ({achievements.length})</span>
                <LucideIcons.ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            <OtherUserAchievementsModal
              userId={userId}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}


