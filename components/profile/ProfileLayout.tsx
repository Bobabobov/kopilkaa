// components/profile/ProfileLayout.tsx — изумрудный glass-профиль
'use client';

import { motion } from 'framer-motion';
import type { ProfileBonusWallet } from '@/hooks/profile/useProfileDashboard';
import type { UserLevelProgress } from '@/lib/userLevel';
import {
  ProfileLevelSection,
  ProfileWalletSection,
} from '@/components/profile/ProfileLevelBar';
import { emptyFirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import {
  ProfileHeaderCard,
  ProfileFriendsSection,
} from './ProfileDynamicImports';
import ProfileReferralProgramCard from './ProfileReferralProgramCard';
import { ProfileDailyBonusCard } from './ProfileDailyBonusCard';
import { ProfileDailyBonusReminder } from './ProfileDailyBonusReminder';
import ProfileStoriesSection from './sections/ProfileStoriesSection';
import ProfileAchievementsSection from './sections/ProfileAchievementsSection';
import { ProfileAchievementShowcaseStrip } from '@/components/profile/achievements/ProfileAchievementShowcaseStrip';
import { SectionFeedbackCta } from '@/components/feedback/SectionFeedbackCta';

interface ProfileLayoutProps {
  user: {
    id: string;
    email: string | null;
    username?: string | null;
    role: 'USER' | 'ADMIN';
    name?: string | null;
    createdAt: string;
    avatar?: string | null;
    headerTheme?: string | null;
    headerCover?: string | null;
    hideEmail?: boolean;
    vkLink?: string | null;
    telegramLink?: string | null;
    youtubeLink?: string | null;
    lastSeen?: string | null;
  };
  userLevel: UserLevelProgress;
  bonusWallet: ProfileBonusWallet;
  onThemeChange: (newTheme: string | null) => Promise<void>;
  onCoverChange: (coverUrl: string | null) => Promise<void>;
  onAvatarChange: (avatarUrl: string | null) => Promise<void>;
  onOpenSettings: () => void;
  onBonusClaimed?: () => void;
}

export default function ProfileLayout({
  user,
  userLevel,
  bonusWallet,
  onThemeChange,
  onCoverChange,
  onAvatarChange,
  onOpenSettings,
  onBonusClaimed,
}: ProfileLayoutProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.04 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const handleWalletRefresh = () => {
    onBonusClaimed?.();
  };

  const walletSection = (
    <ProfileWalletSection
      userLevel={userLevel}
      availableBonuses={bonusWallet.availableBonuses}
      bonusesInvestedInExperience={bonusWallet.bonusesInvestedInExperience}
      hasPendingWithdrawal={bonusWallet.hasPendingWithdrawal}
      withdrawalBlocked={bonusWallet.withdrawalBlocked}
      firstWithdrawalBonus={
        bonusWallet.firstWithdrawalBonus ?? emptyFirstWithdrawalBonusStatus()
      }
      onInvested={handleWalletRefresh}
      onWithdrawn={handleWalletRefresh}
    />
  );

  return (
    <main
      className="relative min-h-screen overflow-x-hidden overflow-y-auto"
      aria-label="Профиль пользователя"
    >
      <div className="relative z-10 w-full px-2 pb-6 pt-3 xs:px-3 xs:pb-8 xs:pt-4 sm:px-4 sm:pb-10 sm:pt-6 md:px-5 md:pb-12 md:pt-8 lg:px-6 lg:pt-10">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
          <header>
            <ProfileHeaderCard
              user={user}
              isOwner
              profileLevel={userLevel.level}
              onThemeChange={onThemeChange}
              onCoverChange={onCoverChange}
              onOpenSettings={onOpenSettings}
              onAvatarChange={onAvatarChange}
            />
          </header>

          <ProfileDailyBonusReminder />

          <ProfileAchievementShowcaseStrip userId={user.id} isOwner />

          <SectionFeedbackCta variant="profile" />

          <div
            className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-8"
            role="region"
            aria-label="Контент профиля"
          >
            <section
              className="flex min-w-0 flex-col gap-6 sm:gap-8"
              aria-labelledby="profile-main-heading"
            >
              <h2 id="profile-main-heading" className="sr-only">
                Уровень и активность
              </h2>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6 sm:gap-8"
              >
                <motion.div variants={item} className="lg:hidden">
                  {walletSection}
                </motion.div>
                <motion.div variants={item}>
                  <ProfileLevelSection
                    userLevel={userLevel}
                    availableBonuses={bonusWallet.availableBonuses}
                    firstWithdrawalBonus={
                      bonusWallet.firstWithdrawalBonus ??
                      emptyFirstWithdrawalBonusStatus()
                    }
                    onBonusClaimed={handleWalletRefresh}
                  />
                </motion.div>
                <motion.div variants={item}>
                  <ProfileDailyBonusCard onBonusClaimed={onBonusClaimed} />
                </motion.div>
                <motion.div variants={item}>
                  <ProfileStoriesSection userId={user.id} isOwner />
                </motion.div>
              </motion.div>
            </section>

            <aside
              className="flex min-w-0 flex-col gap-6 sm:gap-8"
              aria-label="Кошелёк и сообщество"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="hidden lg:block"
              >
                {walletSection}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <ProfileAchievementsSection userId={user.id} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
              >
                <ProfileReferralProgramCard />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.14 }}
              >
                <ProfileFriendsSection />
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
