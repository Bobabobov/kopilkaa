"use client";

import { useState, useEffect } from "react";
import React from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import AvatarUpload from "./AvatarUpload";
import AvatarFrameCustomization from "./AvatarFrameCustomization";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./modals/ApplicationsModal";

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

  useEffect(() => {
    const handleOpenApplicationsModal = () => {
      setIsApplicationsModalOpen(true);
    };

    window.addEventListener("open-applications-modal", handleOpenApplicationsModal);
    return () => window.removeEventListener("open-applications-modal", handleOpenApplicationsModal);
  }, []);

  return (
    <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 overflow-hidden">
      <div className="text-center p-6 border-b border-[#abd1c6]/10">
        <AvatarUpload
          currentAvatar={currentAvatar}
          userName={user.name || (!user.hideEmail ? user.email : "Пользователь")}
          avatarFrame={currentAvatarFrame}
          onAvatarChange={setCurrentAvatar}
          onFrameChange={() => setShowFrameCustomization(true)}
        />
        <h2 className="text-xl font-semibold text-[#fffffe] mb-1 mt-4">
          {user.name || "Пользователь"}
        </h2>
        {!user.hideEmail && (
          <p className="text-sm text-[#abd1c6]">
            {user.email}
          </p>
        )}
        {user.hideEmail && (
          <p className="text-sm text-[#abd1c6]/60 italic">
            Email скрыт
          </p>
        )}

        <div className="mt-5 text-left">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#abd1c6]/70">
                Соц сети
              </p>
              <p className="text-[11px] text-[#abd1c6]/60">
                Добавьте ссылки, чтобы с вами было проще связаться
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-settings-modal"));
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f9bc60]/10 text-[11px] font-semibold text-[#f9bc60] hover:bg-[#f9bc60]/20 hover:text-[#fff7e6] transition-colors border border-[#f9bc60]/40"
            >
              <span>
                {user.vkLink || user.telegramLink || user.youtubeLink
                  ? "Изменить"
                  : "Привязать"}
              </span>
            </button>
          </div>

          {user.vkLink || user.telegramLink || user.youtubeLink ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {user.vkLink && (
                <a
                  href={user.vkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] text-xs font-semibold bg-[#4c75a3]/10 hover:bg-[#4c75a3]/20 transition-colors"
                  aria-label="VK"
                >
                  <VKIcon className="w-4 h-4" />
                  <span>VK</span>
                </a>
              )}
              {user.telegramLink && (
                <a
                  href={user.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#229ED9]/60 text-[#229ED9] text-xs font-semibold bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
              )}
              {user.youtubeLink && (
                <a
                  href={user.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] text-xs font-semibold bg-[#ff4f45]/10 hover:bg-[#ff4f45]/20 transition-colors"
                  aria-label="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                  <span>YouTube</span>
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-settings-modal"));
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#abd1c6]/30 text-[#abd1c6] text-xs font-medium bg-[#001e1d]/20 hover:bg-[#001e1d]/40 transition-colors"
              >
                <VKIcon className="w-4 h-4 opacity-80" />
                <span>VK</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-settings-modal"));
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#abd1c6]/30 text-[#abd1c6] text-xs font-medium bg-[#001e1d]/20 hover:bg-[#001e1d]/40 transition-colors"
              >
                <TelegramIcon className="w-4 h-4 opacity-80" />
                <span>Telegram</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-settings-modal"));
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#abd1c6]/30 text-[#abd1c6] text-xs font-medium bg-[#001e1d]/20 hover:bg-[#001e1d]/40 transition-colors"
              >
                <YouTubeIcon className="w-4 h-4 opacity-80" />
                <span>YouTube</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-b border-[#abd1c6]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f9bc60]/20 rounded-lg flex items-center justify-center">
            <LucideIcons.Calendar className="text-[#f9bc60]" size="sm" />
          </div>
          <div>
            <p className="text-[#abd1c6] text-xs">Регистрация</p>
            <p className="text-[#fffffe] font-medium text-sm">
              {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-applications-modal"));
          }}
          className="group w-full flex items-center gap-3 p-3 bg-[#001e1d]/20 hover:bg-[#f9bc60]/10 rounded-xl transition-all"
        >
          <div className="w-8 h-8 bg-[#f9bc60]/20 rounded-lg flex items-center justify-center">
            <LucideIcons.FileText className="text-[#f9bc60]" size="sm" />
          </div>
          <span className="text-[#fffffe] font-medium flex-1 text-left">Мои заявки</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors" size="sm" />
        </button>

        <a
          href="/games"
          className="group w-full flex items-center gap-3 p-3 bg-[#001e1d]/20 hover:bg-[#abd1c6]/10 rounded-xl transition-all"
        >
          <div className="w-8 h-8 bg-[#abd1c6]/20 rounded-lg flex items-center justify-center">
            <LucideIcons.Rocket className="text-[#abd1c6]" size="sm" />
          </div>
          <span className="text-[#fffffe] font-medium flex-1 text-left">Игры</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#abd1c6] transition-colors" size="sm" />
        </a>

        <button
          onClick={() => setShowHeaderCustomization(true)}
          className="group w-full flex items-center gap-3 p-3 bg-[#001e1d]/20 hover:bg-[#e16162]/10 rounded-xl transition-all"
        >
          <div className="w-8 h-8 bg-[#e16162]/20 rounded-lg flex items-center justify-center">
            <LucideIcons.Palette className="text-[#e16162]" size="sm" />
          </div>
          <span className="text-[#fffffe] font-medium flex-1 text-left">Тема заголовка</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#e16162] transition-colors" size="sm" />
        </button>

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-settings-modal"));
          }}
          className="group w-full flex items-center gap-3 p-3 bg-[#001e1d]/20 hover:bg-[#94a1b2]/10 rounded-xl transition-all border-t border-[#abd1c6]/10"
        >
          <div className="w-8 h-8 bg-[#94a1b2]/20 rounded-lg flex items-center justify-center">
            <LucideIcons.Settings className="text-[#94a1b2]" size="sm" />
          </div>
          <span className="text-[#fffffe] font-medium flex-1 text-left">Настройки</span>
          <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#94a1b2] transition-colors" size="sm" />
        </button>
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
  );
}

export default React.memo(UserInfoCard);












