// components/profile/other-user/OtherUserAchievementsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { AchievementStats as AchievementStatsType } from "@/lib/achievements/types";

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

interface OtherUserAchievementsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
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

export default function OtherUserAchievementsModal({
  userId,
  isOpen,
  onClose,
}: OtherUserAchievementsModalProps) {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<AchievementStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;

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
  }, [userId, isOpen, mounted]);

  // Escape для закрытия
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        key="other-user-achievements-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          key="other-user-achievements-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="max-w-3xl w-full max-h-[80vh] rounded-3xl bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] border border-[#abd1c6]/30 shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#abd1c6]/25">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#f9bc60] rounded-xl flex items-center justify-center text-sm text-[#001e1d]">
                <LucideIcons.Trophy size="sm" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#fffffe]">
                  Достижения пользователя
                </h2>
                {stats && (
                  <p className="text-xs text-[#abd1c6]/80">
                    {stats.unlockedAchievements} из {stats.totalAchievements}{" "}
                    разблокировано
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#001e1d]/40 hover:bg-[#001e1d]/60 flex items-center justify-center text-[#abd1c6] transition-colors"
            >
              <LucideIcons.X size="sm" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/20 animate-pulse"
                  />
                ))}
              </div>
            ) : achievements.length === 0 ? (
              <p className="text-sm text-[#abd1c6] text-center py-6">
                У пользователя пока нет достижений.
              </p>
            ) : (
              achievements.map((ua) => (
                <div
                  key={ua.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#f9bc60]/15 flex items-center justify-center text-xs">
                      <LucideIcons.Star size="sm" className="text-[#f9bc60]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#fffffe]">
                        {ua.achievement.name}
                      </p>
                      <p className="text-[11px] text-[#abd1c6]/75 truncate">
                        {ua.achievement.description}
                      </p>
                      <p className="text-[11px] text-[#abd1c6]/60 mt-0.5">
                        Получено:{" "}
                        {new Date(ua.unlockedAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-[#f9bc60]">
                    {getRarityName(ua.achievement.rarity)}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
