// app/profile/page.tsx
"use client";
// Профиль сильно зависит от динамических данных и куков,
// поэтому явно помечаем маршрут как динамический, чтобы Next
// не пытался предрендерить /profile статически при билде.
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProfileLoading from "@/components/profile/sections/ProfileLoading";
import ProfileErrorState from "@/components/profile/ProfileErrorState";
import ProfileUnauthorizedState from "@/components/profile/ProfileUnauthorizedState";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { SettingsModal } from "@/components/profile/ProfileDynamicImports";
import { useProfileDashboard } from "@/lib/useProfileDashboard";
import { useProfileUrlParams } from "@/hooks/profile/useProfileUrlParams";
import { useTrustLevel } from "@/hooks/profile/useTrustLevel";
import { useProfileUpdates } from "@/hooks/profile/useProfileUpdates";
import { useProfileSettingsModal } from "@/hooks/profile/useProfileSettingsModal";

// Обёртка с Suspense — требуется Next.js для страниц,
// которые используют useSearchParams в режиме CSR bailout.
export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfilePageContent />
    </Suspense>
  );
}

function ProfilePageContent() {
  const { data: profileData, loading, error, refetch } = useProfileDashboard();
  const { isSettingsModalOpen, setIsSettingsModalOpen } = useProfileSettingsModal();

  // Обработка URL параметров
  useProfileUrlParams();

  const user = profileData?.user || null;
  const approvedApplications = profileData?.stats?.approvedApplications ?? 0;

  // Расчет уровня доверия
  const {
    trustStatus,
    trustSupportText,
    progressText,
    progressValue,
    progressCurrent,
    progressTotal,
  } = useTrustLevel({
    approvedApplications,
  });

  // Обработка обновлений профиля
  const { handleThemeChange, handleAvatarChange } = useProfileUpdates({
    refetch,
  });

  if (loading) {
    return <ProfileLoading />;
  }

  if (error) {
    return <ProfileErrorState error={error} onRetry={refetch} />;
  }

  if (!user) {
    return <ProfileUnauthorizedState />;
  }

  return (
    <>
      <ProfileLayout
        user={user}
        trustStatus={trustStatus}
        trustSupportText={trustSupportText}
        trustProgressText={progressText}
        trustProgressValue={progressValue}
        trustProgressCurrent={progressCurrent}
        trustProgressTotal={progressTotal}
        onThemeChange={handleThemeChange}
        onAvatarChange={handleAvatarChange}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Модальное окно настроек */}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </>
  );
}
