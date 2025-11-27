// app/profile/page.tsx
"use client";
// Профиль сильно зависит от динамических данных и куков,
// поэтому явно помечаем маршрут как динамический, чтобы Next
// не пытался предрендерить /profile статически при билде.
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
// Переименовываем импорт, чтобы не конфликтовал с export const dynamic
import dynamicComponent from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileHeader from "@/components/profile/sections/ProfileHeader";
import ProfileLoading from "@/components/profile/sections/ProfileLoading";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useProfileDashboard } from "@/lib/useProfileDashboard";

// Ленивая загрузка компонентов для улучшения производительности
const UserInfoCard = dynamicComponent(() => import("@/components/profile/UserInfoCard"), {
  loading: () => <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-64 animate-pulse" />,
  ssr: false,
});

const ProfilePersonalStats = dynamicComponent(() => import("@/components/profile/sections/ProfilePersonalStats"), {
  loading: () => <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-64 animate-pulse" />,
  ssr: false,
});

const ProfileFriendsSection = dynamicComponent(() => import("@/components/profile/sections/ProfileFriendsSection"), {
  loading: () => <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-48 animate-pulse" />,
  ssr: false,
});

const ProfileAchievements = dynamicComponent(() => import("@/components/profile/sections/ProfileAchievements"), {
  loading: () => <div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-40 animate-pulse" />,
  ssr: false,
});


// Lazy load heavy modals
const SettingsModal = dynamicComponent(
  () => import("@/components/profile/modals/SettingsModal"),
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
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string | null;
};

// Обёртка с Suspense — требуется Next.js для страниц,
// которые используют useSearchParams в режиме CSR bailout.
export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfilePageContent />
    </Suspense>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profileData, loading, error, refetch } = useProfileDashboard();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const user = profileData?.user || null;
  const totalUserApplications = profileData?.stats?.totalApplications ?? 0;
  const hasCreatedApplications = totalUserApplications > 0;

  const handleThemeChange = (newTheme: string | null) => {
    // Оптимистичное обновление - обновляем UI сразу
    if (profileData?.user) {
      const updatedData = {
        ...profileData,
        user: { ...profileData.user, headerTheme: newTheme }
      };
      // Локальное обновление произойдет через refetch после API вызова
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

  // Открываем модальное окно друзей, если это передано через query-параметр
  useEffect(() => {
    const requestedTab = searchParams.get("friendsTab");
    if (!requestedTab) return;

    const allowedTabs = new Set(["friends", "sent", "received", "search"]);
    const tab = allowedTabs.has(requestedTab)
      ? (requestedTab as "friends" | "sent" | "received" | "search")
      : "friends";

    const timer = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("open-friends-modal", {
          detail: { tab },
        }),
      );
    }, 150);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("friendsTab");
    const nextUrl = params.toString() ? `/profile?${params.toString()}` : "/profile";
    router.replace(nextUrl, { scroll: true });

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  // Открываем модальное окно настроек (соцсети), если пришли с /support c параметром
  useEffect(() => {
    const settingsSource = searchParams.get("settings");
    if (!settingsSource) return;

    const timer = window.setTimeout(() => {
      setIsSettingsModalOpen(true);
    }, 150);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("settings");
    const nextUrl = params.toString() ? `/profile?${params.toString()}` : "/profile";
    router.replace(nextUrl, { scroll: true });

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  if (loading) {
    return <ProfileLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <UniversalBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center bg-[#004643]/80 backdrop-blur-xl rounded-3xl p-12 max-w-md border border-[#abd1c6]/20"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LucideIcons.AlertTriangle className="text-red-400" size="xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#fffffe] mb-4">
            Ошибка загрузки
          </h1>
          <p className="text-[#abd1c6] mb-8 text-lg">
            {error}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-bold rounded-full transition-all duration-300"
          >
            <LucideIcons.ArrowRight size="sm" />
            Попробовать снова
          </button>
        </motion.div>
      </div>
    );
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
    <div className="min-h-screen relative overflow-hidden" role="main" aria-label="Профиль пользователя">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Header */}
      <header className="mt-10" aria-label="Заголовок профиля">
        <ProfileHeader user={user} />
      </header>

      {/* Main Content */}
      <div className="w-full px-4 md:px-6 pt-10 md:pt-16 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 md:mb-8"
          >
            <div className="bg-gradient-to-r from-[#004643]/40 via-[#004643]/20 to-[#004643]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#abd1c6]/20">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <LucideIcons.User className="text-[#001e1d]" size="lg" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-2">
                      С возвращением, {user.name || "пользователь"}!
                    </h1>
                    <p className="text-[#abd1c6] text-lg">
                      Проверьте активность и создайте новые истории
                    </p>
                </div>
              </div>
              
              {/* Подсказки для новых пользователей */}
              {profileData &&
                new Date().getTime() - new Date(user.createdAt).getTime() <
                  7 * 24 * 60 * 60 * 1000 &&
                !hasCreatedApplications && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-6 border-t border-[#abd1c6]/20"
                >
                  <div className="flex items-start gap-3 p-4 bg-[#f9bc60]/10 rounded-xl border border-[#f9bc60]/20">
                    <LucideIcons.Lightbulb className="text-[#f9bc60] flex-shrink-0 mt-1" size="md" />
                    <div>
                      <h3 className="text-[#f9bc60] font-semibold mb-2">Добро пожаловать на платформу!</h3>
                      <p className="text-[#abd1c6] text-sm mb-3">
                        Начните с создания своей первой заявки или изучите истории других пользователей
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/applications"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#f9bc60]/20 text-[#f9bc60] rounded-lg text-sm font-medium hover:bg-[#f9bc60]/30 transition-colors"
                        >
                          <LucideIcons.Plus size="xs" />
                          Создать заявку
                        </Link>
                        <Link
                          href="/stories"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#abd1c6]/20 text-[#abd1c6] rounded-lg text-sm font-medium hover:bg-[#abd1c6]/30 transition-colors"
                        >
                          <LucideIcons.BookOpen size="xs" />
                          Смотреть истории
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* Left Sidebar - User Info - 3 колонки */}
            <aside className="lg:col-span-3 space-y-4 md:space-y-6 order-1 lg:order-1" aria-label="Информация о пользователе">
              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-64 animate-pulse" />}>
                <UserInfoCard user={user} onThemeChange={handleThemeChange} />
              </Suspense>
            </aside>

            {/* Center - Main Content - 6 колонок */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6 space-y-4 md:space-y-6 order-3 lg:order-2"
              aria-label="Основной контент"
            >
              {/* Подробная статистика */}
              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-64 animate-pulse" />}>
                <ProfilePersonalStats />
              </Suspense>
            </motion.section>

            {/* Right Sidebar - Friends & Activity - 3 колонки */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3 space-y-4 md:space-y-6 order-2 lg:order-3"
              aria-label="Друзья и активность"
            >
              {/* Friends with enhanced animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-48 animate-pulse" />}>
                  <ProfileFriendsSection />
                </Suspense>
              </motion.div>

              {/* Achievements with enhanced animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 h-40 animate-pulse" />}>
                  <ProfileAchievements />
                </Suspense>
              </motion.div>


            </motion.aside>
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
