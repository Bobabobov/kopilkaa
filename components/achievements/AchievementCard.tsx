// components/achievements/AchievementCard.tsx
"use client";

import { Achievement, UserAchievement } from "@/lib/achievements/types";
import {
  RARITY_COLORS,
  RARITY_NAMES,
  type AchievementRarity,
} from "@/lib/achievements/types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { motion } from "framer-motion";

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  showProgress?: boolean;
  progress?: number;
  maxProgress?: number;
  current?: number;
  target?: number;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

export function AchievementCard({
  achievement,
  userAchievement,
  showProgress = false,
  progress = 0,
  maxProgress = 1,
  current,
  target,
  onClick,
  className = "",
  interactive = true,
}: AchievementCardProps) {
  const isUnlocked = !!userAchievement;
  const effectiveCurrent = current ?? progress;
  const effectiveTarget = target ?? maxProgress;
  const progressPercentage =
    effectiveTarget > 0 ? (effectiveCurrent / effectiveTarget) * 100 : 0;

  const IconComponent =
    LucideIcons[achievement.icon as keyof typeof LucideIcons] ||
    LucideIcons.Star;

  const getShortRarityName = (rarity: string) =>
    RARITY_NAMES[rarity as AchievementRarity] || rarity;

  const rarityTheme: Record<
    string,
    { bg: string; glow: string; pill: string; accent: string; border: string }
  > = {
    COMMON: {
      bg: "linear-gradient(145deg, #0d1c1a 0%, #0b1816 50%, #091311 100%)",
      glow: "0 18px 42px rgba(148,161,178,0.22)",
      pill: "#94a1b2",
      accent: "#cdd5df",
      border: "rgba(148,161,178,0.35)",
    },
    RARE: {
      bg: "linear-gradient(145deg, #0e2e2a 0%, #0a2421 50%, #081c19 100%)",
      glow: "0 20px 46px rgba(171,209,198,0.3)",
      pill: "#abd1c6",
      accent: "#d5efe7",
      border: "rgba(171,209,198,0.4)",
    },
    EPIC: {
      bg: "linear-gradient(145deg, #2b1316 0%, #1f0c0f 50%, #16090b 100%)",
      glow: "0 20px 50px rgba(225,97,98,0.38)",
      pill: "#e16162",
      accent: "#f3b0b0",
      border: "rgba(225,97,98,0.45)",
    },
    LEGENDARY: {
      bg: "linear-gradient(145deg, #2d230f 0%, #1f180c 50%, #161009 100%)",
      glow: "0 22px 54px rgba(249,188,96,0.42)",
      pill: "#f9bc60",
      accent: "#ffe7b3",
      border: "rgba(249,188,96,0.5)",
    },
    EXCLUSIVE: {
      bg: "linear-gradient(145deg, #0c1929 0%, #0c1e2b 45%, #0a1018 100%)",
      glow: "0 22px 58px rgba(152, 231, 255, 0.35)",
      pill: "#9de1ff",
      accent: "#f6c177",
      border: "rgba(157,225,255,0.45)",
    },
  };

  const currentTheme = rarityTheme[achievement.rarity] || rarityTheme.COMMON;
  const borderColor = isUnlocked
    ? currentTheme.border
    : "rgba(255,255,255,0.14)";
  const lockedOverlay = !isUnlocked
    ? 'after:content-[\" \"] after:absolute after:inset-0 after:bg-[#040808]/45 after:backdrop-blur-[1px] after:pointer-events-none'
    : "";

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.01, translateY: -4 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      className={`relative overflow-hidden rounded-[24px] p-6 transition-all duration-400 shadow-[0_24px_70px_rgba(0,0,0,0.42)] border ${interactive ? "cursor-pointer" : "cursor-default"} ${lockedOverlay} ${className}`}
      onClick={interactive ? onClick : undefined}
      style={{
        background: currentTheme.bg,
        borderColor,
        boxShadow: currentTheme.glow,
        borderWidth: "1px",
      }}
    >
      {/* Световые прожилки */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-12 -top-10 w-56 h-56 bg-white/6 blur-3xl rounded-full" />
        <div className="absolute right-[-18%] top-1/3 w-72 h-72 bg-white/5 blur-3xl rounded-full" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(120% 120% at 10% 20%, ${RARITY_COLORS[achievement.rarity]}25 0%, transparent 45%)`,
          }}
        />
      </div>

      {/* Холо-полоска */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${RARITY_COLORS[achievement.rarity]}55 25%, ${currentTheme.pill} 50%, ${RARITY_COLORS[achievement.rarity]}55 75%, transparent 100%)`,
        }}
      />

      <div className="flex flex-col gap-5 relative z-10">
        {/* Шапка */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="min-w-[64px] min-h-[64px] w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                color: isUnlocked ? currentTheme.accent : "#7f8b88",
                border: `1px solid ${RARITY_COLORS[achievement.rarity]}35`,
                boxShadow: isUnlocked
                  ? `0 16px 30px ${RARITY_COLORS[achievement.rarity]}35`
                  : `0 12px 22px rgba(0,0,0,0.28)`,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                filter: isUnlocked ? "none" : "grayscale(0.2)",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${RARITY_COLORS[achievement.rarity]}60 0%, transparent 55%)`,
                }}
              />
              <IconComponent size="lg" className="relative" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-lg font-semibold leading-tight break-words ${isUnlocked ? "text-[#fdfdfd]" : "text-[#a7b8b3]"}`}
                >
                  {achievement.name}
                </h3>
                {isUnlocked ? (
                  <span className="text-[#abd1c6]">
                    <LucideIcons.CheckCircle size="sm" />
                  </span>
                ) : (
                  <span className="text-[#92a3a0]">
                    <LucideIcons.Lock size="sm" />
                  </span>
                )}
              </div>
              <p
                className={`text-sm leading-relaxed break-words ${isUnlocked ? "text-[#d9e8e2]" : "text-[#9fb2ac] opacity-95"} line-clamp-3`}
              >
                {achievement.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end self-start md:self-end">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2 border"
              style={{
                backgroundColor: `${RARITY_COLORS[achievement.rarity]}1a`,
                color: isUnlocked ? currentTheme.accent : "#b9c7c2",
                borderColor: `${RARITY_COLORS[achievement.rarity]}44`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: RARITY_COLORS[achievement.rarity] }}
              />
              {getShortRarityName(achievement.rarity)}
            </span>
          </div>
        </div>

        {/* Прогресс */}
        {showProgress && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#b3c7c1] flex-wrap gap-2">
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: RARITY_COLORS[achievement.rarity] }}
                />
                Прогресс
              </span>
              <span className="font-semibold text-[#e7f3ee] flex items-center gap-2">
                <LucideIcons.Zap size="sm" className="text-[#f9bc60]" />
                {effectiveCurrent}/{effectiveTarget} (
                {Math.round(progressPercentage)}%)
              </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden border border-white/10 bg-white/8">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-600"
                style={{
                  width: `${Math.min(progressPercentage, 100)}%`,
                  background: `linear-gradient(90deg, ${RARITY_COLORS[achievement.rarity]} 0%, ${RARITY_COLORS[achievement.rarity]}cc 100%)`,
                  boxShadow: `0 0 16px ${RARITY_COLORS[achievement.rarity]}66`,
                }}
              />
              <div
                className="absolute inset-y-0 left-0 opacity-50"
                style={{
                  width: `${Math.min(progressPercentage, 100)}%`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.25), transparent 60%)",
                }}
              />
            </div>
          </div>
        )}

        {/* Итоговая плашка */}
        <div className="flex items-center justify-between">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.2)] border border-white/10
              ${isUnlocked ? "bg-[#f9bc60] text-[#0b241f]" : "bg-white/8 text-[#d4e4de]"}
            `}
          >
            {isUnlocked ? "Получено" : "Не получено"}
          </span>
          {isUnlocked && userAchievement?.unlockedAt && (
            <div className="text-xs text-[#9fb2ac]">
              Получено:{" "}
              {new Date(userAchievement.unlockedAt).toLocaleDateString("ru-RU")}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
