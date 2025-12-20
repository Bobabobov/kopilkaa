// components/profile/OtherUserProfile.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import OtherUserLoadingStates from "./OtherUserLoadingStates";
import OtherUserPersonalStats from "./OtherUserPersonalStats";
import OtherUserAchievements from "./OtherUserAchievements";
import OtherUserActivity from "./OtherUserActivity";
import OtherUserDonations from "./OtherUserDonations";
import MutualFriends from "./widgets/MutualFriends";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import ReportUserModal from "./modals/ReportUserModal";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";

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
  isBanned?: boolean;
  bannedUntil?: string | null;
  bannedReason?: string | null;
};

type Friendship = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
};

interface OtherUserProfileProps {
  userId: string;
}

export default function OtherUserProfile({ userId }: OtherUserProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [friendship, setFriendship] = useState<Friendship | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const emitFriendEvents = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("friends-updated"));
      window.dispatchEvent(new CustomEvent("friend-requests-updated"));
    }
  }, []);

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setCurrentUserId(data.user.id);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Обработчик события для открытия модального окна жалобы
  useEffect(() => {
    const handleOpenReportModal = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>;
      if (customEvent.detail?.userId === userId) {
        setIsReportModalOpen(true);
      }
    };

    window.addEventListener("open-report-user-modal", handleOpenReportModal);
    return () => {
      window.removeEventListener("open-report-user-modal", handleOpenReportModal);
    };
  }, [userId]);

  const fetchFriendshipStatus = useCallback(async () => {
    try {
      const friendshipResponse = await fetch(`/api/profile/friends?type=all`, {
        cache: "no-store",
      });
      if (friendshipResponse.ok) {
        const friendshipData = await friendshipResponse.json();
        const userFriendship = friendshipData.friendships.find(
          (f: Friendship) =>
            f.requesterId === userId || f.receiverId === userId,
        );
        setFriendship(userFriendship || null);
      }
    } catch (error) {
      console.error("Load friendship data error:", error);
    }
  }, [userId]);

  // Загрузка данных пользователя
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUserData = async () => {
      try {
        setLoading(true);

        // Загружаем данные пользователя
        const userResponse = await fetch(`/api/users/${userId}`, {
          cache: "no-store", // Не кешируем, чтобы всегда получать актуальные данные
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        } else if (userResponse.status === 404) {
          // Пользователь не найден (возможно удален)
          setUser(null);
          return;
        } else {
          console.error("User not found");
          return;
        }

        // Загружаем статус дружбы
        await fetchFriendshipStatus();
      } catch (error) {
        console.error("Load user data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, userId, fetchFriendshipStatus]);

  // Проверка, является ли пользователь владельцем профиля
  useEffect(() => {
    if (currentUserId && userId && currentUserId === userId) {
      // Перенаправляем на собственный профиль
      router.push("/profile");
    }
  }, [currentUserId, userId, router]);

  const sendFriendRequest = async () => {
    if (!user) return;

    if (!isAuthenticated) {
      showToast(
        "warning",
        "Требуется авторизация",
        "Необходимо войти в аккаунт для добавления в друзья",
      );
      return;
    }

    try {
      const response = await fetch("/api/profile/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setFriendship(data.friendship);
        emitFriendEvents();
        showToast(
          "success",
          "Заявка отправлена!",
          "Заявка в друзья успешно отправлена",
        );
      } else {
        showToast(
          "error",
          "Ошибка отправки",
          data.message || "Не удалось отправить заявку в друзья",
        );
      }
    } catch (error) {
      console.error("Friend request error:", error);
      showToast(
        "error",
        "Ошибка отправки",
        "Не удалось отправить заявку в друзья",
      );
    }
  };

  const acceptFriendRequest = async () => {
    if (!friendship) return;

    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });

      if (response.ok) {
        await fetchFriendshipStatus();
        emitFriendEvents();
        showToast(
          "success",
          "Заявка принята!",
          "Пользователь добавлен в друзья",
        );
      } else {
        showToast(
          "error",
          "Ошибка принятия",
          "Не удалось принять заявку в друзья",
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Ошибка принятия",
        "Не удалось принять заявку в друзья",
      );
    }
  };

  const declineFriendRequest = async () => {
    if (!friendship) return;

    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DECLINED" }),
      });

      if (response.ok) {
        await fetchFriendshipStatus();
        emitFriendEvents();
        showToast("info", "Заявка отклонена", "Заявка в друзья отклонена");
      } else {
        showToast(
          "error",
          "Ошибка отклонения",
          "Не удалось отклонить заявку в друзья",
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Ошибка отклонения",
        "Не удалось отклонить заявку в друзья",
      );
    }
  };

  // Загрузка проверки авторизации
  if (isAuthenticated === null) {
    return <OtherUserLoadingStates state="checking" />;
  }

  // Если не авторизован
  if (isAuthenticated === false) {
    return <OtherUserLoadingStates state="unauthorized" />;
  }

  if (loading) {
    return <OtherUserLoadingStates state="loading" />;
  }

  if (!user) {
    return <OtherUserLoadingStates state="not-found" />;
  }

  // Проверяем, заблокирован ли пользователь
  // Учитываем, что если bannedUntil истёк, пользователь не заблокирован
  const isBanned = user.isBanned === true; // Явная проверка на true
  const bannedUntil = user.bannedUntil ? new Date(user.bannedUntil) : null;
  
  // Пользователь действительно заблокирован только если:
  // 1. isBanned = true
  // 2. И либо нет даты окончания (заблокирован навсегда), либо дата еще не прошла
  const isCurrentlyBanned = isBanned && (
    !bannedUntil || // Заблокирован навсегда
    bannedUntil > new Date() // Заблокирован временно, но срок еще не истёк
  );
  
  // Пользователь заблокирован навсегда
  const isBannedPermanent = isBanned && !bannedUntil;
  
  // Пользователь заблокирован временно
  const isBannedTemporary = isBanned && bannedUntil && bannedUntil > new Date();

  // Если пользователь действительно заблокирован, показываем только сообщение
  if (isCurrentlyBanned) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <UniversalBackground />
        <div className="w-full px-6 pt-32 pb-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-400 mb-3">
                    Чечик в бане
                  </h3>
                  {isBannedPermanent ? (
                    <p className="text-[#abd1c6] text-base">
                      Этот аккаунт заблокирован навсегда.
                    </p>
                  ) : (
                    <p className="text-[#abd1c6] text-base">
                      Этот аккаунт заблокирован до{" "}
                      {bannedUntil?.toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      г. в{" "}
                      {bannedUntil?.toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      .
                    </p>
                  )}
                  {user.bannedReason && (
                    <p className="text-[#abd1c6] text-base mt-3">
                      Причина: {user.bannedReason}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <ToastComponent />
      </div>
    );
  }

  const handleRemoveFriend = async () => {
    if (!friendship?.id) return;
    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchFriendshipStatus();
        emitFriendEvents();
        showToast("success", "Пользователь удалён из друзей");
      } else {
        showToast("error", "Ошибка", "Не удалось удалить из друзей");
      }
    } catch (error) {
      showToast("error", "Ошибка", "Не удалось удалить из друзей");
    }
  };

  const friendshipStatus: "none" | "requested" | "incoming" | "friends" =
    !friendship
      ? "none"
      : friendship.status === "ACCEPTED"
      ? "friends"
      : friendship.requesterId === currentUserId
      ? "requested"
      : "incoming";

  return (
    <div className="min-h-screen relative overflow-hidden" role="main" aria-label="Профиль пользователя">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 pt-0 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Кнопка возврата на свой профиль */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-3 sm:mb-4"
          >
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 rounded-lg transition-all duration-200 group"
            >
              <LucideIcons.ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                Мой профиль
              </span>
            </Link>
          </motion.div>

          {/* Информация о пользователе */}
          <div className="mb-4 sm:mb-6">
            <ProfileHeaderCard
              user={user}
              isOwner={false}
              friendshipStatus={friendshipStatus}
              onSendRequest={sendFriendRequest}
              onAcceptIncoming={acceptFriendRequest}
              onDeclineIncoming={declineFriendRequest}
              onRemoveFriend={friendship?.status === "ACCEPTED" ? handleRemoveFriend : undefined}
            />
          </div>

          {/* Общие друзья (если есть) */}
          <div className="mb-4 sm:mb-6">
            <MutualFriends userId={userId} />
          </div>

          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Левая колонка */}
            <section className="lg:col-span-7 space-y-4 sm:space-y-5 md:space-y-6">
              <OtherUserPersonalStats userId={userId} />
              <OtherUserAchievements userId={userId} />
            </section>

            {/* Правая колонка */}
            <aside className="lg:col-span-5 space-y-4 sm:space-y-5 md:space-y-6">
              <OtherUserDonations userId={userId} />
              <OtherUserActivity userId={userId} />
            </aside>
          </div>
        </div>
      </div>

      {/* Красивые уведомления */}
      <ToastComponent />

      {/* Модальное окно жалобы */}
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={userId}
        userName={user.name}
      />
    </div>
  );
}
