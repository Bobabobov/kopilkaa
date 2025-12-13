// components/profile/other-user/OtherUserAchievements.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { AchievementStats as AchievementStatsType } from "@/lib/achievements/types";
import OtherUserAchievementsModal from "./OtherUserAchievementsModal";
import { AchievementsTimeline } from "./widgets/AchievementsTimeline";

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
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[250px]">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
          <div className="h-12 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[250px]"
    >
      {/* Улучшенный заголовок */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-[#f9bc60] via-[#e8a545] to-[#f9bc60] rounded-xl flex items-center justify-center shadow-lg shadow-[#f9bc60]/30"
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
            <LucideIcons.Award size="sm" className="text-[#001e1d]" />
          </motion.div>
          <div>
            <h3 className="text-base font-bold text-[#fffffe] bg-gradient-to-r from-[#fffffe] to-[#f9bc60] bg-clip-text text-transparent">
              Достижения
            </h3>
            {stats && (
              <p className="text-[11px] text-[#abd1c6] font-medium">
                <span className="text-[#f9bc60] font-bold">{stats.unlockedAchievements}</span> из <span className="text-[#abd1c6]">{stats.totalAchievements}</span> разблокировано
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {!achievements.length ? (
        <div className="py-6 text-center text-sm text-[#abd1c6]">
          У пользователя пока нет достижений.
        </div>
      ) : (
        <>
          <div className="space-y-2 flex-1">
            {displayedAchievements.map((ua, index) => (
              <motion.div
                key={ua.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#001e1d]/50 to-[#001e1d]/30 border border-[#abd1c6]/30 hover:border-[#f9bc60]/50 transition-all hover:shadow-lg hover:shadow-[#f9bc60]/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div 
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f9bc60]/30 to-[#e8a545]/20 flex items-center justify-center shadow-md"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <LucideIcons.Star size="xs" className="text-[#f9bc60]" />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#fffffe]">
                      {ua.achievement.name}
                    </p>
                    <p className="text-[11px] text-[#abd1c6]/70 truncate">
                      {new Date(ua.unlockedAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[#f9bc60] font-semibold">
                  {getRarityName(ua.achievement.rarity)}
                </span>
              </motion.div>
            ))}
          </div>

          <AchievementsTimeline
            achievements={achievements.map((ua) => ({
              id: ua.id,
              title: ua.achievement.name,
              date: new Date(ua.unlockedAt).toLocaleDateString("ru-RU"),
              rarity: getRarityName(ua.achievement.rarity),
            }))}
          />

          {achievements.length > 3 && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-3 w-full text-[11px] text-[#abd1c6]/80 hover:text-[#f9bc60] underline underline-offset-4 text-center"
            >
              Показать все достижения ({achievements.length})
            </button>
          )}

          <OtherUserAchievementsModal
            userId={userId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}


