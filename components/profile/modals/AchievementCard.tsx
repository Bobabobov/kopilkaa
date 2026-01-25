import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  getAchievementIcon,
  getRarityColor,
  getRarityName,
} from "./achievementUtils";
import type { AchievementProgress } from "./hooks/useAchievementsData";

interface AchievementCardProps {
  progressItem: AchievementProgress;
  index: number;
}

export function AchievementCard({ progressItem, index }: AchievementCardProps) {
  const achievement = progressItem.achievement;
  const isUnlocked = progressItem.isUnlocked;
  const IconComponent =
    getAchievementIcon(achievement.type, achievement.name) || LucideIcons.Star;
  const rarityColor = getRarityColor(achievement.rarity);
  const rarityName = getRarityName(achievement.rarity);

  return (
    <motion.div
      key={achievement.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.02 * index,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`rounded-xl p-4 border transition-all duration-300 ${
        isUnlocked
          ? "bg-gradient-to-r from-[#001e1d]/60 to-[#001e1d]/40 border-[#f9bc60]/30"
          : "bg-[#001e1d]/20 border-[#abd1c6]/10 opacity-60"
      }`}
      style={{
        boxShadow: isUnlocked
          ? "0 0 0 1px rgba(249, 188, 96, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          : "none",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isUnlocked ? "shadow-lg" : "opacity-40"
          }`}
          style={{
            backgroundColor: isUnlocked ? `${rarityColor}20` : "#abd1c6/20",
            color: isUnlocked ? rarityColor : "#abd1c6",
          }}
        >
          <IconComponent size="lg" className="text-current" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className={`text-base font-bold ${isUnlocked ? "text-[#fffffe]" : "text-[#abd1c6]/60"}`}
            >
              {achievement.name}
            </h3>
            {isUnlocked && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${rarityColor}20`,
                  color: rarityColor,
                }}
              >
                {rarityName}
              </span>
            )}
          </div>
          <p
            className={`text-sm mb-2 ${isUnlocked ? "text-[#abd1c6]" : "text-[#abd1c6]/40"}`}
          >
            {achievement.description}
          </p>
          {isUnlocked && progressItem.unlockedAt && (
            <p className="text-xs text-[#94a1b2]">
              Получено:{" "}
              {new Date(progressItem.unlockedAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {!isUnlocked && (
            <p className="text-xs text-[#f9bc60]/60 italic">Заблокировано</p>
          )}
        </div>

        {isUnlocked ? (
          <div className="w-8 h-8 bg-[#f9bc60]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <LucideIcons.Lock className="text-[#abd1c6]/40" size="sm" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
