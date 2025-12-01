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
import { getHeaderTheme } from "@/lib/header-customization";
import { useOnlineStatus } from "@/lib/useOnlineStatus";

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
      className={`relative overflow-hidden rounded-xl border border-[#abd1c6]/20 ${
        theme.background === "gradient"
          ? `bg-gradient-to-br ${(theme as any).gradient}`
          : ""
      }`}
      style={
        theme.background === "image"
          ? {
              backgroundImage: `url(${(theme as any).image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Затемнение для читаемости текста */}
      <div className="absolute inset-0 bg-[#004643]/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
      {/* Аватар и основная информация */}
      <div className="text-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
        <div className="flex justify-center mb-2 sm:mb-3">
          <AvatarUpload
            currentAvatar={currentAvatar}
            userName={user.name || (!user.hideEmail ? user.email : "Пользователь")}
            avatarFrame={currentAvatarFrame}
            onAvatarChange={setCurrentAvatar}
            onFrameChange={() => setShowFrameCustomization(true)}
          />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe] mb-1">
          {user.name || "Пользователь"}
        </h2>
        {!user.hideEmail && (
          <p className="text-xs sm:text-sm text-[#abd1c6] mb-2 sm:mb-3 break-all px-2">
            {user.email}
          </p>
        )}
        {user.hideEmail && (
          <p className="text-xs sm:text-sm text-[#abd1c6]/60 italic mb-2 sm:mb-3">
            Email скрыт
          </p>
        )}

        {/* Статус и дата регистрации */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs text-[#abd1c6] mb-2 sm:mb-3">
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
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            {user.vkLink && (
              <a
                href={user.vkLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg border border-[#abd1c6]/20 text-[#abd1c6] hover:border-[#abd1c6]/40 hover:bg-[#001e1d]/30 transition-colors"
                aria-label="VK"
              >
                <VKIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {user.telegramLink && (
              <a
                href={user.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg border border-[#abd1c6]/20 text-[#abd1c6] hover:border-[#abd1c6]/40 hover:bg-[#001e1d]/30 transition-colors"
                aria-label="Telegram"
              >
                <TelegramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {user.youtubeLink && (
              <a
                href={user.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg border border-[#abd1c6]/20 text-[#abd1c6] hover:border-[#abd1c6]/40 hover:bg-[#001e1d]/30 transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Навигация */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-0.5 sm:space-y-1 border-t border-[#abd1c6]/10 pt-2 sm:pt-3">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-applications-modal"));
          }}
          className="group w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-[#001e1d]/30 transition-colors"
        >
          <LucideIcons.FileText className="text-[#f9bc60] flex-shrink-0" size="sm" />
          <span className="text-[#fffffe] font-medium flex-1 text-left text-xs sm:text-sm">Мои заявки</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors flex-shrink-0" size="sm" />
        </button>

        <a
          href="/games"
          className="group w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-[#001e1d]/30 transition-colors"
        >
          <LucideIcons.Rocket className="text-[#abd1c6] flex-shrink-0" size="sm" />
          <span className="text-[#fffffe] font-medium flex-1 text-left text-xs sm:text-sm">Игры</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] transition-colors flex-shrink-0" size="sm" />
        </a>

        <button
          onClick={() => setShowHeaderCustomization(true)}
          className="group w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-[#001e1d]/30 transition-colors"
        >
          <LucideIcons.Palette className="text-[#e16162] flex-shrink-0" size="sm" />
          <span className="text-[#fffffe] font-medium flex-1 text-left text-xs sm:text-sm">Фон профиля</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#e16162] transition-colors flex-shrink-0" size="sm" />
        </button>

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-settings-modal"));
          }}
          className="group w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-[#001e1d]/30 transition-colors"
        >
          <LucideIcons.Settings className="text-[#94a1b2] flex-shrink-0" size="sm" />
          <span className="text-[#fffffe] font-medium flex-1 text-left text-xs sm:text-sm">Настройки</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#94a1b2] transition-colors flex-shrink-0" size="sm" />
        </button>
      </div>

      {/* Быстрые действия */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-[#abd1c6]/10 pt-2 sm:pt-3">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/applications"
            className="group flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-[#001e1d]/20 hover:bg-[#001e1d]/40 border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all"
          >
            <div className="w-8 h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center group-hover:bg-[#f9bc60]/20 transition-colors">
              <LucideIcons.Plus className="text-[#f9bc60]" size="sm" />
            </div>
            <span className="text-[10px] sm:text-xs text-[#abd1c6] group-hover:text-[#fffffe] transition-colors text-center">
              Создать заявку
            </span>
          </Link>
          <Link
            href="/support"
            className="group flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-[#001e1d]/20 hover:bg-[#001e1d]/40 border border-[#abd1c6]/10 hover:border-[#e16162]/30 transition-all"
          >
            <div className="w-8 h-8 bg-[#e16162]/10 rounded-lg flex items-center justify-center group-hover:bg-[#e16162]/20 transition-colors">
              <LucideIcons.Heart className="text-[#e16162]" size="sm" />
            </div>
            <span className="text-[10px] sm:text-xs text-[#abd1c6] group-hover:text-[#fffffe] transition-colors text-center">
              Пополнить копилку
            </span>
          </Link>
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












