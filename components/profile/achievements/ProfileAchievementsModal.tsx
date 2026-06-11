"use client";

import { motion } from "framer-motion";
import {
  AchievementListCard,
  type AchievementListItem,
} from "@/components/profile/achievements/AchievementListCard";
import { GlassModal } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";

type ProfileAchievementsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: AchievementListItem[];
  unlockedCount: number;
  totalCount: number;
  isOwner?: boolean;
  pinnedSlugs?: string[];
  savingPinSlug?: string | null;
  pinError?: string | null;
  onTogglePin?: (slug: string) => void;
};

export function ProfileAchievementsModal({
  isOpen,
  onClose,
  items,
  unlockedCount,
  totalCount,
  isOwner = false,
  pinnedSlugs = [],
  savingPinSlug = null,
  pinError = null,
  onTogglePin,
}: ProfileAchievementsModalProps) {
  const completionPercent =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <GlassModal
      open={isOpen}
      onClose={onClose}
      size="3xl"
      title="Все достижения"
      icon={
        <motion.span
          animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.2,
          }}
          className="inline-flex"
        >
          <LucideIcons.Trophy className="h-4 w-4 text-[#f9bc60] drop-shadow-[0_0_10px_rgba(249,188,96,0.5)]" />
        </motion.span>
      }
      subtitle={
        <>
          <motion.span
            key={unlockedCount}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {unlockedCount} из {totalCount} получено
          </motion.span>
          <span className="mx-2 text-white/15">·</span>
          <span className="font-medium text-[#f9bc60]">{completionPercent}%</span>
        </>
      }
      headerAfter={
        <div className="relative border-b border-white/[0.12] bg-white/[0.03] px-4 pb-4 pt-0 backdrop-blur-xl sm:px-5">
          <div className="overflow-hidden rounded-full border border-white/10 bg-black/20 p-[3px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <motion.div
              className="relative h-2 overflow-hidden rounded-full bg-gradient-to-r from-[#abd1c6]/90 via-[#f9bc60] to-[#e8a545]"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent" />
            </motion.div>
          </div>
        </div>
      }
      titleId="profile-achievements-modal-title"
    >
      {isOwner && pinError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 rounded-xl border border-[#e16162]/25 bg-[#e16162]/10 px-3 py-2 text-xs text-[#ffb4b4] backdrop-blur-sm"
        >
          {pinError}
        </motion.p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const isPinned = pinnedSlugs.includes(item.slug);
          const pinDisabled = !item.unlocked || savingPinSlug !== null;

          return (
            <AchievementListCard
              key={item.slug}
              item={item}
              index={index}
              animated
              isOwner={isOwner}
              isPinned={isPinned}
              pinDisabled={pinDisabled}
              savingPinSlug={savingPinSlug}
              onTogglePin={onTogglePin}
            />
          );
        })}
      </div>
    </GlassModal>
  );
}
