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
import { useProfileDashboard } from "@/hooks/profile/useProfileDashboard";
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
  const { isSettingsModalOpen, setIsSettingsModalOpen } =
    useProfileSettingsModal();

  // Обработка URL параметров
  useProfileUrlParams();

  const user = profileData?.user || null;
  const trustSnapshot = profileData?.trust ?? profileData?.stats?.trust;
  const approvedApplicationsRaw =
    trustSnapshot?.approvedApplications ??
    profileData?.stats?.approvedApplications ??
    0;
  const approvedApplicationsEffective =
    trustSnapshot?.effectiveApprovedApplications ??
    profileData?.stats?.effectiveApprovedApplications ??
    profileData?.stats?.applications?.effectiveApproved ??
    approvedApplicationsRaw;

  // Расчет уровня доверия
  const {
    trustStatus,
    trustSupportText,
    progressText,
    progressValue,
    progressCurrent,
    progressTotal,
  } = useTrustLevel({
    approvedApplications: approvedApplicationsRaw,
    effectiveApprovedApplications: approvedApplicationsEffective,
  });
  const trustStatusResolved = trustSnapshot?.trustLevel
    ? (trustSnapshot.trustLevel.toLowerCase() as typeof trustStatus)
    : trustStatus;
  const trustSupportResolved =
    trustSnapshot?.supportRangeText ?? trustSupportText;
  /* progressCurrent/progressTotal из API учитывают trustDelta (админское понижение уровня) */
  const progressCurrentResolved =
    trustSnapshot != null &&
    typeof trustSnapshot.progressCurrent === "number" &&
    typeof trustSnapshot.progressTotal === "number"
      ? trustSnapshot.progressCurrent
      : progressCurrent;
  const progressTotalResolved =
    trustSnapshot != null &&
    typeof trustSnapshot.progressTotal === "number"
      ? trustSnapshot.progressTotal
      : progressTotal;
  const progressTextResolved =
    trustSnapshot?.progressText ?? progressText;
  const progressValueResolved =
    progressTotalResolved != null &&
    progressTotalResolved > 0 &&
    progressCurrentResolved != null
      ? Math.min(1, Math.max(0, progressCurrentResolved / progressTotalResolved))
      : progressValue;

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

  const levelStats = profileData?.levelStats ?? null;

  return (
    <>
      <ProfileLayout
        user={user}
        trustStatus={trustStatusResolved}
        trustSupportText={trustSupportResolved}
        trustProgressText={progressTextResolved}
        trustProgressValue={progressValueResolved}
        trustProgressCurrent={progressCurrentResolved}
        trustProgressTotal={progressTotalResolved}
        levelStats={levelStats}
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
