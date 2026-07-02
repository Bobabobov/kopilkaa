"use client";

import { motion } from "framer-motion";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import { FriendActions } from "@/components/profile/header/FriendActions";
import ProfileReviewSection from "@/components/profile/sections/ProfileReviewSection";
import ProfileStoriesSection from "@/components/profile/sections/ProfileStoriesSection";
import MutualFriends from "./widgets/MutualFriends";
import OtherUserPersonalStats from "./OtherUserPersonalStats";
import { OtherUserProfileBackLink } from "./OtherUserProfileBackLink";
import { ProfileAchievementShowcaseStrip } from "@/components/profile/achievements/ProfileAchievementShowcaseStrip";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";
import ProfileAchievementsSection from "@/components/profile/sections/ProfileAchievementsSection";
import { Separator } from "@/components/ui/separator";
import type { OtherUserProfileUser } from "./types";

interface OtherUserProfileContentProps {
  user: OtherUserProfileUser;
  resolvedUserId: string;
  friendshipStatus: "none" | "requested" | "incoming" | "friends";
  friendship: { status: string } | null;
  onSendRequest: () => Promise<void>;
  onAcceptIncoming: () => Promise<void>;
  onDeclineIncoming: () => Promise<void>;
  onRemoveFriend: (() => Promise<void>) | undefined;
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function OtherUserProfileContent({
  user,
  resolvedUserId,
  friendshipStatus,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
}: OtherUserProfileContentProps) {
  return (
    <div className="relative z-10 w-full px-2 pb-6 pt-3 xs:px-3 xs:pb-8 xs:pt-4 sm:px-4 sm:pb-10 sm:pt-6 md:px-5 md:pb-12 md:pt-8 lg:px-6 lg:pt-10">
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6 lg:space-y-8">
        <OtherUserProfileBackLink />

        <header>
          <ProfileHeaderCard
            user={user}
            isOwner={false}
            profileLevel={user.level}
          />
        </header>

        <div className="flex justify-center">
          <FriendActions
            isOwner={false}
            status={friendshipStatus}
            centered
            onSendRequest={onSendRequest}
            onAcceptIncoming={onAcceptIncoming}
            onDeclineIncoming={onDeclineIncoming}
            onRemoveFriend={onRemoveFriend}
          />
        </div>

        <ProfileAchievementShowcaseStrip
          userId={resolvedUserId}
          isOwner={false}
        />

        <MutualFriends userId={resolvedUserId} />

        <Separator className="my-1 sm:my-2" />

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section
            className="min-w-0 space-y-5 sm:space-y-6"
            aria-labelledby="profile-content-heading"
          >
            <h2 id="profile-content-heading" className="sr-only">
              Разделы профиля
            </h2>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="space-y-2"
            >
              <ProfileSectionTitle icon="BarChart3" title="Статистика" />
              <OtherUserPersonalStats userId={resolvedUserId} />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 0.06 }}
              className="space-y-2"
            >
              <ProfileSectionTitle icon="MessageCircle" title="Отзыв" />
              <ProfileReviewSection userId={resolvedUserId} isOwner={false} />
            </motion.div>
          </section>

          <aside
            className="min-w-0 space-y-5 sm:space-y-6 lg:sticky lg:top-[calc(var(--header-offset)+1.25rem)] lg:max-h-[calc(100dvh-var(--header-offset)-2rem)] lg:overflow-y-auto lg:overscroll-contain"
            aria-label="Боковая панель"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <ProfileStoriesSection userId={resolvedUserId} isOwner={false} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
            >
              <ProfileAchievementsSection
                userId={resolvedUserId}
                isOwner={false}
              />
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
