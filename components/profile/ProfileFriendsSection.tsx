"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LucideIcons } from "@/components/ui/LucideIcons";

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
  const [lastReadRequestId, setLastReadRequestId] = useState<string | null>(null);

  // Отмечаем заявки как прочитанные при открытии модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Сохраняем ID последней заявки как прочитанную
    if (receivedRequests.length > 0) {
      const latestRequestId = receivedRequests[0].id;
      setLastReadRequestId(latestRequestId);
      localStorage.setItem('lastReadFriendRequestId', latestRequestId);
    }
  };

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
          const newRequests = receivedData.friendships || [];
          setReceivedRequests(newRequests);
          
          // Загружаем последнюю прочитанную заявку из localStorage
          const savedLastRead = localStorage.getItem('lastReadFriendRequestId');
          setLastReadRequestId(savedLastRead);
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
      handleOpenModal();
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

  // Определяем количество новых заявок в друзья
  const getNewRequestsCount = () => {
    if (!lastReadRequestId || receivedRequests.length === 0) return receivedRequests.length;
    
    // Находим индекс последней прочитанной заявки
    const lastReadIndex = receivedRequests.findIndex(request => request.id === lastReadRequestId);
    
    // Если не найдена или это первая заявка, считаем все как новые
    if (lastReadIndex === -1) return receivedRequests.length;
    
    // Возвращаем количество заявок после последней прочитанной
    return lastReadIndex;
  };

  const newRequestsCount = getNewRequestsCount();

  const totalFriends = friends.length;
  const pendingRequests = receivedRequests.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20"
      >
        {/* Заголовок секции */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                newRequestsCount > 0 
                  ? "bg-green-500/20 animate-pulse shadow-lg shadow-green-500/30" 
                  : "bg-[#f9bc60]/20"
              }`}>
                <LucideIcons.Users 
                  className={`transition-all duration-300 ${
                    newRequestsCount > 0 
                      ? "text-green-400 drop-shadow-lg friends-notification" 
                      : "text-[#f9bc60]"
                  }`} 
                  size="sm" 
                />
              </div>
              
              {/* Уведомление о количестве новых заявок */}
              {newRequestsCount > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-bounce shadow-lg border-2 border-white">
                  {newRequestsCount}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#fffffe]">
                Мои друзья
              </h3>
              <p className="text-sm text-[#abd1c6]">
                {totalFriends}{" "}
                {totalFriends === 1
                  ? "друг"
                  : totalFriends < 5
                    ? "друга"
                    : "друзей"}
                {pendingRequests > 0 && (
                  <span className="text-[#f9bc60] ml-2">
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
                handleOpenModal();
              }}
              className="text-sm text-[#f9bc60] hover:text-[#e8a545] transition-colors font-medium flex items-center gap-1"
            >
              Все друзья
              <LucideIcons.ArrowRight size="sm" />
            </button>
          )}
        </div>

        {/* Контент */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Loader2 className="text-[#abd1c6] animate-spin" size="lg" />
            </div>
            <p className="text-sm text-[#abd1c6]">
              Загрузка...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Alert className="text-red-500" size="lg" />
            </div>
            <p className="text-sm text-[#abd1c6]">
              Ошибка загрузки
            </p>
          </div>
        ) : totalFriends === 0 && pendingRequests === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcons.Users className="text-[#abd1c6]" size="xl" />
            </div>
            <p className="text-sm text-[#abd1c6] mb-4">
              Пока нет друзей
            </p>
            <button
              onClick={() => {
                setInitialTab("search");
                handleOpenModal();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] rounded-xl transition-colors text-sm font-semibold"
            >
              <LucideIcons.Plus size="sm" />
              Найти друзей
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Показать первых 2 друзей */}
            {friends.slice(0, 2).map((friendship, index) => {
              const friend = currentUserId === friendship.requesterId 
                ? friendship.receiver 
                : friendship.requester;
              
              return (
                <motion.div
                  key={friendship.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-[#001e1d]/40 rounded-2xl p-4 border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Аватар */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#004643] flex items-center justify-center text-[#abd1c6] font-bold text-sm border border-[#abd1c6]/20 flex-shrink-0">
                      {friend.avatar ? (
                        <img
                          src={friend.avatar}
                          alt="Аватар"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {(friend.name || friend.email.split("@")[0])[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#fffffe] text-sm truncate">
                        {friend.name || friend.email.split("@")[0]}
                      </h4>
                      <p className="text-[#abd1c6] text-xs">
                        Друг с {new Date(friendship.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>

                    {/* Статус */}
                    <div className="w-3 h-3 bg-[#f9bc60] rounded-full"></div>
                  </div>
                </motion.div>
              );
            })}

            {/* Показать количество оставшихся друзей, если их больше 2 */}
            {totalFriends > 2 && (
              <div className="bg-[#abd1c6]/10 border border-[#abd1c6]/30 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <LucideIcons.Users className="text-[#abd1c6]" size="sm" />
                  <span className="text-[#abd1c6] text-sm font-medium">
                    Еще {totalFriends - 2} друзей
                  </span>
                </div>
              </div>
            )}

            {/* Показать заявки в друзья, если есть */}
            {pendingRequests > 0 && (
              <div className="bg-[#f9bc60]/10 border border-[#f9bc60]/30 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <LucideIcons.Clock className="text-[#f9bc60]" size="sm" />
                  <span className="text-[#f9bc60] text-sm font-medium">
                    {pendingRequests} заявок в друзья
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Модальное окно друзей */}
      <FriendsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={initialTab}
      />
    </>
  );
}