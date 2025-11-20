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
      <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[180px]">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-[#abd1c6]/20 rounded w-32" />
          <div className="h-4 bg-[#abd1c6]/10 rounded w-24" />
          <div className="grid grid-cols-1 gap-2">
            <div className="h-10 bg-[#abd1c6]/10 rounded-xl" />
            <div className="h-10 bg-[#abd1c6]/10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#004643]/40 via-[#004643]/30 to-[#001e1d]/40 backdrop-blur-xl rounded-2xl p-5 border border-[#abd1c6]/20 overflow-hidden relative min-h-[180px] flex flex-col"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center shadow-md">
            <LucideIcons.Award size="sm" className="text-[#001e1d]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#fffffe]">
              Достижения
            </h3>
            {stats && (
              <p className="text-[11px] text-[#abd1c6]/70">
                {stats.unlockedAchievements} из {stats.totalAchievements} разблокировано
              </p>
            )}
          </div>
        </div>
      </div>

      {!achievements.length ? (
        <div className="py-6 text-center text-sm text-[#abd1c6]">
          У пользователя пока нет достижений.
        </div>
      ) : (
        <>
          <div className="space-y-2 flex-1">
            {displayedAchievements.map((ua) => (
              <div
                key={ua.id}
                className="flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/25"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#f9bc60]/15 flex items-center justify-center text-xs">
                    <LucideIcons.Star size="xs" className="text-[#f9bc60]" />
                  </div>
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
              </div>
            ))}
          </div>

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
    </motion.div>
  );
}


