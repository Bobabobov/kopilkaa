// app/profile/page.tsx
"use client";
// Профиль сильно зависит от динамических данных и куков,
// поэтому явно помечаем маршрут как динамический, чтобы Next
// не пытался предрендерить /profile статически при билде.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
// Переименовываем импорт, чтобы не конфликтовал с export const dynamic
import dynamicComponent from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileLoading from "@/components/profile/sections/ProfileLoading";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useProfileDashboard } from "@/lib/useProfileDashboard";

// Ленивая загрузка компонентов для улучшения производительности
const ProfileHeaderCard = dynamicComponent(
  () => import("@/components/profile/ProfileHeaderCard"),
  {
    loading: () => (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[350px]">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#abd1c6]/20 rounded-lg"></div>
          </div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-[#abd1c6]/10 rounded w-48 mx-auto"></div>
          <div className="h-10 bg-[#abd1c6]/10 rounded-lg mt-6"></div>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const ProfilePersonalStats = dynamicComponent(() => import("@/components/profile/sections/ProfilePersonalStats"), {
  loading: () => (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[400px]">
      <div className="animate-pulse space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-3 sm:pb-4 border-b border-[#abd1c6]/10">
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-24"></div>
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-28"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
        <div className="h-32 bg-[#abd1c6]/10 rounded-xl"></div>
      </div>
    </div>
  ),
  ssr: false,
});

const ProfileFriendsSection = dynamicComponent(() => import("@/components/profile/sections/ProfileFriendsSection"), {
  loading: () => (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[200px]">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const ProfileAchievements = dynamicComponent(() => import("@/components/profile/sections/ProfileAchievements"), {
  loading: () => (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[250px]">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
        <div className="h-12 bg-[#abd1c6]/10 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-14 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const ProfileDonations = dynamicComponent(() => import("@/components/profile/sections/ProfileDonations"), {
  loading: () => (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[280px]">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
          </div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 bg-[#001e1d]/20 rounded-xl">
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const ProfileRecentActivity = dynamicComponent(() => import("@/components/profile/sections/ProfileRecentActivity"), {
  loading: () => (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[300px]">
      <div className="animate-pulse space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/4"></div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});



const MotivationalCard = dynamicComponent(() => import("@/components/profile/sections/MotivationalCard"), {
  loading: () => (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[150px]">
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
      </div>
    </div>
  ),
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
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
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

  // Важно: useProfileDashboard кэширует данные до 30 секунд.
  // После изменения темы/аватара хотим увидеть результат сразу — делаем refetch.
  const handleThemeChange = useCallback(
    async (_newTheme: string | null) => {
      await refetch();
    },
    [refetch],
  );

  const handleAvatarChange = useCallback(
    async (_avatarUrl: string | null) => {
      await refetch();
    },
    [refetch],
  );

  // Глобальное событие открытия настроек убрано — открываем настройки только через onOpenSettings.

  // Перенаправляем на страницу друзей, если пришёл friendsTab
  useEffect(() => {
    const requestedTab = searchParams.get("friendsTab");
    if (!requestedTab) return;

    const allowedTabs = new Set(["friends", "sent", "received", "search"]);
    const tab = allowedTabs.has(requestedTab)
      ? (requestedTab as "friends" | "sent" | "received" | "search")
      : "friends";

    const params = new URLSearchParams(searchParams.toString());
    params.delete("friendsTab");
    const nextUrl = params.toString() ? `/profile?${params.toString()}` : "/profile";
    router.replace(nextUrl, { scroll: true });
    router.push(`/friends?tab=${tab}`);
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
            href="/profile?modal=auth/signup"
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
    <div 
      className="min-h-screen relative overflow-hidden" 
      role="main" 
      aria-label="Профиль пользователя"
    >
      {/* Универсальный фон */}

      {/* Main Content */}
      <div className="relative z-10 w-full px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pt-3 xs:pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 xs:pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-4 xs:space-y-5 sm:space-y-6">
          {/* Информация о пользователе */}
          <div>
            <ProfileHeaderCard
              user={user}
              isOwner
              friendshipStatus="friends"
              onThemeChange={handleThemeChange}
              onBackgroundChange={() => setIsSettingsModalOpen(false)}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          {/* Основной контент: двухколоночный макет */}
          <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-4 xs:gap-5 sm:gap-6 md:gap-6 lg:gap-7">
            <section className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
              <MotivationalCard />
              <ProfilePersonalStats />
              <ProfileRecentActivity />
            </section>

            <aside className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6">
              <ProfileFriendsSection />
              <ProfileAchievements />
              <ProfileDonations />
            </aside>
          </main>
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
