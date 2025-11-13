"use client";

import { useState, useEffect } from "react";
import React from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
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




