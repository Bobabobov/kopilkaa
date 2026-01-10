"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";
import { getHeaderTheme } from "@/lib/header-customization";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import { useFloatingMenu } from "./hooks/useFloatingMenu";
import { useUserStatus } from "./hooks/useUserStatus";
import { SocialLinks } from "./header/SocialLinks";
import { FriendActions, type FriendshipStatus } from "./header/FriendActions";
import { OwnerActionsMenu } from "./header/OwnerActionsMenu";
import { GuestActionsMenu } from "./header/GuestActionsMenu";
import { AvatarBlock } from "./header/AvatarBlock";
import { HeaderIdentity } from "./header/HeaderIdentity";
import { HeaderMeta } from "./header/HeaderMeta";
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
  achievementsCount?: number;
  applicationsCount?: number;
  approvedApplications?: number;
  friendsCount?: number;
  donationsCount?: number;
  heroBadge?: HeroBadgeType | null;
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
  new Date(value).toLocaleDateString("ru-RU", { month: "short", year: "numeric" });

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
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(user.headerTheme);
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isGuestActionsOpen, setIsGuestActionsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const guestActionsButtonRef = useRef<HTMLButtonElement>(null);

  const status = useUserStatus(user.lastSeen || null);
  const theme = useMemo(() => getHeaderTheme(currentHeaderTheme || "default"), [currentHeaderTheme]);
  const ownerMenuStyle = useFloatingMenu({
    isOpen: isActionsMenuOpen,
    anchorRef: actionsButtonRef,
    menuSelector: '[data-menu="actions"]',
    onClose: () => setIsActionsMenuOpen(false),
  });
  const guestMenuStyle = useFloatingMenu({
    isOpen: isGuestActionsOpen,
    anchorRef: guestActionsButtonRef,
    menuSelector: '[data-menu="guest"]',
    onClose: () => setIsGuestActionsOpen(false),
  });

  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const hasSocialLinks = !!(user.vkLink || user.telegramLink || user.youtubeLink);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentAvatar(user.avatar || null);
    setCurrentHeaderTheme(user.headerTheme);
  }, [user.avatar, user.headerTheme]);

  useEffect(() => {
    const handleOpenApplicationsModal = () => setIsApplicationsModalOpen(true);
    window.addEventListener("open-applications-modal", handleOpenApplicationsModal);
    return () => window.removeEventListener("open-applications-modal", handleOpenApplicationsModal);
  }, []);

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
          {/* Затемняющий градиент для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          
          {/* Контент поверх баннера */}
          <div className="relative z-10 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-20 sm:pt-24 md:pt-28">
            {/* Основной контент: Аватар и информация в одну линию */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
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

              <div className="flex-1 min-w-0">
                <HeaderIdentity
                  name={user.name}
                  role={user.role}
                  heroBadge={user.heroBadge}
                  status={status}
                />

                <HeaderMeta
                  isOwner={isOwner}
                  emailText={!user.email ? "Email не указан" : user.hideEmail ? "Email скрыт" : user.email}
                  createdText={formatDate(user.createdAt)}
                  showActivity={!!user.lastSeen}
                  activityText={status.text}
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
                  onOpenSettings={onOpenSettings}
                  onOpenCover={() => {
                    setShowHeaderCustomization(true);
                    onBackgroundChange?.();
                  }}
                  onTriggerAvatar={() => {
                    const fileInput = document.querySelector(
                      'input[type="file"][accept*="image"]',
                    ) as HTMLInputElement | null;
                    if (fileInput) fileInput.click();
                  }}
                  actionsButtonRef={actionsButtonRef}
                  guestActionsButtonRef={guestActionsButtonRef}
                  ownerMenuStyle={ownerMenuStyle}
                  guestMenuStyle={guestMenuStyle}
                  mounted={mounted}
                  isActionsMenuOpen={isActionsMenuOpen}
                  setIsActionsMenuOpen={setIsActionsMenuOpen}
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

          <ApplicationsModal isOpen={isApplicationsModalOpen} onClose={() => setIsApplicationsModalOpen(false)} />
        </>
      )}
    </motion.div>
  );
}
