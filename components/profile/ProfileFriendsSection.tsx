"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

// Lazy load heavy modal
const FriendsModal = dynamic(() => import("./FriendsModal"), {
  ssr: false,
  loading: () => <div className="hidden" />,
});

interface User {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  createdAt: string;
  lastSeen?: string | null;
}

interface Friendship {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
  requester: User;
  receiver: User;
  createdAt: string;
}

export default function ProfileFriendsSection() {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<
    "friends" | "sent" | "received" | "search"
  >("friends");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Получаем ID текущего пользователя
        const meRes = await fetch("/api/profile/me", { cache: "no-store" });
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUserId(meData.user.id);
        }

        const [friendsRes, receivedRes] = await Promise.all([
          fetch("/api/profile/friends?type=friends"),
          fetch("/api/profile/friends?type=received"),
        ]);

        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData.friendships || []);
        }

        if (receivedRes.ok) {
          const receivedData = await receivedRes.json();
          setReceivedRequests(receivedData.friendships || []);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();

    // Обработчик для открытия модального окна друзей
    const handleOpenFriendsModal = (event: CustomEvent) => {
      const tab = event.detail?.tab || "friends";
      setInitialTab(tab);
      setIsModalOpen(true);
    };

    window.addEventListener(
      "open-friends-modal",
      handleOpenFriendsModal as EventListener,
    );

    return () => {
      window.removeEventListener(
        "open-friends-modal",
        handleOpenFriendsModal as EventListener,
      );
    };
  }, []);

  const totalFriends = friends.length;
  const pendingRequests = receivedRequests.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
      >
        {/* Заголовок секции */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">👥</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Мои друзья
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalFriends}{" "}
                {totalFriends === 1
                  ? "друг"
                  : totalFriends < 5
                    ? "друга"
                    : "друзей"}
                {pendingRequests > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 ml-2">
                    • {pendingRequests} заявок
                  </span>
                )}
              </p>
            </div>
          </div>

          {(totalFriends > 0 || pendingRequests > 0) && (
            <button
              onClick={() => {
                setInitialTab("friends");
                setIsModalOpen(true);
              }}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
            >
              Все друзья →
            </button>
          )}
        </div>

        {/* Контент */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Загрузка...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ошибка загрузки
            </p>
          </div>
        ) : totalFriends === 0 && pendingRequests === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-3xl mb-3">👥</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Пока нет друзей
            </p>
            <button
              onClick={() => {
                setInitialTab("search");
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
            >
              Найти друзей
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Показать входящие заявки */}
            {pendingRequests > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-sm">
                    📨
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {pendingRequests}{" "}
                      {pendingRequests === 1
                        ? "заявка"
                        : pendingRequests < 5
                          ? "заявки"
                          : "заявок"}{" "}
                      в друзья
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Требуют вашего внимания
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setInitialTab("received");
                      setIsModalOpen(true);
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    Посмотреть →
                  </button>
                </div>
              </div>
            )}

            {/* Показать друзей */}
            {friends.slice(0, 3).map((friendship, index) => {
              const friend =
                friendship.requesterId === currentUserId
                  ? friendship.receiver
                  : friendship.requester;
              if (!friend || !friendship.id || !friendship.id.trim())
                return null;
              return (
                <motion.div
                  key={
                    friendship.id && friendship.id.trim()
                      ? friendship.id
                      : `profile-friend-${index}`
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700/30 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Аватар */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {friend.avatar ? (
                        <img
                          src={friend.avatar}
                          alt="Аватар"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {(friend.name ||
                            friend.email.split("@")[0])[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/profile/${friend.id}`}
                          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate"
                        >
                          {friend.name || friend.email.split("@")[0]}
                        </Link>
                        <span className="text-emerald-500 text-xs">👥</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Друг с{" "}
                          {new Date(friendship.createdAt).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                        <Link
                          href={`/profile/${friend.id}`}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                        >
                          Профиль →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {totalFriends > 3 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setInitialTab("friends");
                    setIsModalOpen(true);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  И еще {totalFriends - 3} друзей...
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Модальное окно */}
      <FriendsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={initialTab}
      />
    </>
  );
}
