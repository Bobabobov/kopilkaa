"use client";

import { motion } from "framer-motion";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import TrustLevelCard from "@/components/profile/TrustLevelCard";
import ProfileReviewSection from "@/components/profile/sections/ProfileReviewSection";
import ProfileStoriesSection from "@/components/profile/sections/ProfileStoriesSection";
import MutualFriends from "./widgets/MutualFriends";
import OtherUserPersonalStats from "./OtherUserPersonalStats";
import OtherUserActivity from "./OtherUserActivity";
import { OtherUserProfileBackLink } from "./OtherUserProfileBackLink";
import { ProfileStatsStrip } from "@/components/profile/ProfileStatsStrip";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";
import { Separator } from "@/components/ui/separator";
import type { OtherUserProfileUser } from "./types";
import type { TrustLevel } from "@/lib/trustLevel";

interface OtherUserProfileContentProps {
  user: OtherUserProfileUser;
  resolvedUserId: string;
  friendshipStatus: "none" | "requested" | "incoming" | "friends";
  friendship: { status: string } | null;
  trustDerived: {
    trustStatus: Lowercase<TrustLevel>;
    supportText: string;
    progressText: string | null;
    progressValue: number | null;
    progressCurrent: number | null;
    progressTotal: number | null;
  };
  onSendRequest: () => Promise<void>;
  onAcceptIncoming: () => Promise<void>;
  onDeclineIncoming: () => Promise<void>;
  onRemoveFriend: (() => Promise<void>) | undefined;
}

export function OtherUserProfileContent({
  user,
  resolvedUserId,
  friendshipStatus,
  friendship,
  trustDerived,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
}: OtherUserProfileContentProps) {
  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-auto w-full">
      <div className="relative z-10 w-full px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pt-3 xs:pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 xs:pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
          <OtherUserProfileBackLink />

          <header>
          <ProfileHeaderCard
            user={user}
            isOwner={false}
            friendshipStatus={friendshipStatus}
            onSendRequest={onSendRequest}
            onAcceptIncoming={onAcceptIncoming}
            onDeclineIncoming={onDeclineIncoming}
            onRemoveFriend={onRemoveFriend}
          />
          </header>

          <MutualFriends userId={resolvedUserId} />

          <ProfileStatsStrip
            trustStatus={trustDerived.trustStatus}
            trustSupportText={trustDerived.supportText}
            joinedAt={user.createdAt}
          />

          <Separator className="my-2 sm:my-4" />

          <main
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-5 sm:gap-6 lg:gap-7"
            aria-label="Контент профиля"
          >
            <section
              className="space-y-5 sm:space-y-6 min-w-0"
              aria-labelledby="profile-content-heading"
            >
            <h2 id="profile-content-heading" className="sr-only">
              Разделы профиля
            </h2>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="space-y-5 sm:space-y-6"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="space-y-2"
              >
                <ProfileSectionTitle icon="Shield" title="Доверие" subtitle="Уровень участника" />
                <TrustLevelCard
                  status={trustDerived.trustStatus}
                  supportText={trustDerived.supportText}
                  progressText={trustDerived.progressText}
                  progressValue={trustDerived.progressValue}
                  progressCurrent={trustDerived.progressCurrent}
                  progressTotal={trustDerived.progressTotal}
                  titleOverride="Уровень доверия участника"
                  descriptionOverride="Расчёт по одобренным заявкам этого профиля"
                  extraOverride="Показывает доступный диапазон поддержки для этого участника"
                />
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="space-y-2"
              >
                <ProfileSectionTitle icon="MessageCircle" title="Отзыв" />
                <ProfileReviewSection userId={resolvedUserId} isOwner={false} />
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="space-y-2"
              >
                <ProfileSectionTitle icon="BarChart3" title="Статистика" />
                <OtherUserPersonalStats userId={resolvedUserId} />
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="space-y-2"
              >
                <ProfileSectionTitle icon="Activity" title="Активность" />
                <OtherUserActivity userId={resolvedUserId} />
              </motion.div>
            </motion.div>
            </section>

            <aside
              className="space-y-5 sm:space-y-6 min-w-0"
              aria-label="Боковая панель"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <ProfileStoriesSection userId={resolvedUserId} isOwner={false} />
              </motion.div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
