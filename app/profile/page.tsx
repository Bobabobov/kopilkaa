// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserInfoCard from "@/components/profile/UserInfoCard";
import ProfileStatsList from "@/components/profile/ProfileStatsList";
import ProfileActivity from "@/components/profile/ProfileActivity";
import ProfileLoading from "@/components/profile/ProfileLoading";
import ProfileLikesSection from "@/components/profile/ProfileLikesSection";
import ProfileFriendsSection from "@/components/profile/ProfileFriendsSection";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { LucideIcons } from "@/components/ui/LucideIcons";

// Lazy load heavy modals
const SettingsModal = dynamic(
  () => import("@/components/profile/SettingsModal"),
  {
    ssr: false,
    loading: () => <div className="hidden" />,
  },
);

type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  lastSeen?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleThemeChange = (newTheme: string | null) => {
    if (user) {
      setUser({ ...user, headerTheme: newTheme });
    }
  };

  // Обработчик события для открытия модального окна настроек
  useEffect(() => {
    const handleOpenSettingsModal = () => {
      setIsSettingsModalOpen(true);
    };

    window.addEventListener("open-settings-modal", handleOpenSettingsModal);
    return () =>
      window.removeEventListener(
        "open-settings-modal",
        handleOpenSettingsModal,
      );
  }, []);

  // Закрываем модальное окно при загрузке страницы (если оно было открыто)
  useEffect(() => {
    setIsSettingsModalOpen(false);
  }, []);

  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((d) => setUser(d.user))
      .catch((error) => {
        console.error("Error loading profile:", error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ProfileLoading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <UniversalBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center bg-[#004643]/80 backdrop-blur-xl rounded-3xl p-12 max-w-md border border-[#abd1c6]/20"
        >
          <div className="w-20 h-20 bg-[#f9bc60]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LucideIcons.User className="text-[#f9bc60]" size="xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#fffffe] mb-4">
            Требуется авторизация
          </h1>
          <p className="text-[#abd1c6] mb-8 text-lg">
            Войдите в аккаунт, чтобы просмотреть свой профиль
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-bold rounded-full transition-all duration-300"
          >
            <LucideIcons.ArrowRight size="sm" />
            Войти в аккаунт
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Header */}
      <div className="mt-20">
        <ProfileHeader user={user} />
      </div>

      {/* Main Content */}
      <div className="w-full px-4 md:px-6 pt-32 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar - User Info - 3 колонки */}
            <div className="lg:col-span-3 space-y-6">
              <UserInfoCard user={user} onThemeChange={handleThemeChange} />
              <ProfileFriendsSection />
            </div>

            {/* Center - Main Content - 6 колонок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Бульдог игра */}
              <div className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl border border-[#abd1c6]/20 overflow-hidden">
                {/* Заголовок */}
                <div className="bg-[#004643]/50 p-6 border-b border-[#abd1c6]/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
                      <LucideIcons.Rocket className="text-[#f9bc60]" size="lg" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#fffffe]">
                        Мини-игра
                      </h2>
                      <p className="text-[#abd1c6] text-sm">Кастомизируй своего персонажа</p>
                    </div>
                  </div>
                </div>

                {/* Область для игры */}
                <div className="p-6">
                  <div 
                    className="w-full bg-[#001e1d]/40 rounded-2xl border border-[#abd1c6]/10 overflow-hidden flex items-center justify-center"
                    style={{ height: '500px' }}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#f9bc60]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LucideIcons.Rocket className="text-[#f9bc60]" size="xl" />
                      </div>
                      <p className="text-[#abd1c6] text-lg">Игра в разработке</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Sidebar - Stats & Activity - 3 колонки */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3 space-y-6"
            >
              <ProfileStatsList />
              <ProfileAchievements />
              <ProfileActivity />
              <ProfileLikesSection />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Модальное окно настроек */}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}
