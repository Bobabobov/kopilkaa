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
import UniversalBackground from "@/components/ui/UniversalBackground";
// import ThreePet from "@/components/ThreePet"; // Temporarily disabled

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <div className="text-8xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Доступ ограничен
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Войдите в аккаунт, чтобы просмотреть свой профиль
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
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
      <div className="w-full px-6 pt-32 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* User Info Card - 3 колонки */}
            <div className="lg:col-span-3 space-y-6">
              <UserInfoCard user={user} onThemeChange={handleThemeChange} />
              <ProfileFriendsSection />
            </div>

            {/* Центральный блок - 3D Бульдог - 6 колонок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-6"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Заголовок */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-3xl">🎮</span>
                    Мини-игра с Бульдогом
                  </h2>
                  <p className="text-white/70 mt-2">Кастомизируй своего персонажа!</p>
                </div>

                {/* Область для игры */}
                <div className="p-8">
                  <div 
                    className="w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/20 overflow-hidden flex items-center justify-center"
                    style={{ height: '600px' }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎮</div>
                      <p className="text-white/70 text-lg">Здесь будет мини-игра</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Sidebar - Статистика и Активность - 3 колонки */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 space-y-6"
            >
              <ProfileStatsList />
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
