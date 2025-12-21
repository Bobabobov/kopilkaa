"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AvatarUpload from "./AvatarUpload";
import AvatarFrameCustomization from "./AvatarFrameCustomization";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { getHeaderTheme } from "@/lib/header-customization";
import { getOverlayOpacity, getSecondaryTextColorForBackground, getTextColorForBackground } from "@/lib/color-utils";

type User = {
  id: string;
  email: string | null;
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
  achievementsCount?: number;
  applicationsCount?: number;
  approvedApplications?: number;
  friendsCount?: number;
  donationsCount?: number;
};

type FriendshipStatus = "none" | "requested" | "incoming" | "friends";

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

const getUserStatus = (lastSeen: string | null) => {
  if (!lastSeen) return { status: "offline", text: "Никогда не был в сети" };
  const date = new Date(lastSeen);
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
  if (diffMinutes <= 5) return { status: "online", text: "Онлайн" };
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 1) return { status: "offline", text: `${diffMinutes}м назад` };
  if (diffHours < 24) return { status: "offline", text: `${diffHours}ч назад` };
  if (diffHours < 48) return { status: "offline", text: "Вчера" };
  return { status: "offline", text: date.toLocaleDateString("ru-RU") };
};

function SocialLinks({ user }: { user: User }) {
  if (!user.vkLink && !user.telegramLink && !user.youtubeLink) return null;

  return (
    <motion.div
      className="flex items-center gap-3 flex-nowrap overflow-x-auto pb-1"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {user.vkLink && (
        <motion.a
          href={user.vkLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0077ff]/12 border border-[#0077ff]/30 text-[#0077ff] shadow-sm hover:shadow-md transition-all"
          aria-label="VK"
          whileHover={{ scale: 1.05 }}
        >
          <VKIcon className="w-5 h-5" />
        </motion.a>
      )}
      {user.telegramLink && (
        <motion.a
          href={user.telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#229ed9]/12 border border-[#229ed9]/30 text-[#229ed9] shadow-sm hover:shadow-md transition-all"
          aria-label="Telegram"
          whileHover={{ scale: 1.05 }}
        >
          <TelegramIcon className="w-5 h-5" />
        </motion.a>
      )}
      {user.youtubeLink && (
        <motion.a
          href={user.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ff0000]/12 border border-[#ff0000]/30 text-[#ff0000] shadow-sm hover:shadow-md transition-all"
          aria-label="YouTube"
          whileHover={{ scale: 1.05 }}
        >
          <YouTubeIcon className="w-5 h-5" />
        </motion.a>
      )}
    </motion.div>
  );
}

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
  const [currentAvatarFrame, setCurrentAvatarFrame] = useState(user.avatarFrame);
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(user.headerTheme);
  const [showFrameCustomization, setShowFrameCustomization] = useState(false);
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isGuestActionsOpen, setIsGuestActionsOpen] = useState(false);

  const status = useMemo(() => getUserStatus(user.lastSeen || null), [user.lastSeen]);
  const theme = useMemo(() => getHeaderTheme(currentHeaderTheme || "default"), [currentHeaderTheme]);

  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const textColor = backgroundColor ? getTextColorForBackground(backgroundColor) : "#fffffe";
  const secondaryTextColor = backgroundColor ? getSecondaryTextColorForBackground(backgroundColor) : "#abd1c6";
  const overlayOpacity = backgroundColor ? getOverlayOpacity(backgroundColor) : 0;
  const hasSocialLinks = !!(user.vkLink || user.telegramLink || user.youtubeLink);

  useEffect(() => {
    setCurrentAvatar(user.avatar || null);
    setCurrentAvatarFrame(user.avatarFrame);
    setCurrentHeaderTheme(user.headerTheme);
  }, [user.avatar, user.avatarFrame, user.headerTheme]);

  useEffect(() => {
    const handleOpenApplicationsModal = () => setIsApplicationsModalOpen(true);
    window.addEventListener("open-applications-modal", handleOpenApplicationsModal);
    return () => window.removeEventListener("open-applications-modal", handleOpenApplicationsModal);
  }, []);

  const friendActionBlock = () => {
    if (isOwner) return null;
    if (friendshipStatus === "friends") {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-100/40 bg-emerald-500/10 px-3.5 py-2 min-h-[40px] text-sm font-semibold text-emerald-100">
            ✓ Друзья
          </span>
          {onRemoveFriend && (
            <button
              onClick={onRemoveFriend}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200/50 bg-red-500/10 px-3.5 py-2 min-h-[40px] text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/20"
            >
              <LucideIcons.UserMinus size="sm" />
              Удалить из друзей
            </button>
          )}
        </div>
      );
    }

    if (friendshipStatus === "incoming") {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500 text-center" style={{ color: secondaryTextColor }}>
            Пользователь отправил вам заявку
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={onAcceptIncoming}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-100/50 bg-emerald-500/10 px-3.5 py-2 min-h-[40px] text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/20"
            >
              <LucideIcons.Check size="sm" />
              Принять
            </button>
            <button
              onClick={onDeclineIncoming}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200/50 bg-red-500/10 px-3.5 py-2 min-h-[40px] text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/20"
            >
              <LucideIcons.X size="sm" />
              Отклонить
            </button>
          </div>
        </div>
      );
    }

    if (friendshipStatus === "requested") {
      return (
        <div className="text-center px-3.5 py-2 min-h-[40px] rounded-lg text-sm font-semibold bg-amber-500/10 border border-amber-200/60 text-amber-100">
          Заявка отправлена
        </div>
      );
    }

    return (
      <motion.button
        onClick={onSendRequest}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 min-h-[40px] text-sm font-semibold text-[#fffffe] shadow-sm transition hover:bg-white/15"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <LucideIcons.UserPlus size="sm" />
        Добавить в друзья
      </motion.button>
    );
  };

  const coverStyle = useMemo(() => {
    const fallbackGradient =
      "radial-gradient(120% 100% at 15% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(90% 80% at 80% 10%, rgba(30,209,177,0.25), transparent 40%), linear-gradient(135deg, #1fe0ba 0%, #11aa92 45%, #0a4c43 100%)";

    if (headerBackground) {
      return {
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as React.CSSProperties;
    }

    if (theme.background === "image" && (theme as any).image) {
      return {
        backgroundImage: `url(${(theme as any).image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as React.CSSProperties;
    }

    if (theme.background === "color" && backgroundColor) {
      return {
        backgroundImage: `linear-gradient(135deg, ${backgroundColor}, #0b5f54)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as React.CSSProperties;
    }

    return {
      backgroundImage: fallbackGradient,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as React.CSSProperties;
  }, [backgroundColor, headerBackground, theme.background]);

  const chipClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#1d8a78] bg-[#0f2f2a] px-3.5 py-1.5 text-sm font-semibold text-[#eafef8] shadow-[0_10px_28px_rgba(0,0,0,0.12)] whitespace-nowrap";

  const actionBtnClass =
    "flex items-center justify-center gap-2 rounded-xl border border-[#1d8a78] bg-gradient-to-r from-[#0f3d37] to-[#0d2f2b] px-4 py-2.5 min-h-[46px] text-sm font-semibold text-[#eafef8] shadow-[0_14px_32px_rgba(0,0,0,0.16)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_38px_rgba(0,0,0,0.18)] hover:from-[#125146] hover:to-[#0f3a34]";
  const moreBtnClass =
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 min-h-[34px] text-xs sm:text-sm font-medium text-[#eafef8] shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition hover:bg-white/10 hover:-translate-y-[1px]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="w-full mx-auto px-2 xs:px-3 sm:px-4">
        <div className="relative">
          <div
            className="relative h-[180px] xs:h-[200px] sm:h-[230px] md:h-[250px] lg:h-[270px] rounded-[20px] sm:rounded-[24px] md:rounded-[30px] overflow-hidden shadow-[0_18px_44px_rgba(0,0,0,0.16)] bg-[#0b7d6d]"
            style={coverStyle}
          >
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_35%),radial-gradient(80%_60%_at_20%_20%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(70%_50%_at_80%_0%,rgba(30,209,177,0.12),transparent_50%)]" />
          </div>

          <div className="relative -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-18">
            <div className="rounded-[20px] sm:rounded-[26px] bg-gradient-to-br from-[#0f1f1c] via-[#0c2622] to-[#0b1e1a] border border-[#1d8a78]/45 shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
              <div className="p-4 sm:p-5 md:p-7 lg:p-8 flex flex-col gap-6 sm:gap-8">
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-[auto_1fr]">
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    {isOwner ? (
                      <div className="-mt-10 sm:-mt-12 md:-mt-14 transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:shadow-none hover:brightness-100 [&_*]:transition-none [&_*]:duration-0 [&_*]:transform-none [&_*:hover]:transform-none">
                        <AvatarUpload
                          currentAvatar={currentAvatar}
                          userName={user.name || (!user.hideEmail && user.email ? user.email : "Пользователь")}
                          avatarFrame={currentAvatarFrame}
                          onAvatarChange={(val) => {
                            setCurrentAvatar(val);
                            onAvatarChange?.(val);
                          }}
                          onFrameChange={() => setShowFrameCustomization(true)}
                        />
                      </div>
                    ) : (
                      <div className="relative -mt-8 sm:-mt-10 md:-mt-12 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-[#1d8a78]/55 bg-[#0f2623] shadow-[0_18px_40px_rgba(0,0,0,0.22)] ring-2 sm:ring-4 ring-[#f9bc60]/40 transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] [&_*]:transition-none [&_*]:duration-0 [&_*]:transform-none [&_*:hover]:transform-none">
                        <img
                          src={user.avatar || "/default-avatar.png"}
                          alt=""
                          className="w-full h-full object-cover transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:brightness-100"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                        <span
                          className={`absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
                            status.status === "online" ? "bg-emerald-400" : "bg-slate-400"
                          }`}
                          aria-label={status.status === "online" ? "Онлайн" : "Оффлайн"}
                          title={status.status === "online" ? "Онлайн" : "Оффлайн"}
                        />
                      </div>
                    )}

                  </div>

                  <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <motion.h1
                          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#fffffe] leading-tight break-words"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ color: textColor }}
                        >
                          {user.name || "Пользователь"}
                        </motion.h1>
                        {user.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-[#001e1d] shadow-sm">
                            <LucideIcons.Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">ADMIN</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#abd1c6]" style={{ color: secondaryTextColor }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
                              <span
                                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${
                                  status.status === "online" ? "bg-emerald-400" : "bg-slate-500"
                                }`}
                              />
                              <span className="truncate">{status.status === "online" ? status.text : `Был ${status.text}`}</span>
                            </span>
                            {isOwner && (
                              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[#abd1c6] text-[10px] sm:text-xs">
                                <LucideIcons.Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate max-w-[150px] sm:max-w-none">
                                  {!user.email ? "Email не указан" : user.hideEmail ? "Email скрыт" : user.email}
                                </span>
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
                              <LucideIcons.Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{formatDate(user.createdAt)}</span>
                            </span>
                            {user.lastSeen && (
                              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs hidden sm:inline-flex">
                                <LucideIcons.Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">Активность: {status.text}</span>
                              </span>
                            )}
                          </div>

                          {isOwner ? (
                            <div className="relative flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
                              <Link
                                href="/support"
                                className="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full border border-amber-200/50 bg-amber-500/12 px-2 sm:px-3 py-1.5 min-h-[32px] sm:min-h-[34px] text-[10px] sm:text-xs md:text-sm font-medium text-[#fff8ea] transition hover:-translate-y-[1px] hover:bg-amber-500/20 whitespace-nowrap"
                              >
                                <LucideIcons.Heart size="sm" />
                                <span className="hidden xs:inline">Поддержать проект</span>
                                <span className="xs:hidden">Поддержать</span>
                              </Link>
                              {hasSocialLinks && <SocialLinks user={user} />}
                              <button
                                onClick={() => setIsActionsMenuOpen((v) => !v)}
                                className={`${moreBtnClass} min-w-[80px] sm:min-w-[120px] justify-center`}
                                aria-label="Меню ещё"
                              >
                                <LucideIcons.More size="sm" />
                                <span className="hidden sm:inline">Ещё</span>
                              </button>
                              {isActionsMenuOpen && (
                                <div
                                  className="absolute right-0 z-20 mt-2 w-48 sm:w-52 md:w-60 rounded-2xl border border-white/12 bg-[#0f2522]/95 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.22)] p-2 space-y-1.5"
                                  onMouseLeave={() => setIsActionsMenuOpen(false)}
                                >
                                  <button
                                    onClick={() => {
                                      window.dispatchEvent(new CustomEvent("open-settings-modal"));
                                      onOpenSettings?.();
                                      setIsActionsMenuOpen(false);
                                    }}
                                    className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#eafef8] border border-transparent hover:border-white/10 hover:bg-white/6 transition"
                                  >
                                    <LucideIcons.Settings size="sm" />
                                    Редактировать
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowHeaderCustomization(true);
                                      onBackgroundChange?.();
                                      setIsActionsMenuOpen(false);
                                    }}
                                    className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#eafef8] border border-transparent hover:border-white/10 hover:bg-white/6 transition"
                                  >
                                    <LucideIcons.Image size="sm" />
                                    Изменить обложку
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowFrameCustomization(true);
                                      setIsActionsMenuOpen(false);
                                    }}
                                    className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#eafef8] border border-transparent hover:border-white/10 hover:bg-white/6 transition"
                                  >
                                    <LucideIcons.Upload size="sm" />
                                    Изменить аватар
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="relative flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
                              {hasSocialLinks && <SocialLinks user={user} />}
                              <Link
                                href="/support"
                                className="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full border border-amber-200/50 bg-amber-500/12 px-2 sm:px-3 py-1.5 min-h-[32px] sm:min-h-[34px] text-[10px] sm:text-xs md:text-sm font-medium text-[#fff8ea] transition hover:-translate-y-[1px] hover:bg-amber-500/20 whitespace-nowrap"
                              >
                                <LucideIcons.Heart size="sm" />
                                <span className="hidden xs:inline">Поддержать проект</span>
                                <span className="xs:hidden">Поддержать</span>
                              </Link>
                              {friendActionBlock()}
                              <button
                                onClick={() => setIsGuestActionsOpen((v) => !v)}
                                className={`${moreBtnClass} min-w-[80px] sm:min-w-[120px] justify-center`}
                                aria-label="Меню действий гостя"
                              >
                                <LucideIcons.More size="sm" />
                                <span className="hidden sm:inline">Ещё</span>
                              </button>
                              {isGuestActionsOpen && (
                                <div
                                  className="absolute right-0 top-full z-20 mt-2 w-44 sm:w-48 md:w-56 rounded-2xl border border-white/12 bg-[#0f2522]/95 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.22)] p-2 space-y-1.5"
                                  onMouseLeave={() => setIsGuestActionsOpen(false)}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      window.dispatchEvent(
                                        new CustomEvent("open-report-user-modal", { detail: { userId: user.id } }),
                                      );
                                      setIsGuestActionsOpen(false);
                                    }}
                                    className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#eafef8] border border-transparent hover:border-white/10 hover:bg-white/6 transition"
                                  >
                                    <LucideIcons.Flag size="sm" />
                                    Пожаловаться
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {isOwner ? null : null}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <>
          <AvatarFrameCustomization
            user={{ ...user, avatarFrame: currentAvatarFrame }}
            onFrameChange={setCurrentAvatarFrame}
            isOpen={showFrameCustomization}
            onClose={() => setShowFrameCustomization(false)}
          />

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
    </motion.section>
  );
}

