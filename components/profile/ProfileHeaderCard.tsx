"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AvatarUpload from "./AvatarUpload";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { getHeaderTheme } from "@/lib/header-customization";
import { getOverlayOpacity, getSecondaryTextColorForBackground, getTextColorForBackground } from "@/lib/color-utils";
import { getSafeExternalUrl } from "@/lib/safeExternalUrl";

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
  supportBadge?: "supporter" | "subscriber" | null;
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
  const vk = getSafeExternalUrl(user.vkLink);
  const tg = getSafeExternalUrl(user.telegramLink);
  const yt = getSafeExternalUrl(user.youtubeLink);

  if (!vk && !tg && !yt) return null;

  return (
    <motion.div
      className="flex items-center gap-2 flex-nowrap"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {vk && (
        <motion.a
          href={vk}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          aria-label="VK"
          whileHover={{ scale: 1.05 }}
        >
          <VKIcon className="w-5 h-5" />
        </motion.a>
      )}
      {tg && (
        <motion.a
          href={tg}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          aria-label="Telegram"
          whileHover={{ scale: 1.05 }}
        >
          <TelegramIcon className="w-5 h-5" />
        </motion.a>
      )}
      {yt && (
        <motion.a
          href={yt}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
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
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(user.headerTheme);
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isGuestActionsOpen, setIsGuestActionsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [guestMenuPosition, setGuestMenuPosition] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const guestActionsButtonRef = useRef<HTMLButtonElement>(null);

  const status = useMemo(() => getUserStatus(user.lastSeen || null), [user.lastSeen]);
  const theme = useMemo(() => getHeaderTheme(currentHeaderTheme || "default"), [currentHeaderTheme]);

  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const textColor = backgroundColor ? getTextColorForBackground(backgroundColor) : "#fffffe";
  const secondaryTextColor = backgroundColor ? getSecondaryTextColorForBackground(backgroundColor) : "#abd1c6";
  const overlayOpacity = backgroundColor ? getOverlayOpacity(backgroundColor) : 0;
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

  // Вычисляем позицию меню для владельца
  useEffect(() => {
    if (isActionsMenuOpen && actionsButtonRef.current) {
      const rect = actionsButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isActionsMenuOpen]);

  // Вычисляем позицию меню для гостя
  useEffect(() => {
    if (isGuestActionsOpen && guestActionsButtonRef.current) {
      const rect = guestActionsButtonRef.current.getBoundingClientRect();
      setGuestMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isGuestActionsOpen]);

  // Закрываем меню при клике вне его
  useEffect(() => {
    if (!isActionsMenuOpen && !isGuestActionsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        actionsButtonRef.current &&
        !actionsButtonRef.current.contains(target) &&
        !target.closest('[data-menu="actions"]')
      ) {
        setIsActionsMenuOpen(false);
      }
      if (
        guestActionsButtonRef.current &&
        !guestActionsButtonRef.current.contains(target) &&
        !target.closest('[data-menu="guest"]')
      ) {
        setIsGuestActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActionsMenuOpen, isGuestActionsOpen]);

  const friendActionBlock = () => {
    if (isOwner) return null;
    if (friendshipStatus === "friends") {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white">
            ✓ Друзья
          </span>
          {onRemoveFriend && (
            <button
              onClick={onRemoveFriend}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
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
          <p className="text-xs text-white/70 text-center">
            Пользователь отправил вам заявку
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAcceptIncoming}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/50 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
            >
              <LucideIcons.Check size="sm" />
              Принять
            </button>
            <button
              onClick={onDeclineIncoming}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
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
        <div className="text-center px-4 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-white">
          Заявка отправлена
        </div>
      );
    }

    return (
      <motion.button
        onClick={onSendRequest}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    if (theme.background === "image" && (theme as any).image) {
      return {
        backgroundImage: `url(${(theme as any).image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    if (theme.background === "color" && backgroundColor) {
      return {
        backgroundImage: `linear-gradient(135deg, ${backgroundColor}, #0b5f54)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    return {
      backgroundImage: fallbackGradient,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as React.CSSProperties;
  }, [
    backgroundColor,
    headerBackground,
    currentHeaderTheme,
    theme.background,
    // важно: при смене "картинка -> картинка" theme.background не меняется,
    // поэтому добавляем конкретные значения темы в deps
    (theme as any).image,
    (theme as any).gradient,
  ]);

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
              {/* Аватар слева */}
              <div className="flex-shrink-0">
                {isOwner ? (
                  <>
                    <div className="relative -mt-16 sm:-mt-20 md:-mt-24 transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:shadow-none hover:brightness-100 [&_*]:transition-none [&_*]:duration-0 [&_*]:transform-none [&_*:hover]:transform-none">
                      <AvatarUpload
                        currentAvatar={currentAvatar}
                        userName={user.name || (!user.hideEmail && user.email ? user.email : "Пользователь")}
                        onAvatarChange={(val) => {
                          setCurrentAvatar(val);
                          onAvatarChange?.(val);
                        }}
                      />
                    </div>
                    {/* Кнопки под аватаром */}
                    <div className="mt-3 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowHeaderCustomization(true);
                          onBackgroundChange?.();
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-200"
                        title="Изменить обложку"
                      >
                        <LucideIcons.Image size="sm" />
                        <span>Обложка</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const fileInput = document.querySelector(
                            'input[data-avatar-file-input="true"]',
                          ) as HTMLInputElement | null;
                          if (fileInput) fileInput.click();
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-200"
                        title="Изменить аватар"
                      >
                        <LucideIcons.Upload size="sm" />
                        <span>Аватар</span>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <div className="relative -mt-16 sm:-mt-20 md:-mt-24 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/90 shadow-lg transition-none duration-0 transform-none hover:transform-none hover:scale-100">
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
                        status.status === "online" ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                      aria-label={status.status === "online" ? "Онлайн" : "Оффлайн"}
                      title={status.status === "online" ? "Онлайн" : "Оффлайн"}
                    />
                  </div>
                )}
              </div>

              {/* Информация о пользователе - плоский стиль */}
              <div className="flex-1 min-w-0">
                {/* Имя, статус и бейджи в одну линию */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <motion.h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user.name || "Пользователь"}
                  </motion.h1>
                  {user.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                      <LucideIcons.Shield className="w-3 h-3" />
                      <span className="hidden xs:inline">ADMIN</span>
                    </span>
                  )}
                  {user.supportBadge === "subscriber" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white border border-emerald-300/40 bg-gradient-to-r from-emerald-500/70 to-green-500/60 shadow-[0_10px_30px_rgba(16,185,129,0.18)]">
                      <LucideIcons.Crown className="w-3.5 h-3.5 text-emerald-100" />
                      Подписка
                    </span>
                  )}
                  {user.supportBadge === "supporter" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white border border-pink-300/35 bg-gradient-to-r from-pink-500/55 to-rose-500/45 shadow-[0_10px_30px_rgba(244,63,94,0.14)]">
                      <LucideIcons.Heart className="w-3.5 h-3.5 text-pink-100" />
                      Поддержал проект
                    </span>
                  )}
                  {/* Статус онлайн/оффлайн */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        status.status === "online" ? "bg-emerald-400" : "bg-slate-400"
                      }`}
                    />
                    <span className="text-sm text-white/90">
                      {status.status === "online" 
                        ? status.text 
                        : status.text.startsWith("Никогда")
                          ? status.text
                          : `Был(а) ${status.text}`}
                    </span>
                  </div>
                </div>

                {/* Мета-информация в одну строку */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-white/80 mb-4">
                  {isOwner && (
                    <span className="inline-flex items-center gap-1.5">
                      <LucideIcons.Mail className="w-4 h-4 text-white/70" />
                      <span className="truncate max-w-[200px]">
                        {!user.email ? "Email не указан" : user.hideEmail ? "Email скрыт" : user.email}
                      </span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <LucideIcons.Calendar className="w-4 h-4 text-white/70" />
                    <span>{formatDate(user.createdAt)}</span>
                  </span>
                  {user.lastSeen && (
                    <span className="inline-flex items-center gap-1.5 hidden sm:inline-flex">
                      <LucideIcons.Clock className="w-4 h-4 text-white/70" />
                      <span>Активность: {status.text}</span>
                    </span>
                  )}
                </div>

                {/* CTA-кнопки справа */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {isOwner ? (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/support"
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
                        >
                          <LucideIcons.Heart size="sm" />
                          <span className="hidden xs:inline">Поддержать проект</span>
                          <span className="xs:hidden">Поддержать</span>
                        </Link>
                      </motion.div>
                      {hasSocialLinks && <SocialLinks user={user} />}
                      <motion.button
                        ref={actionsButtonRef}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsActionsMenuOpen((v) => !v)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
                        aria-label="Меню ещё"
                      >
                        <LucideIcons.More size="sm" />
                        <span className="hidden sm:inline">Ещё</span>
                      </motion.button>
                      {mounted && isActionsMenuOpen && createPortal(
                        <AnimatePresence>
                          <motion.div
                            data-menu="actions"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="fixed z-[99999] w-48 sm:w-52 md:w-60 rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl shadow-xl p-2 space-y-1"
                            style={{
                              top: `${menuPosition.top}px`,
                              right: `${menuPosition.right}px`,
                            }}
                            onMouseLeave={() => setIsActionsMenuOpen(false)}
                          >
                            <motion.button
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                onOpenSettings?.();
                                setIsActionsMenuOpen(false);
                              }}
                              className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
                            >
                              <LucideIcons.Settings size="sm" className="text-white/70" />
                              Редактировать
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setShowHeaderCustomization(true);
                                onBackgroundChange?.();
                                setIsActionsMenuOpen(false);
                              }}
                              className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
                            >
                              <LucideIcons.Image size="sm" className="text-white/70" />
                              Изменить обложку
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const fileInput = document.querySelector('input[type="file"][accept*="image"]') as HTMLInputElement;
                                if (fileInput) fileInput.click();
                                setIsActionsMenuOpen(false);
                              }}
                              className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
                            >
                              <LucideIcons.Upload size="sm" className="text-white/70" />
                              Изменить аватар
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setIsActionsMenuOpen(false);
                              }}
                              disabled
                              title="Скоро"
                              className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-red-400/60 bg-transparent opacity-60 cursor-not-allowed"
                            >
                              <LucideIcons.Trash size="sm" className="text-red-400" />
                              Удалить (скоро)
                            </motion.button>
                          </motion.div>
                        </AnimatePresence>,
                        document.body
                      )}
                    </>
                  ) : (
                    <>
                      {hasSocialLinks && <SocialLinks user={user} />}
                      <Link
                        href="/support"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
                      >
                        <LucideIcons.Heart size="sm" />
                        <span className="hidden xs:inline">Поддержать проект</span>
                        <span className="xs:hidden">Поддержать</span>
                      </Link>
                      {friendActionBlock()}
                      <button
                        ref={guestActionsButtonRef}
                        onClick={() => setIsGuestActionsOpen((v) => !v)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
                        aria-label="Меню действий гостя"
                      >
                        <LucideIcons.More size="sm" />
                        <span className="hidden sm:inline">Ещё</span>
                      </button>
                      {mounted && isGuestActionsOpen && createPortal(
                        <AnimatePresence>
                          <motion.div
                            data-menu="guest"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="fixed z-[99999] w-44 sm:w-48 md:w-56 rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl shadow-xl p-2 space-y-1"
                            style={{
                              top: `${guestMenuPosition.top}px`,
                              right: `${guestMenuPosition.right}px`,
                            }}
                            onMouseLeave={() => setIsGuestActionsOpen(false)}
                          >
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => {
                                  window.dispatchEvent(
                                    new CustomEvent("open-report-user-modal", { detail: { userId: user.id } }),
                                  );
                                  setIsGuestActionsOpen(false);
                                }}
                                className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all duration-200"
                              >
                              <LucideIcons.Flag size="sm" className="text-red-400" />
                              Пожаловаться
                            </motion.button>
                          </motion.div>
                        </AnimatePresence>,
                        document.body
                      )}
                    </>
                  )}
                </div>
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
