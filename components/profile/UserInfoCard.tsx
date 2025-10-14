"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import AvatarUpload from "./AvatarUpload";
import AvatarFrameCustomization from "./AvatarFrameCustomization";
import HeaderCustomization from "./HeaderCustomization";
import ApplicationsModal from "./ApplicationsModal";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  createdAt: string;
}

interface UserInfoCardProps {
  user: User;
  onThemeChange?: (theme: string | null) => void;
}

export default function UserInfoCard({
  user,
  onThemeChange,
}: UserInfoCardProps) {
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);
  const [currentAvatarFrame, setCurrentAvatarFrame] = useState(
    user.avatarFrame,
  );
  const [currentHeaderTheme, setCurrentHeaderTheme] = useState(
    user.headerTheme,
  );
  const [showFrameCustomization, setShowFrameCustomization] = useState(false);
  const [showHeaderCustomization, setShowHeaderCustomization] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);

  // Обработчик события для открытия модального окна заявок
  useEffect(() => {
    const handleOpenApplicationsModal = () => {
      setIsApplicationsModalOpen(true);
    };

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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="relative overflow-hidden bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-8 border border-[#abd1c6]/20">
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <AvatarUpload
            currentAvatar={currentAvatar}
            userName={
              user.name || (!user.hideEmail ? user.email : "Пользователь")
            }
            avatarFrame={currentAvatarFrame}
            onAvatarChange={setCurrentAvatar}
            onFrameChange={() => setShowFrameCustomization(true)}
          />
          <h2 className="text-2xl font-bold text-[#fffffe] mb-2 mt-6">
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

        {/* Member Since */}
        <div className="bg-[#001e1d]/40 rounded-2xl p-4 mb-8 border border-[#abd1c6]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
                <LucideIcons.Calendar className="text-[#f9bc60]" size="sm" />
              </div>
              <div>
                <p className="text-[#abd1c6] text-xs">Регистрация</p>
                <p className="text-[#fffffe] font-semibold text-sm">
                  {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {/* Мои заявки */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-applications-modal"),
              );
            }}
            className="group w-full flex items-center gap-3 px-5 py-4 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-2xl transition-all duration-300"
          >
            <div className="w-10 h-10 bg-[#f9bc60]/20 group-hover:bg-[#f9bc60]/30 rounded-xl flex items-center justify-center transition-colors">
              <LucideIcons.FileText className="text-[#f9bc60]" size="sm" />
            </div>
            <span className="text-[#fffffe] font-semibold">Мои заявки</span>
            <LucideIcons.ArrowRight className="text-[#abd1c6] group-hover:text-[#f9bc60] ml-auto transition-colors" size="sm" />
          </button>

          {/* Игры */}
          <a
            href="/games"
            className="group w-full flex items-center gap-3 px-5 py-4 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-2xl transition-all duration-300"
          >
            <div className="w-10 h-10 bg-[#f9bc60]/20 group-hover:bg-[#f9bc60]/30 rounded-xl flex items-center justify-center transition-colors">
              <LucideIcons.Rocket className="text-[#f9bc60]" size="sm" />
            </div>
            <span className="text-[#fffffe] font-semibold">Игры</span>
            <LucideIcons.ArrowRight className="text-[#abd1c6] group-hover:text-[#f9bc60] ml-auto transition-colors" size="sm" />
          </a>

          {/* Тема заголовка */}
          <button
            onClick={() => setShowHeaderCustomization(true)}
            className="group w-full flex items-center gap-3 px-5 py-4 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-2xl transition-all duration-300"
          >
            <div className="w-10 h-10 bg-[#f9bc60]/20 group-hover:bg-[#f9bc60]/30 rounded-xl flex items-center justify-center transition-colors">
              <LucideIcons.Palette className="text-[#f9bc60]" size="sm" />
            </div>
            <span className="text-[#fffffe] font-semibold">Тема заголовка</span>
            <LucideIcons.ArrowRight className="text-[#abd1c6] group-hover:text-[#f9bc60] ml-auto transition-colors" size="sm" />
          </button>

          {/* Настройки */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-settings-modal"));
            }}
            className="group w-full flex items-center gap-3 px-5 py-4 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-2xl transition-all duration-300"
          >
            <div className="w-10 h-10 bg-[#f9bc60]/20 group-hover:bg-[#f9bc60]/30 rounded-xl flex items-center justify-center transition-colors">
              <LucideIcons.Settings className="text-[#f9bc60]" size="sm" />
            </div>
            <span className="text-[#fffffe] font-semibold">Настройки</span>
            <LucideIcons.ArrowRight className="text-[#abd1c6] group-hover:text-[#f9bc60] ml-auto transition-colors" size="sm" />
          </button>
        </div>
      </div>

      {/* Модальное окно выбора рамки аватарки */}
      <AvatarFrameCustomization
        user={{ ...user, avatarFrame: currentAvatarFrame }}
        onFrameChange={setCurrentAvatarFrame}
        isOpen={showFrameCustomization}
        onClose={() => setShowFrameCustomization(false)}
      />

      {/* Модальное окно кастомизации заголовка */}
      <HeaderCustomization
        user={{ ...user, headerTheme: currentHeaderTheme }}
        onThemeChange={(theme) => {
          setCurrentHeaderTheme(theme);
          onThemeChange?.(theme);
        }}
        isOpen={showHeaderCustomization}
        onClose={() => setShowHeaderCustomization(false)}
      />

      {/* Модальное окно заявок */}
      <ApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
      />
    </motion.div>
  );
}
