// components/profile/ProfileLayout.tsx
// Основной layout для страницы профиля
"use client";

import TrustLevelCard from "@/components/profile/TrustLevelCard";
import type { TrustLevel } from "@/lib/trustLevel";
import {
  ProfileHeaderCard,
  ProfilePersonalStats,
  ProfileFriendsSection,
  ProfileAchievements,
  ProfileDonations,
  ProfileRecentActivity,
  MotivationalCard,
} from "./ProfileDynamicImports";

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
  onThemeChange,
  onAvatarChange,
  onOpenSettings,
}: ProfileLayoutProps) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      role="main"
      aria-label="Профиль пользователя"
    >
      {/* Main Content */}
      <div className="relative z-10 w-full px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pt-3 xs:pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 xs:pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-4 xs:space-y-5 sm:space-y-6">
          {/* Информация о пользователе */}
          <div>
            <ProfileHeaderCard
              user={user}
              isOwner
              friendshipStatus="friends"
              onThemeChange={onThemeChange}
              onBackgroundChange={() => {}}
              onOpenSettings={onOpenSettings}
              onAvatarChange={onAvatarChange}
            />
          </div>

          {/* Основной контент: двухколоночный макет */}
          <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-4 xs:gap-5 sm:gap-6 md:gap-6 lg:gap-7">
            <section className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
              <MotivationalCard />
              <ProfilePersonalStats />
              <ProfileRecentActivity />
            </section>

            <aside className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
              <TrustLevelCard
                status={trustStatus}
                supportText={trustSupportText}
                progressText={trustProgressText}
                progressValue={trustProgressValue}
                progressCurrent={trustProgressCurrent}
                progressTotal={trustProgressTotal}
              />
              <ProfileFriendsSection />
              <ProfileAchievements />
              <ProfileDonations />
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

