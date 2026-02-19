// components/profile/ProfileLayout.tsx
// Профиль: shadcn Card/Badge/Separator + Next.js семантика (Context7)
"use client";

import { motion } from "framer-motion";
import { ProfileTrustAndStatsCard } from "@/components/profile/ProfileTrustAndStatsCard";
import type { TrustLevel } from "@/lib/trustLevel";
import type { LevelStats } from "@/hooks/profile/useProfileDashboard";
import ProfileReviewSection from "./sections/ProfileReviewSection";
import ProfileStoriesSection from "./sections/ProfileStoriesSection";
import {
  ProfileHeaderCard,
  ProfileFriendsSection,
  ProfileRecentActivity,
  MotivationalCard,
} from "./ProfileDynamicImports";
import { ProfileStatsStrip } from "./ProfileStatsStrip";
import { ProfileSectionTitle } from "./ProfileSectionTitle";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/Card";

interface ProfileLayoutProps {
  user: {
    id: string;
    email: string | null;
    username?: string | null;
    role: "USER" | "ADMIN";
    name?: string | null;
    createdAt: string;
    avatar?: string | null;
    headerTheme?: string | null;
    hideEmail?: boolean;
    vkLink?: string | null;
    telegramLink?: string | null;
    youtubeLink?: string | null;
    lastSeen?: string | null;
  };
  trustStatus: Lowercase<TrustLevel>;
  trustSupportText: string;
  trustProgressText: string | null;
  trustProgressValue: number | null;
  trustProgressCurrent: number | null;
  trustProgressTotal: number | null;
  levelStats?: LevelStats | null;
  onThemeChange: (newTheme: string | null) => Promise<void>;
  onAvatarChange: (avatarUrl: string | null) => Promise<void>;
  onOpenSettings: () => void;
}

export default function ProfileLayout({
  user,
  trustStatus,
  trustSupportText,
  trustProgressText,
  trustProgressValue,
  trustProgressCurrent,
  trustProgressTotal,
  levelStats,
  onThemeChange,
  onAvatarChange,
  onOpenSettings,
}: ProfileLayoutProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden overflow-y-auto"
      role="main"
      aria-label="Профиль пользователя"
    >
      <div className="relative z-10 w-full px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pt-3 xs:pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 xs:pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
          <header>
            <ProfileHeaderCard
              user={user}
              isOwner
              friendshipStatus="friends"
              onThemeChange={onThemeChange}
              onBackgroundChange={() => {}}
              onOpenSettings={onOpenSettings}
              onAvatarChange={onAvatarChange}
            />
          </header>

          <ProfileStatsStrip
            trustStatus={trustStatus}
            trustSupportText={trustSupportText}
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
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-5 sm:space-y-6"
              >
                <motion.div variants={item} className="space-y-2">
                  <ProfileSectionTitle icon="Lightbulb" title="Мотивация" />
                  <Card variant="glass" padding="lg" hoverable>
                    <MotivationalCard />
                  </Card>
                </motion.div>
                <motion.div variants={item} className="space-y-2">
                  <ProfileSectionTitle icon="MessageCircle" title="Отзыв" subtitle="Ваш отзыв о помощи" />
                  <ProfileReviewSection userId={user.id} isOwner />
                </motion.div>
                <motion.div variants={item} className="space-y-2">
                  <ProfileSectionTitle icon="Activity" title="Активность" subtitle="Последние действия" />
                  <ProfileRecentActivity />
                </motion.div>
              </motion.div>
            </section>

            <aside
              className="space-y-5 sm:space-y-6 min-w-0"
              aria-label="Боковая панель профиля"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="space-y-2"
              >
                <ProfileSectionTitle icon="Shield" title="Доверие" subtitle="Уровень и поддержка" />
                <ProfileTrustAndStatsCard
                  status={trustStatus}
                  supportText={trustSupportText}
                  progressText={trustProgressText}
                  progressValue={trustProgressValue}
                  progressCurrent={trustProgressCurrent}
                  progressTotal={trustProgressTotal}
                  levelStats={levelStats ?? undefined}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              >
                <ProfileFriendsSection />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
                <ProfileStoriesSection userId={user.id} isOwner />
              </motion.div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
