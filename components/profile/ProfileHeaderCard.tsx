"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";
import { getHeaderTheme } from "@/lib/header-customization";
import { useFloatingMenu } from "./hooks/useFloatingMenu";
import { useUserStatus } from "./hooks/useUserStatus";
import { SocialLinks } from "./header/SocialLinks";
import { FriendActions, type FriendshipStatus } from "./header/FriendActions";
import { GuestActionsMenu } from "./header/GuestActionsMenu";
import { AvatarBlock } from "./header/AvatarBlock";
import { HeaderIdentity } from "./header/HeaderIdentity";
import { CtaRow } from "./header/CtaRow";
import { useCoverStyle } from "./hooks/useCoverStyle";

type User = {
  id: string;
  email: string | null;
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
  applicationsCount?: number;
  approvedApplications?: number;
  friendsCount?: number;
  donationsCount?: number;
};

interface ProfileHeaderCardProps {
  user: User;
  isOwner: boolean;
  friendshipStatus?: FriendshipStatus;
  onSendRequest?: () => Promise<void> | void;
  onAcceptIncoming?: () => Promise<void> | void;
  onDeclineIncoming?: () => Promise<void> | void;
  onRemoveFriend?: () => Promise<void> | void;
  onThemeChange?: (theme: string | null) => void;
  headerBackground?: string | null;
  onBackgroundChange?: () => void;
  onOpenSettings?: () => void;
  onAvatarChange?: (avatarUrl: string | null) => void;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("ru-RU", {
    month: "short",
    year: "numeric",
  });

export default function ProfileHeaderCard({
  user,
  isOwner,
  friendshipStatus = "none",
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
  onThemeChange,
  headerBackground,
  onBackgroundChange,
  onOpenSettings,
  onAvatarChange,
}: ProfileHeaderCardProps) {
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || null);
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(
    user.headerTheme,
  );
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isGuestActionsOpen, setIsGuestActionsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const guestActionsButtonRef = useRef<HTMLElement | null>(null);

  const status = useUserStatus(user.lastSeen || null);
  const theme = useMemo(
    () => getHeaderTheme(currentHeaderTheme || "default"),
    [currentHeaderTheme],
  );
  const guestMenuStyle = useFloatingMenu({
    isOpen: isGuestActionsOpen,
    anchorRef: guestActionsButtonRef,
    menuSelector: '[data-menu="guest"]',
    onClose: () => setIsGuestActionsOpen(false),
  });

  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const hasSocialLinks = !!(
    user.vkLink ||
    user.telegramLink ||
    user.youtubeLink
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentAvatar(user.avatar || null);
    setCurrentHeaderTheme(user.headerTheme);
  }, [user.avatar, user.headerTheme]);

  useEffect(() => {
    const handleOpenApplicationsModal = () => setIsApplicationsModalOpen(true);
    window.addEventListener(
      "open-applications-modal",
      handleOpenApplicationsModal,
    );
    return () =>
      window.removeEventListener(
        "open-applications-modal",
        handleOpenApplicationsModal,
      );
  }, []);

  useEffect(() => {
    const handleOpenHeaderCustomization = () =>
      setShowHeaderCustomization(true);
    window.addEventListener(
      "open-header-customization",
      handleOpenHeaderCustomization,
    );
    return () =>
      window.removeEventListener(
        "open-header-customization",
        handleOpenHeaderCustomization,
      );
  }, []);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Обработка URL параметра для открытия модалки обложки
  useEffect(() => {
    const openHeaderTheme = searchParams.get("headerTheme");
    if (openHeaderTheme === "open") {
      const timer = setTimeout(() => {
        setShowHeaderCustomization(true);
        // Удаляем параметр из URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("headerTheme");
        const nextUrl = params.toString()
          ? `/profile?${params.toString()}`
          : "/profile";
        router.replace(nextUrl, { scroll: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const coverStyle = useCoverStyle({
    theme,
    headerBackground,
    backgroundColor,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="w-full mx-auto">
        {/* Плоская шапка профиля - баннер как фон всего блока */}
        <div
          className="relative w-full min-h-[200px] sm:min-h-[240px] md:min-h-[280px] overflow-hidden"
          style={coverStyle}
        >
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenSettings}
              className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-lg bg-black/40 hover:bg-black/55 border border-white/20 px-3.5 py-2 text-sm font-semibold text-white transition-all duration-200 backdrop-blur-sm"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.4 1.3 1.01 1.58.61.28 1.32.17 1.81-.31l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.49.48-.6 1.2-.31 1.81.28.61.89 1.01 1.58 1.01h.09a2 2 0 1 1 0 4h-.09c-.69 0-1.3.4-1.58 1.01-.28.61-.17 1.32.31 1.81l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82V15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1c.28-.61.17-1.32-.31-1.81l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.48.49 1.2.6 1.81.31.61-.28 1.01-.89 1.01-1.58V3a2 2 0 1 1 4 0v.09c0 .69.4 1.3 1.01 1.58.61.28 1.32.17 1.81-.31l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.48.49-.6 1.2-.31 1.81.28.61.89 1.01 1.58 1.01H21a2 2 0 1 1 0 4h-.09c-.69 0-1.3.4-1.58 1.01-.28.61-.17 1.32.31 1.81Z" />
              </svg>
              Редактировать
            </motion.button>
          )}
          {/* Затемняющий градиент для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

          {/* Контент поверх баннера */}
          <div className="relative z-10 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-20 sm:pt-24 md:pt-28">
            {/* Основной контент: Аватар и информация в одну линию */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-5">
              <AvatarBlock
                isOwner={isOwner}
                user={user}
                currentAvatar={currentAvatar}
                status={status}
                onAvatarChange={(val) => {
                  setCurrentAvatar(val);
                  onAvatarChange?.(val);
                }}
                onOpenCover={() => {
                  setShowHeaderCustomization(true);
                  onBackgroundChange?.();
                }}
                onTriggerAvatar={() => {
                  const fileInput = document.querySelector(
                    'input[data-avatar-file-input="true"]',
                  ) as HTMLInputElement | null;
                  if (fileInput) fileInput.click();
                }}
              />

              <div className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-4">
                <HeaderIdentity
                  name={user.name}
                  role={user.role}
                  status={status}
                />

                <CtaRow
                  isOwner={isOwner}
                  hasSocialLinks={hasSocialLinks}
                  user={user}
                  friendshipStatus={friendshipStatus}
                  onSendRequest={onSendRequest}
                  onAcceptIncoming={onAcceptIncoming}
                  onDeclineIncoming={onDeclineIncoming}
                  onRemoveFriend={onRemoveFriend}
                  guestActionsButtonRef={guestActionsButtonRef}
                  guestMenuStyle={guestMenuStyle}
                  mounted={mounted}
                  isGuestActionsOpen={isGuestActionsOpen}
                  setIsGuestActionsOpen={setIsGuestActionsOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <>
          <HeaderCustomization
            user={{ ...user, headerTheme: currentHeaderTheme }}
            onThemeChange={(theme) => {
              setCurrentHeaderTheme(theme);
              onThemeChange?.(theme);
            }}
            isOpen={showHeaderCustomization}
            onClose={() => setShowHeaderCustomization(false)}
          />

          <ApplicationsModal
            isOpen={isApplicationsModalOpen}
            onClose={() => setIsApplicationsModalOpen(false)}
          />
        </>
      )}
    </motion.div>
  );
}
