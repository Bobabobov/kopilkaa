// components/profile/OtherUserProfile.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import OtherUserLoadingStates from "./OtherUserLoadingStates";
import OtherUserPersonalStats from "./OtherUserPersonalStats";
import OtherUserAchievements from "./OtherUserAchievements";
import OtherUserActivity from "./OtherUserActivity";
import MutualFriends from "./widgets/MutualFriends";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import ProfileReviewSection from "@/components/profile/sections/ProfileReviewSection";
import ProfileStoriesSection from "@/components/profile/sections/ProfileStoriesSection";
import ReportUserModal from "./modals/ReportUserModal";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import TrustLevelCard from "@/components/profile/TrustLevelCard";
import { BannedNotice, isUserCurrentlyBanned } from "./BannedNotice";
import { useOtherUserFriendship } from "./hooks/useOtherUserFriendship";
import { useOtherUserData } from "./hooks/useOtherUserData";
import { useOtherUserTrust } from "./hooks/useOtherUserTrust";

type User = {
  id: string;
  email: string | null;
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string | null;
  isBanned?: boolean;
  bannedUntil?: string | null;
  bannedReason?: string | null;
};

interface OtherUserProfileProps {
  userId: string;
}

export default function OtherUserProfile({ userId }: OtherUserProfileProps) {
  const router = useRouter();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const emitFriendEvents = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("friends-updated"));
      window.dispatchEvent(new CustomEvent("friend-requests-updated"));
    }
  }, []);

  const { user, loading, isAuthenticated, currentUserId, resolvedUserId } =
    useOtherUserData({ userId });

  // Обработчик события для открытия модального окна жалобы
  useEffect(() => {
    const handleOpenReportModal = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>;
      const targetId = resolvedUserId || user?.id || null;
      if (targetId && customEvent.detail?.userId === targetId) {
        setIsReportModalOpen(true);
      }
    };

    window.addEventListener("open-report-user-modal", handleOpenReportModal);
    return () => {
      window.removeEventListener(
        "open-report-user-modal",
        handleOpenReportModal,
      );
    };
  }, [resolvedUserId, user?.id]);

  const { approvedApplications, trustDerived } = useOtherUserTrust({
    isAuthenticated,
    resolvedUserId,
    fallbackUserId: userId,
  });

  const {
    friendship,
    friendshipStatus,
    fetchFriendshipStatus,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    handleRemoveFriend,
  } = useOtherUserFriendship({
    resolvedUserId,
    isAuthenticated,
    currentUserId,
    user,
    emitFriendEvents,
    showToast: showToast as (
      type: any,
      title: string,
      message?: string,
      duration?: number,
    ) => void,
  });

  // Проверка, является ли пользователь владельцем профиля
  useEffect(() => {
    if (currentUserId && resolvedUserId && currentUserId === resolvedUserId) {
      // Перенаправляем на собственный профиль
      router.push("/profile");
    }
  }, [currentUserId, resolvedUserId, router]);

  // Загрузка проверки авторизации
  if (isAuthenticated === null) {
    return <OtherUserLoadingStates state="checking" />;
  }

  // Если не авторизован
  if (isAuthenticated === false) {
    return <OtherUserLoadingStates state="unauthorized" />;
  }

  if (loading) {
    return <OtherUserLoadingStates state="loading" />;
  }

  if (!user) {
    return <OtherUserLoadingStates state="not-found" />;
  }

  if (isUserCurrentlyBanned(user)) {
    return <BannedNotice user={user} ToastComponent={ToastComponent} />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      role="main"
      aria-label="Профиль пользователя"
    >
      {/* Универсальный фон */}

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 pt-0 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Кнопка возврата на свой профиль */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-3 sm:mb-4"
          >
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-lg transition-all duration-200 group"
            >
              <LucideIcons.ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                Мой профиль
              </span>
            </Link>
          </motion.div>

          {/* Информация о пользователе */}
          <div className="mb-4 sm:mb-6">
            <ProfileHeaderCard
              user={user}
              isOwner={false}
              friendshipStatus={friendshipStatus}
              onSendRequest={sendFriendRequest}
              onAcceptIncoming={acceptFriendRequest}
              onDeclineIncoming={declineFriendRequest}
              onRemoveFriend={
                friendship?.status === "ACCEPTED"
                  ? handleRemoveFriend
                  : undefined
              }
            />
          </div>

          {/* Общие друзья (если есть) */}
          <div className="mb-4 sm:mb-6">
            <MutualFriends userId={resolvedUserId || user.id} />
          </div>

          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Левая колонка */}
            <section className="lg:col-span-7 space-y-4 sm:space-y-5 md:space-y-6">
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
              <ProfileReviewSection
                userId={resolvedUserId || user.id}
                isOwner={false}
              />
              <OtherUserPersonalStats userId={resolvedUserId || user.id} />
              <OtherUserAchievements userId={resolvedUserId || user.id} />
            </section>

            {/* Правая колонка */}
            <aside className="lg:col-span-5 space-y-4 sm:space-y-5 md:space-y-6">
              <ProfileStoriesSection
                userId={resolvedUserId || user.id}
                isOwner={false}
              />
              <OtherUserActivity userId={resolvedUserId || user.id} />
            </aside>
          </div>
        </div>
      </div>

      {/* Красивые уведомления */}
      <ToastComponent />

      {/* Модальное окно жалобы */}
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={resolvedUserId || user.id}
        userName={user.name}
      />
    </div>
  );
}
