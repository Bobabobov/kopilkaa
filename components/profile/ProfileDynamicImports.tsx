// components/profile/ProfileDynamicImports.tsx
// Динамические импорты компонентов профиля с loading states
"use client";

import dynamicComponent from "next/dynamic";

// Loading компонент для ProfileHeaderCard
const ProfileHeaderCardLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[350px]">
    <div className="animate-pulse space-y-4">
      <div className="flex justify-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#abd1c6]/20 rounded-lg"></div>
      </div>
      <div className="h-6 bg-[#abd1c6]/20 rounded w-32 mx-auto"></div>
      <div className="h-4 bg-[#abd1c6]/10 rounded w-48 mx-auto"></div>
      <div className="h-10 bg-[#abd1c6]/10 rounded-lg mt-6"></div>
    </div>
  </div>
);

// Loading компонент для ProfilePersonalStats
const ProfilePersonalStatsLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[400px]">
    <div className="animate-pulse space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
        <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-3 sm:pb-4 border-b border-[#abd1c6]/10">
        <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
        <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
        <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-24"></div>
        <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-28"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
      <div className="h-32 bg-[#abd1c6]/10 rounded-xl"></div>
    </div>
  </div>
);

// Loading компонент для ProfileFriendsSection
const ProfileFriendsSectionLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[200px]">
    <div className="animate-pulse space-y-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
        <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
      </div>
      <div className="space-y-2">
        <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// Loading компонент для ProfileAchievements
const ProfileAchievementsLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[250px]">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
        <div className="h-6 bg-[#abd1c6]/20 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
      <div className="h-12 bg-[#abd1c6]/10 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// Loading компонент для ProfileDonations
const ProfileDonationsLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[280px]">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
        </div>
        <div className="h-6 bg-[#abd1c6]/20 rounded w-16"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 bg-[#001e1d]/20 rounded-xl">
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// Loading компонент для ProfileRecentActivity
const ProfileRecentActivityLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[300px]">
    <div className="animate-pulse space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
        <div className="h-6 bg-[#abd1c6]/20 rounded w-1/4"></div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// Loading компонент для MotivationalCard
const MotivationalCardLoading = () => (
  <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[150px]">
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
    </div>
  </div>
);

// Динамические импорты
export const ProfileHeaderCard = dynamicComponent(
  () => import("@/components/profile/ProfileHeaderCard"),
  {
    loading: ProfileHeaderCardLoading,
    ssr: false,
  }
);

export const ProfilePersonalStats = dynamicComponent(
  () => import("@/components/profile/sections/ProfilePersonalStats"),
  {
    loading: ProfilePersonalStatsLoading,
    ssr: false,
  }
);

export const ProfileFriendsSection = dynamicComponent(
  () => import("@/components/profile/sections/ProfileFriendsSection"),
  {
    loading: ProfileFriendsSectionLoading,
    ssr: false,
  }
);

export const ProfileAchievements = dynamicComponent(
  () => import("@/components/profile/sections/ProfileAchievements"),
  {
    loading: ProfileAchievementsLoading,
    ssr: false,
  }
);

export const ProfileDonations = dynamicComponent(
  () => import("@/components/profile/sections/ProfileDonations"),
  {
    loading: ProfileDonationsLoading,
    ssr: false,
  }
);

export const ProfileRecentActivity = dynamicComponent(
  () => import("@/components/profile/sections/ProfileRecentActivity"),
  {
    loading: ProfileRecentActivityLoading,
    ssr: false,
  }
);

export const MotivationalCard = dynamicComponent(
  () => import("@/components/profile/sections/MotivationalCard"),
  {
    loading: MotivationalCardLoading,
    ssr: false,
  }
);

export const SettingsModal = dynamicComponent(
  () => import("@/components/profile/modals/SettingsModal"),
  {
    ssr: false,
    loading: () => <div className="hidden" />,
  }
);


