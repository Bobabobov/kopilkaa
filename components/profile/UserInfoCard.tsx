"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SiteIcons } from "@/components/ui/Icon";
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
      className="lg:col-span-1"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10">
          {/* Avatar */}
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 mt-4">
              {user.name || "Пользователь"}
            </h2>
            {!user.hideEmail && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            )}
            {user.hideEmail && (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Email скрыт
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-4 mb-8">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Дата регистрации:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold text-sm">
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            {/* Мои заявки - Синий градиент */}
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-applications-modal"),
                );
              }}
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-blue-400/20"
            >
              <SiteIcons.Document
                size="md"
                className="text-white group-hover:scale-110 transition-transform"
              />
              <span>Мои заявки</span>
            </button>

            {/* Игры - Фиолетовый градиент */}
            <a
              href="/games"
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-purple-400/20"
            >
              <SiteIcons.Heart
                size="md"
                className="text-white group-hover:scale-110 transition-transform"
              />
              <span>Игры</span>
            </a>

            {/* Кастомизация заголовка - Фиолетовый градиент */}
            <button
              onClick={() => setShowHeaderCustomization(true)}
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-purple-400/20"
            >
              <svg
                className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
              <span>Тема заголовка</span>
            </button>

            {/* Настройки - Серый градиент */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-settings-modal"));
              }}
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-500/20"
            >
              <SiteIcons.Settings
                size="md"
                className="text-white group-hover:scale-110 transition-transform"
              />
              <span>Настройки</span>
            </button>
          </div>
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
