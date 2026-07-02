"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { isAchievementImageIcon } from "@/lib/achievements/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { ProfileAchievementBadge } from "@/components/profile/achievements/ProfileAchievementBadge";

export type AchievementListItem = {
  slug: string;
  name: string;
  description: string;
  hint: string | null;
  icon: string;
  rarity: string;
  targetValue: number;
  progress: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export const PROFILE_ACHIEVEMENTS_PREVIEW_LIMIT = 2;

const rarityStyles: Record<
  string,
  { label: string; badge: string; glow: string; ring: string }
> = {
  COMMON: {
    label: "Обычная",
    badge: "border-white/15 bg-white/8 text-[#abd1c6]",
    glow: "from-white/5 to-transparent",
    ring: "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
  },
  UNCOMMON: {
    label: "Необычная",
    badge: "border-[#abd1c6]/30 bg-[#abd1c6]/12 text-[#abd1c6]",
    glow: "from-[#abd1c6]/10 to-transparent",
    ring: "shadow-[0_0_20px_rgba(171,209,198,0.12)]",
  },
  RARE: {
    label: "Редкая",
    badge: "border-[#f9bc60]/35 bg-[#f9bc60]/12 text-[#f9bc60]",
    glow: "from-[#f9bc60]/12 to-transparent",
    ring: "shadow-[0_0_24px_rgba(249,188,96,0.18)]",
  },
  EPIC: {
    label: "Эпическая",
    badge: "border-[#e16162]/35 bg-[#e16162]/12 text-[#e16162]",
    glow: "from-[#e16162]/12 to-transparent",
    ring: "shadow-[0_0_28px_rgba(225,97,98,0.2)]",
  },
};

function getRarityStyle(rarity: string) {
  return rarityStyles[rarity] ?? rarityStyles.COMMON;
}

export function formatUnlockedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function sortAchievementsForPreview(
  items: AchievementListItem[],
): AchievementListItem[] {
  return [...items].sort((left, right) => {
    if (left.unlocked !== right.unlocked) {
      return left.unlocked ? -1 : 1;
    }
    return 0;
  });
}

function AchievementIcon({
  iconKey,
  name,
  unlocked,
  animated = false,
}: {
  iconKey: string;
  name: string;
  unlocked: boolean;
  animated?: boolean;
}) {
  const isImage = isAchievementImageIcon(iconKey);
  const Icon = LucideIcons[iconKey as keyof typeof LucideIcons] as
    | ComponentType<{ className?: string }>
    | undefined;

  const iconContent = isImage ? (
    <div
      className={`relative h-14 w-14 transition-all ${
        unlocked
          ? "drop-shadow-[0_4px_16px_rgba(249,188,96,0.35)]"
          : "grayscale opacity-45"
      }`}
    >
      <Image
        src={iconKey}
        alt={name}
        fill
        className="object-contain"
        sizes="56px"
      />
      {animated && unlocked && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full bg-[#f9bc60]/20 blur-md"
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}
    </div>
  ) : (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
        unlocked
          ? "border-[#f9bc60]/50 bg-[#f9bc60]/20 text-[#f9bc60] shadow-[0_0_28px_rgba(249,188,96,0.28)]"
          : "border-white/10 bg-black/20 text-[#5c6778] opacity-70"
      }`}
    >
      {Icon ? (
        <Icon className={`h-5 w-5 ${unlocked ? "" : "opacity-40"}`} />
      ) : (
        <LucideIcons.Trophy className="h-5 w-5 opacity-40" />
      )}
    </div>
  );

  return (
    <motion.div
      className="relative flex-shrink-0"
      animate={
        animated && unlocked
          ? { y: [0, -4, 0], rotate: [0, 1.5, 0, -1.5, 0] }
          : undefined
      }
      transition={
        animated && unlocked
          ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      {iconContent}
      {!unlocked && (
        <div
          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#1a2332] text-[#94a1b2]"
          aria-hidden
        >
          <LucideIcons.Lock className="h-3 w-3" />
        </div>
      )}
      {unlocked && (
        <motion.div
          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#abd1c6]/40 bg-[#abd1c6]/20 text-[#abd1c6]"
          aria-hidden
          animate={
            animated
              ? { scale: [1, 1.12, 1], boxShadow: ["0 0 0 rgba(171,209,198,0)", "0 0 12px rgba(171,209,198,0.45)", "0 0 0 rgba(171,209,198,0)"] }
              : undefined
          }
          transition={
            animated
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          <LucideIcons.Check className="h-3 w-3" />
        </motion.div>
      )}
    </motion.div>
  );
}

function AchievementStatusBadge({
  unlocked,
  animated = false,
}: {
  unlocked: boolean;
  animated?: boolean;
}) {
  if (unlocked) {
    return (
      <motion.div
        animate={
          animated
            ? { scale: [1, 1.03, 1] }
            : undefined
        }
        transition={
          animated
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <Badge
          variant="outline"
          className="shrink-0 border-[#abd1c6]/40 bg-[#abd1c6]/15 text-[11px] font-semibold uppercase tracking-wide text-[#abd1c6]"
        >
          <LucideIcons.CheckCircle className="mr-1 inline h-3 w-3" />
          Получена
        </Badge>
      </motion.div>
    );
  }

  return (
    <Badge
      variant="outline"
      className="shrink-0 border-white/15 bg-white/5 text-[11px] font-semibold uppercase tracking-wide text-[#94a1b2]"
    >
      <LucideIcons.Lock className="mr-1 inline h-3 w-3" />
      Не получена
    </Badge>
  );
}

type AchievementListCardProps = {
  item: AchievementListItem;
  index?: number;
  isOwner?: boolean;
  isPinned?: boolean;
  pinDisabled?: boolean;
  savingPinSlug?: string | null;
  onTogglePin?: (slug: string) => void;
  compact?: boolean;
  /** Тонкая строка для боковой панели профиля */
  strip?: boolean;
  animated?: boolean;
};

export function AchievementListCard({
  item,
  index = 0,
  isOwner = false,
  isPinned = false,
  pinDisabled = false,
  savingPinSlug = null,
  onTogglePin,
  compact = false,
  strip = false,
  animated = false,
}: AchievementListCardProps) {
  const rarity = getRarityStyle(item.rarity);
  const progressPercent =
    item.targetValue > 0
      ? Math.min(100, (item.progress / item.targetValue) * 100)
      : 0;

  if (strip) {
    return (
      <article
        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
          item.unlocked
            ? "border-emerald-500/20 bg-emerald-950/30"
            : "border-emerald-500/10 bg-emerald-950/20 opacity-40"
        }`}
        aria-label={`${item.name}${item.unlocked ? ", получена" : ", не получена"}`}
      >
        <ProfileAchievementBadge
          icon={item.icon}
          name={item.name}
          size="sm"
          variant="floating"
          className={
            item.unlocked
              ? "drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              : "grayscale opacity-45"
          }
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium text-zinc-100">
            {item.name}
          </h4>
          {!item.unlocked && item.hint && (
            <p className="truncate text-xs text-zinc-500">{item.hint}</p>
          )}
        </div>
        {isOwner && item.unlocked && onTogglePin && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pinDisabled}
            onClick={() => onTogglePin(item.slug)}
            className="h-7 shrink-0 px-2 text-xs text-zinc-500 hover:text-emerald-400"
            aria-label={isPinned ? "Убрать из шапки" : "Показать в шапке"}
          >
            {savingPinSlug === item.slug ? (
              <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isPinned ? (
              <LucideIcons.Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            ) : (
              <LucideIcons.Plus className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </article>
    );
  }

  return (
    <motion.article
      initial={
        animated
          ? { opacity: 0, y: 24, scale: 0.94 }
          : { opacity: 0, y: compact ? 8 : 16 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        animated
          ? {
              type: "spring",
              stiffness: 320,
              damping: 26,
              delay: index * 0.05,
            }
          : { duration: 0.3, delay: index * 0.04 }
      }
      whileHover={
        animated
          ? {
              y: -4,
              scale: 1.015,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`group relative overflow-hidden rounded-2xl border transition-colors ${
        compact ? "p-3" : "p-4"
      } ${
        item.unlocked
          ? `border-[#abd1c6]/35 bg-gradient-to-br from-[#abd1c6]/12 via-[#f9bc60]/8 to-transparent shadow-[inset_0_1px_0_rgba(171,209,198,0.15)] ${animated ? rarity.ring : ""}`
          : "border-white/10 bg-white/[0.02] opacity-90"
      } ${
        animated && isPinned
          ? "border-[#f9bc60]/50 shadow-[0_0_30px_rgba(249,188,96,0.15)]"
          : ""
      }`}
      aria-label={`${item.name}${item.unlocked ? ", получена" : ", не получена"}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${rarity.glow}`}
        aria-hidden
      />

      {animated && isPinned && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#f9bc60]/40"
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}

      <div className="relative flex gap-3">
        <AchievementIcon
          iconKey={item.icon}
          name={item.name}
          unlocked={item.unlocked}
          animated={animated}
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h4
                id={`achievement-${item.slug}`}
                className={`text-sm font-semibold transition-colors ${
                  item.unlocked ? "text-white" : "text-[#94a1b2]"
                } ${animated ? "group-hover:text-[#f9bc60]" : ""}`}
              >
                {item.name}
              </h4>
              <Badge
                variant="outline"
                className={`text-[10px] uppercase tracking-wide ${rarity.badge}`}
              >
                {rarity.label}
              </Badge>
            </div>
            <AchievementStatusBadge unlocked={item.unlocked} animated={animated} />
          </div>

          <p
            className={`text-xs leading-relaxed ${
              item.unlocked ? "text-[#abd1c6]/90" : "text-[#6b7689]"
            }`}
          >
            {item.unlocked
              ? item.description
              : (item.hint ?? item.description)}
          </p>

          {!item.unlocked && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#94a1b2]">
                <span>Прогресс</span>
                <span>
                  {item.progress} / {item.targetValue}
                </span>
              </div>
              <div
                className="relative h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={item.progress}
                aria-valuemin={0}
                aria-valuemax={item.targetValue}
                aria-labelledby={`achievement-${item.slug}`}
              >
                <motion.div
                  className={`relative h-full rounded-full bg-gradient-to-r from-[#5c6778] to-[#94a1b2] ${
                    animated ? "overflow-hidden" : ""
                  }`}
                  initial={animated ? { width: 0 } : false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={
                    animated
                      ? {
                          duration: 0.9,
                          delay: 0.15 + index * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : { duration: 0.3 }
                  }
                >
                  {animated && progressPercent > 0 && (
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  )}
                </motion.div>
              </div>
            </div>
          )}

          {item.unlocked && item.unlockedAt && (
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#f9bc60]">
              <LucideIcons.Calendar className="h-3 w-3" />
              Получена {formatUnlockedDate(item.unlockedAt)}
            </p>
          )}

          {isOwner && item.unlocked && onTogglePin && (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pinDisabled}
                onClick={() => onTogglePin(item.slug)}
                className={`h-8 text-xs transition-all ${
                  isPinned
                    ? "border-[#f9bc60]/40 bg-[#f9bc60]/15 text-[#f9bc60] hover:bg-[#f9bc60]/20 shadow-[0_0_16px_rgba(249,188,96,0.15)]"
                    : "border-white/15 bg-white/5 text-[#abd1c6] hover:border-[#f9bc60]/30 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
                }`}
              >
                {savingPinSlug === item.slug ? (
                  <LucideIcons.Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : isPinned ? (
                  <LucideIcons.Star className="mr-1.5 h-3.5 w-3.5" />
                ) : (
                  <LucideIcons.Plus className="mr-1.5 h-3.5 w-3.5" />
                )}
                {isPinned ? "В шапке профиля" : "Показать в шапке"}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
