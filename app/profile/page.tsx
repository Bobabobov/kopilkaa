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

const ProfileDonations = dynamicComponent(() => import("@/components/profile/sections/ProfileDonations"), {
  loading: () => <div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-48 animate-pulse" />,
  ssr: false,
});

const ProfileRecentActivity = dynamicComponent(() => import("@/components/profile/sections/ProfileRecentActivity"), {
  loading: () => <div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-48 animate-pulse" />,
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

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Информация о пользователе - упрощенная версия */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-64 animate-pulse" />}>
              <UserInfoCard user={user} onThemeChange={handleThemeChange} />
            </Suspense>
          </motion.div>

          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Левая колонка - Статистика и активность (8 колонок) */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6"
              aria-label="Статистика и активность"
            >
              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-64 animate-pulse" />}>
                <ProfilePersonalStats />
              </Suspense>

              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-48 animate-pulse" />}>
                <ProfileRecentActivity />
              </Suspense>
            </motion.section>

            {/* Правая колонка - Друзья, достижения и пожертвования (4 колонки) */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="lg:col-span-4 space-y-4 sm:space-y-5 md:space-y-6"
              aria-label="Друзья, достижения и пожертвования"
            >
              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-48 animate-pulse" />}>
                <ProfileFriendsSection />
              </Suspense>

              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-40 animate-pulse" />}>
                <ProfileAchievements />
              </Suspense>

              <Suspense fallback={<div className="bg-[#004643]/30 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 h-48 animate-pulse" />}>
                <ProfileDonations />
              </Suspense>
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
