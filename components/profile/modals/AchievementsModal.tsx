"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AchievementCard } from "./AchievementCard";
import { AchievementsHeader } from "./AchievementsHeader";
import { AchievementsStats } from "./AchievementsStats";
import { useAchievementsData } from "./hooks/useAchievementsData";
import {
  getAchievementIcon,
  getRarityColor,
  getRarityName,
} from "./achievementUtils";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({
  isOpen,
  onClose,
}: AchievementsModalProps) {
  const { achievements, allAchievements, stats, loading, error, mounted } =
    useAchievementsData(isOpen);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = originalOverflow;
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Если модалка уже закрыта — ничего не ломаем.
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
          className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] mx-4 flex flex-col custom-scrollbar"
          style={{
            border: "1px solid transparent",
            background:
              "linear-gradient(to right, #004643, #001e1d) border-box, linear-gradient(135deg, #004643, #001e1d) padding-box",
            backgroundClip: "border-box, padding-box",
            boxShadow:
              "0 0 0 1px rgba(171, 209, 198, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <AchievementsHeader
            count={achievements.length}
            stats={stats}
            onClose={onClose}
          />

          {/* Статистика */}
          {stats && (
            <AchievementsStats
              unlocked={stats.unlockedAchievements}
              total={stats.totalAchievements}
              completion={stats.completionPercentage}
            />
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
            ) : allAchievements.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🏆</div>
                <h3 className="text-xl font-bold mb-3 text-[#fffffe]">
                  Нет доступных достижений
                </h3>
                <p className="text-[#abd1c6] mb-6">Достижения появятся позже</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allAchievements.map((progressItem, index) => (
                  <AchievementCard
                    key={progressItem.achievement.id}
                    progressItem={progressItem}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
