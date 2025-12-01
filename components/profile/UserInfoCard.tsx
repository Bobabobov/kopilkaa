"use client";

import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import AvatarUpload from "./AvatarUpload";
import AvatarFrameCustomization from "./AvatarFrameCustomization";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";
import DonateButton from "@/components/donate/DonateButton";
import { getHeaderTheme } from "@/lib/header-customization";
import { useOnlineStatus } from "@/lib/useOnlineStatus";
import { 
  getTextColorForBackground, 
  getSecondaryTextColorForBackground,
  getOverlayOpacity 
} from "@/lib/color-utils";

interface User {
  id: string;
  email: string;
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
}

interface UserInfoCardProps {
  user: User;
  onThemeChange?: (theme: string | null) => void;
}

function UserInfoCard({ user, onThemeChange }: UserInfoCardProps) {
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);
  const [currentAvatarFrame, setCurrentAvatarFrame] = useState(user.avatarFrame);
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(user.headerTheme);
  const [showFrameCustomization, setShowFrameCustomization] = useState(false);
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  
  useOnlineStatus();
  const theme = getHeaderTheme(currentHeaderTheme || "default");
  
  // Определяем цвета для цветного фона
  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const textColor = backgroundColor ? getTextColorForBackground(backgroundColor) : "#fffffe";
  const secondaryTextColor = backgroundColor ? getSecondaryTextColorForBackground(backgroundColor) : "#abd1c6";
  const overlayOpacity = backgroundColor ? getOverlayOpacity(backgroundColor) : 0;

  useEffect(() => {
    const handleOpenApplicationsModal = () => {
      setIsApplicationsModalOpen(true);
    };

    window.addEventListener("open-applications-modal", handleOpenApplicationsModal);
    return () => window.removeEventListener("open-applications-modal", handleOpenApplicationsModal);
  }, []);

  // Определяем статус пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline", text: "Никогда не был в сети" };

    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes <= 5) {
      return { status: "online", text: "Онлайн" };
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 1)
      return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24)
      return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString("ru-RU") };
  };

  const status = getUserStatus(user.lastSeen || null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl ${
        theme.background === "gradient"
          ? `bg-gradient-to-br ${(theme as any).gradient} border border-[#abd1c6]/30`
          : theme.background === "color"
          ? ""
          : "border border-[#abd1c6]/30"
      }`}
      style={{
        ...(theme.background === "image"
          ? {
              backgroundImage: `url(${(theme as any).image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : theme.background === "color"
          ? {
              backgroundColor: (theme as any).color || "#004643",
              borderColor: backgroundColor ? `${backgroundColor}50` : undefined,
              boxShadow: `0 25px 50px -12px ${backgroundColor || "#004643"}30, 0 0 0 1px ${backgroundColor || "#004643"}20`,
            }
          : {
              boxShadow: "0 25px 50px -12px rgba(0, 70, 67, 0.25), 0 0 0 1px rgba(171, 209, 198, 0.15)",
            }),
      }}
    >
      {/* Декоративные градиентные круги с улучшенными эффектами */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#f9bc60]/25 via-[#f9bc60]/15 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-[#e16162]/25 via-[#e16162]/15 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(171, 209, 198, 0.12) 0%, rgba(171, 209, 198, 0.06) 40%, transparent 70%)"
        }}
      ></div>
      
      {/* Дополнительные декоративные элементы */}
      <div className="absolute top-8 right-8 w-2 h-2 bg-[#f9bc60]/40 rounded-full blur-sm"></div>
      <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-[#e16162]/40 rounded-full blur-sm"></div>
      <div className="absolute top-1/4 left-8 w-1 h-1 bg-[#abd1c6]/50 rounded-full"></div>
      <div className="absolute bottom-1/4 right-12 w-1 h-1 bg-[#abd1c6]/50 rounded-full"></div>
      
      {/* Декоративные линии с улучшенными эффектами */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#abd1c6]/30 via-[#f9bc60]/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#abd1c6]/30 via-[#e16162]/20 to-transparent"></div>
      
      {/* Боковые декоративные линии */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#abd1c6]/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#abd1c6]/20 to-transparent"></div>
      
      {/* Затемнение для читаемости текста */}
      {theme.background !== "color" ? (
        <div className="absolute inset-0 bg-[#004643]/80 backdrop-blur-sm"></div>
      ) : overlayOpacity > 0 ? (
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          style={{ 
            backgroundColor: isColorTheme && backgroundColor 
              ? `rgba(0, 30, 29, ${overlayOpacity})` 
              : "transparent" 
          }}
        ></div>
      ) : null}
      
      <div className="relative z-10">
      {/* Аватар и основная информация */}
      <div className="text-center p-3 sm:p-5 md:p-6 pb-3 sm:pb-4">
        <div className="flex justify-center mb-2 sm:mb-3">
          <AvatarUpload
            currentAvatar={currentAvatar}
            userName={user.name || (!user.hideEmail ? user.email : "Пользователь")}
            avatarFrame={currentAvatarFrame}
            onAvatarChange={setCurrentAvatar}
            onFrameChange={() => setShowFrameCustomization(true)}
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 
            className="text-lg sm:text-xl font-semibold"
            style={{ color: textColor }}
          >
            {user.name || "Пользователь"}
          </h2>
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-[10px] sm:text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <LucideIcons.Shield className="w-3 h-3" />
              <span>ADMIN</span>
            </Link>
          )}
        </div>
        {!user.hideEmail && (
          <p 
            className="text-xs sm:text-sm mb-2 sm:mb-3 break-all px-2"
            style={{ color: secondaryTextColor }}
          >
            {user.email}
          </p>
        )}
        {user.hideEmail && (
          <p 
            className="text-xs sm:text-sm italic mb-2 sm:mb-3"
            style={{ color: `${secondaryTextColor}99` }}
          >
            Email скрыт
          </p>
        )}

        {/* Статус и дата регистрации */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs mb-2 sm:mb-3"
          style={{ color: secondaryTextColor }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                status.status === "online"
                  ? "bg-[#abd1c6] animate-pulse"
                  : "bg-[#94a1b2]"
              }`}
            ></div>
            <span className="whitespace-nowrap">{status.status === "online" ? status.text : `Был ${status.text}`}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <LucideIcons.Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Социальные сети */}
        {(user.vkLink || user.telegramLink || user.youtubeLink) && (
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            {user.vkLink && (
              <a
                href={user.vkLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 rounded-xl border-2 border-[#0077FF]/50 bg-[#0077FF]/15 hover:bg-[#0077FF]/25 hover:border-[#0077FF]/70 transition-all shadow-lg shadow-[#0077FF]/20"
                aria-label="VK"
              >
                <VKIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0077FF]" />
              </a>
            )}
            {user.telegramLink && (
              <a
                href={user.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 rounded-xl border-2 border-[#0088cc]/50 bg-[#0088cc]/15 hover:bg-[#0088cc]/25 hover:border-[#0088cc]/70 transition-all shadow-lg shadow-[#0088cc]/20"
                aria-label="Telegram"
              >
                <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0088cc]" />
              </a>
            )}
            {user.youtubeLink && (
              <a
                href={user.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 rounded-xl border-2 border-[#FF0000]/50 bg-[#FF0000]/15 hover:bg-[#FF0000]/25 hover:border-[#FF0000]/70 transition-all shadow-lg shadow-[#FF0000]/20"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0000]" />
              </a>
            )}
          </div>
        )}

        {/* Быстрые действия */}
        <div 
          className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t"
          style={{ 
            borderColor: isColorTheme && backgroundColor 
              ? `${backgroundColor}20` 
              : "rgba(171, 209, 198, 0.1)" 
          }}
        >
          <Link
            href="/applications"
            className="group flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-[#001e1d]/20 hover:bg-[#001e1d]/40 border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all"
          >
            <div className="w-8 h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center group-hover:bg-[#f9bc60]/20 transition-colors">
              <LucideIcons.Plus className="text-[#f9bc60]" size="sm" />
            </div>
            <span 
              className="text-[10px] sm:text-xs group-hover:text-[#f9bc60] transition-colors text-center"
              style={{ color: secondaryTextColor }}
            >
              Создать заявку
            </span>
          </Link>
          <Link
            href="/support"
            className="group flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-[#001e1d]/20 hover:bg-[#001e1d]/40 border hover:border-[#e16162]/30 transition-all"
            style={{ 
              borderColor: isColorTheme && backgroundColor 
                ? `${backgroundColor}20` 
                : "rgba(171, 209, 198, 0.1)" 
            }}
          >
            <div className="w-8 h-8 bg-[#e16162]/10 rounded-lg flex items-center justify-center group-hover:bg-[#e16162]/20 transition-colors">
              <LucideIcons.Heart className="text-[#e16162]" size="sm" />
            </div>
            <span 
              className="text-[10px] sm:text-xs group-hover:text-[#e16162] transition-colors text-center"
              style={{ color: secondaryTextColor }}
            >
              Пополнить копилку
            </span>
          </Link>
        </div>

        {/* Настройки */}
        <div 
          className="pt-2 sm:pt-3 border-t space-y-2"
          style={{ 
            borderColor: isColorTheme && backgroundColor 
              ? `${backgroundColor}20` 
              : "rgba(171, 209, 198, 0.1)" 
          }}
        >
          <button
            onClick={() => setShowHeaderCustomization(true)}
            className="w-full group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#001e1d]/20 hover:bg-[#001e1d]/40 border hover:border-[#abd1c6]/30 transition-all"
            style={{ 
              borderColor: isColorTheme && backgroundColor 
                ? `${backgroundColor}20` 
                : "rgba(171, 209, 198, 0.1)" 
            }}
          >
            <div className="w-6 h-6 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center group-hover:bg-[#abd1c6]/20 transition-colors">
              <LucideIcons.Palette className="text-[#abd1c6]" size="sm" />
            </div>
            <span 
              className="text-xs sm:text-sm group-hover:opacity-100 transition-colors"
              style={{ color: secondaryTextColor }}
            >
              Выбор фона
            </span>
          </button>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-settings-modal"));
            }}
            className="w-full group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#001e1d]/20 hover:bg-[#001e1d]/40 border hover:border-[#abd1c6]/30 transition-all"
            style={{ 
              borderColor: isColorTheme && backgroundColor 
                ? `${backgroundColor}20` 
                : "rgba(171, 209, 198, 0.1)" 
            }}
          >
            <div className="w-6 h-6 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center group-hover:bg-[#abd1c6]/20 transition-colors">
              <LucideIcons.Settings className="text-[#abd1c6]" size="sm" />
            </div>
            <span 
              className="text-xs sm:text-sm group-hover:opacity-100 transition-colors"
              style={{ color: secondaryTextColor }}
            >
              Настройки
            </span>
          </button>
        </div>
      </div>

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

      <ApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
      />
      </div>
    </motion.div>
  );
}

export default React.memo(UserInfoCard);












