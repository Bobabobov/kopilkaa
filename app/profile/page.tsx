// app/profile/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ProfileLoading from '@/components/profile/sections/ProfileLoading';
import ProfileErrorState from '@/components/profile/ProfileErrorState';
import ProfileUnauthorizedState from '@/components/profile/ProfileUnauthorizedState';
import ProfileLayout from '@/components/profile/ProfileLayout';
import { SettingsModal } from '@/components/profile/ProfileDynamicImports';
import { useProfileDashboard } from '@/hooks/profile/useProfileDashboard';
import { useProfileUrlParams } from '@/hooks/profile/useProfileUrlParams';
import { useProfileUpdates } from '@/hooks/profile/useProfileUpdates';
import { useProfileSettingsModal } from '@/hooks/profile/useProfileSettingsModal';
import { getUserLevelProgress } from '@/lib/userLevel';
import { toDisplayExperience } from '@/lib/userLevel/economy';

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfilePageContent />
    </Suspense>
  );
}

function ProfilePageContent() {
  const { data: profileData, loading, error, refetch } = useProfileDashboard();
  const { isSettingsModalOpen, setIsSettingsModalOpen } =
    useProfileSettingsModal();

  useProfileUrlParams();

  const user = profileData?.user ?? null;

  const { handleThemeChange, handleCoverChange, handleAvatarChange } =
    useProfileUpdates({ refetch });

  if (loading) {
    return <ProfileLoading />;
  }

  if (error) {
    return <ProfileErrorState error={error} onRetry={refetch} />;
  }

  if (!user) {
    return <ProfileUnauthorizedState />;
  }

  const bonusWallet = profileData?.bonusWallet ?? {
    totalEarnedBonuses: 0,
    grossBonuses: 0,
    bonusesInvestedInExperience: 0,
    bonusesInLevel: 0,
    availableBonuses: 0,
    pendingWithdrawalBonuses: 0,
    withdrawnBonuses: 0,
    hasPendingWithdrawal: false,
    withdrawalBlocked: false,
    withdrawalsDisabled: false,
  };

  const userLevel =
    profileData?.userLevel ??
    getUserLevelProgress(toDisplayExperience(user.experience ?? 0));

  return (
    <>
      <ProfileLayout
        user={user}
        bonusWallet={bonusWallet}
        userLevel={userLevel}
        onThemeChange={handleThemeChange}
        onCoverChange={handleCoverChange}
        onAvatarChange={handleAvatarChange}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onBonusClaimed={refetch}
      />

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onProfileUpdated={refetch}
        />
      )}
    </>
  );
}
