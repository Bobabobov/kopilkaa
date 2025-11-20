// components/profile/OtherUserProfile.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import OtherUserHeader from "./OtherUserHeader";
import OtherUserCard from "./OtherUserCard";
import OtherUserLoadingStates from "./OtherUserLoadingStates";
import OtherUserStats from "./OtherUserStats";
import OtherUserAchievements from "./OtherUserAchievements";
import OtherUserActivity from "./OtherUserActivity";
import RecentApplications from "./widgets/RecentApplications";
import MutualFriends from "./widgets/MutualFriends";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";

// Lazy load heavy modal
const FriendsModal = dynamic(
  () => import("@/components/profile/modals/FriendsModal"),
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
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [friendsModalTab, setFriendsModalTab] = useState<
    "friends" | "sent" | "received" | "search"
  >("friends");
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

  // Обработчик события для открытия модального окна друзей
  useEffect(() => {
    const handleOpenFriendsModal = (event: CustomEvent) => {
      setIsFriendsModalOpen(true);
      if (event.detail?.tab) {
        setFriendsModalTab(event.detail.tab);
      }
    };

    window.addEventListener(
      "open-friends-modal",
      handleOpenFriendsModal as EventListener,
    );
    return () =>
      window.removeEventListener(
        "open-friends-modal",
        handleOpenFriendsModal as EventListener,
      );
  }, []);

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
          console.log("User data loaded:", {
            id: userData.user?.id,
            isBanned: userData.user?.isBanned,
            bannedUntil: userData.user?.bannedUntil,
            bannedReason: userData.user?.bannedReason,
          });
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

  console.log("Ban check:", {
    isBanned,
    bannedUntil: bannedUntil?.toISOString(),
    isCurrentlyBanned,
    isBannedPermanent,
    isBannedTemporary,
    currentDate: new Date().toISOString(),
  });

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
                    Пользователь заблокирован
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Header */}
      <div className="mt-14 sm:mt-18">
        <OtherUserHeader user={user} />
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8">
            {/* Левая колонка — карточка пользователя */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-4"
            >
              <OtherUserCard
                user={user}
                friendship={friendship}
                currentUserId={currentUserId}
                onSendFriendRequest={sendFriendRequest}
                onAcceptFriendRequest={acceptFriendRequest}
                onDeclineFriendRequest={declineFriendRequest}
              />
            </motion.div>

            {/* Правая колонка */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-8"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
                {/* Первый ряд: Статистика + Достижения */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <OtherUserStats userId={userId} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <OtherUserAchievements userId={userId} />
                </motion.div>

                {/* Второй ряд: Общие друзья + Недавние заявки */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <MutualFriends userId={userId} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <RecentApplications userId={userId} />
                </motion.div>

                {/* Третий ряд: Активность на всю ширину */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="xl:col-span-2"
                >
                  <OtherUserActivity userId={userId} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Красивые уведомления */}
      <ToastComponent />

      {/* Модальное окно друзей */}
      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        initialTab={friendsModalTab}
      />
    </div>
  );
}
