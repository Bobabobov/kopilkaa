"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";
import { getHeaderTheme } from "@/lib/header-customization";
import { useUserStatus } from "./hooks/useUserStatus";
import { AvatarBlock } from "./header/AvatarBlock";
import { HeaderIdentity } from "./header/HeaderIdentity";
import { ProfileLevelBadge } from "./header/ProfileLevelBadge";
import { CtaRow } from "./header/CtaRow";
import { ProfileCustomizationActions } from "./header/ProfileCustomizationActions";
import { useCoverStyle } from "./hooks/useCoverStyle";
type User = {
  id: string;
  email: string | null;
  role: "USER" | "ADMIN";
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
  markedAsDeceiver?: boolean;
  applicationsCount?: number;
  approvedApplications?: number;
  friendsCount?: number;
  donationsCount?: number;
};

interface ProfileHeaderCardProps {
  user: User;
  isOwner: boolean;
  profileLevel?: number;
  onThemeChange?: (theme: string | null) => void;
  onCoverChange?: (coverUrl: string | null) => void;
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
  profileLevel,
  onThemeChange,
  onCoverChange,
  onOpenSettings,
  onAvatarChange,
}: ProfileHeaderCardProps) {
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || null);
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(
    user.headerTheme,
  );
  const [currentHeaderCover, setCurrentHeaderCover] = useState<string | null>(
    user.headerCover ?? null,
  );
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const status = useUserStatus(user.lastSeen || null);
  const theme = useMemo(
    () => getHeaderTheme(currentHeaderTheme || "default"),
    [currentHeaderTheme],
  );
  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const hasSocialLinks = !!(
    user.vkLink ||
    user.telegramLink ||
    user.youtubeLink
  );

  useEffect(() => {
    setCurrentAvatar(user.avatar || null);
    setCurrentHeaderTheme(user.headerTheme);
    setCurrentHeaderCover(user.headerCover ?? null);
  }, [user.avatar, user.headerTheme, user.headerCover]);

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
    headerCover: currentHeaderCover,
    backgroundColor,
  });
  const hasCustomCover = Boolean(currentHeaderCover);
  const contentTextShadowClass =
    isColorTheme || hasCustomCover
      ? "[text-shadow:0_1px_8px_rgba(0,0,0,0.85)]"
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-full min-w-0"
    >
      <div className="w-full max-w-full min-w-0 mx-auto">
        {/* Плоская шапка профиля - баннер как фон всего блока */}
        <div
          className="relative w-full max-w-full min-h-[180px] xs:min-h-[200px] sm:min-h-[240px] md:min-h-[280px] overflow-hidden"
          style={coverStyle}
        >
          {/* Scrim: для цвета Иттена — без затемнения; для своей обложки — только низ; для тем-картинок — как раньше */}
          {hasCustomCover && !isColorTheme && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black/25 to-transparent" />
          )}
          {!hasCustomCover && !isColorTheme && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          )}

          {profileLevel != null && profileLevel >= 1 && (
            <div className="absolute right-3 top-3 z-20 xs:right-4 xs:top-4 sm:right-5 sm:top-5 md:right-6 md:top-6">
              <ProfileLevelBadge
                level={profileLevel}
                href={isOwner ? '/profile/levels' : undefined}
              />
            </div>
          )}

          {/* Контент поверх баннера — max-w-full чтобы ширина не зависела от наличия соцсетей */}
          <div
            className={`relative z-10 w-full max-w-full min-w-0 px-3 xs:px-4 sm:px-6 md:px-8 pb-4 xs:pb-6 sm:pb-8 pt-16 xs:pt-20 sm:pt-24 md:pt-28 box-border ${contentTextShadowClass}`}
          >
            {/* Основной контент: Аватар и информация в одну линию */}
            <div className="flex flex-col sm:flex-row items-start gap-2 xs:gap-3 sm:gap-4 md:gap-5 min-w-0 w-full max-w-full">
              <AvatarBlock
                isOwner={isOwner}
                user={user}
                currentAvatar={currentAvatar}
                status={status}
                onAvatarChange={(val) => {
                  setCurrentAvatar(val);
                  onAvatarChange?.(val);
                }}
              />

              <div className="flex-1 min-w-0 max-w-full flex flex-col gap-2 xs:gap-3 sm:gap-4 w-full">
                <HeaderIdentity
                  name={user.name}
                  role={user.role}
                  status={status}
                />

                <CtaRow hasSocialLinks={hasSocialLinks} user={user} />
              </div>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="mt-2 sm:mt-2.5">
            <ProfileCustomizationActions
              onOpenCover={() => setShowHeaderCustomization(true)}
              onTriggerAvatar={() => {
                const fileInput = document.querySelector(
                  'input[data-avatar-file-input="true"]',
                ) as HTMLInputElement | null;
                if (fileInput) fileInput.click();
              }}
              onOpenSettings={onOpenSettings}
            />
          </div>
        )}
      </div>

      {isOwner && (
        <>
          <HeaderCustomization
            user={{
              ...user,
              headerTheme: currentHeaderTheme,
              headerCover: currentHeaderCover,
            }}
            onThemeChange={(theme) => {
              setCurrentHeaderTheme(theme);
              onThemeChange?.(theme);
            }}
            onCoverChange={(coverUrl) => {
              setCurrentHeaderCover(coverUrl);
              onCoverChange?.(coverUrl);
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
