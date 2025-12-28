"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [lastReadRequestId, setLastReadRequestId] = useState<string | null>(null);

  // Функция для определения статуса пользователя (как в других компонентах)
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline" as const, text: "Никогда не был в сети" };
    
    const date = new Date(lastSeen);
    const now = new Date();
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return { status: "offline" as const, text: "Никогда не был в сети" };
    }
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    // Если разница отрицательная (дата в будущем) или пользователь был активен в последние 5 минут - считаем онлайн
    if (diffInMinutes < 0 || diffInMinutes < 5) {
      return { status: "online" as const, text: "Онлайн" };
    }
    
    // Иначе показываем время последнего входа
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInHours < 1) {
      return { status: "offline" as const, text: `${diffInMinutes}м назад` };
    }
    if (diffInHours < 24) {
      return { status: "offline" as const, text: `${diffInHours}ч назад` };
    }
    if (diffInHours < 48) {
      return { status: "offline" as const, text: "Вчера" };
    }
    return { status: "offline" as const, text: date.toLocaleDateString("ru-RU") };
  };

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Получаем ID текущего пользователя
      const meRes = await fetch("/api/profile/me", { cache: "no-store" });
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUserId(meData.user.id);
      } else if (meRes.status === 401) {
        setError("Требуется авторизация");
        setFriends([]);
        setReceivedRequests([]);
        setSentRequests([]);
        return;
      }

      const [friendsRes, receivedRes, sentRes] = await Promise.all([
        fetch("/api/profile/friends?type=friends", { cache: "no-store" }),
        fetch("/api/profile/friends?type=received", { cache: "no-store" }),
        fetch("/api/profile/friends?type=sent", { cache: "no-store" }),
      ]);

      if (
        friendsRes.status === 401 ||
        receivedRes.status === 401 ||
        sentRes.status === 401
      ) {
        setError("Требуется авторизация");
        setFriends([]);
        setReceivedRequests([]);
        setSentRequests([]);
        return;
      }

      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        setFriends(friendsData.friendships || []);
      }

      if (receivedRes.ok) {
        const receivedData = await receivedRes.json();
        const newRequests = receivedData.friendships || [];
        setReceivedRequests(newRequests);

        // Загружаем последнюю прочитанную заявку из localStorage
        const savedLastRead = localStorage.getItem("lastReadFriendRequestId");
        setLastReadRequestId(savedLastRead);
      }

      if (sentRes.ok) {
        const sentData = await sentRes.json();
        setSentRequests(sentData.friendships || []);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    const handleFriendRequestNotification = () => {
      fetchFriends();
    };

    window.addEventListener("friend-requests-updated", handleFriendRequestNotification);
    return () => {
      window.removeEventListener("friend-requests-updated", handleFriendRequestNotification);
    };
  }, [fetchFriends]);

  useEffect(() => {
    const handleFriendsUpdated = () => {
      fetchFriends();
    };

    window.addEventListener("friends-updated", handleFriendsUpdated);
    return () => {
      window.removeEventListener("friends-updated", handleFriendsUpdated);
    };
  }, [fetchFriends]);

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
  const sentRequestsCount = sentRequests.length;

  const goToFriends = (tab: "friends" | "sent" | "received" | "search") => {
    if (receivedRequests.length > 0) {
      const latestRequestId = receivedRequests[0].id;
      setLastReadRequestId(latestRequestId);
      localStorage.setItem("lastReadFriendRequestId", latestRequestId);
    }
    router.push(`/friends?tab=${tab}`);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
      >
        {/* Заголовок */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <LucideIcons.Users className="text-[#f9bc60]" size="sm" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Мои друзья</h3>
                <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5 truncate">
                  {totalFriends > 0 ? `${totalFriends} друзей` : 'Список друзей'}
                  {pendingRequests > 0 && ` · ${pendingRequests} заявок`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                goToFriends("friends");
              }}
              className="text-xs text-[#f9bc60] hover:text-[#e8a545] transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Все
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="p-4 sm:p-5 md:p-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LucideIcons.Loader2 className="text-[#abd1c6] mx-auto mb-2" size="lg" />
                </motion.div>
                <p className="text-sm text-[#abd1c6]">Загрузка...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <LucideIcons.AlertTriangle className="text-red-400 mx-auto mb-2" size="lg" />
                <p className="text-sm text-[#abd1c6] mb-2">Ошибка загрузки</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="text-xs text-[#f9bc60] hover:text-[#e8a545] transition-colors"
                >
                  Попробовать еще раз
                </motion.button>
              </motion.div>
            ) : totalFriends === 0 && pendingRequests === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <LucideIcons.UserPlus className="text-[#abd1c6] mx-auto mb-3" size="2xl" />
                </motion.div>
                <p className="text-base text-[#fffffe] mb-2 font-medium">Пока нет друзей</p>
                <p className="text-sm text-[#abd1c6] mb-4">Найдите интересных людей и заводите новые знакомства</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    goToFriends("search");
                  }}
                  className="px-6 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] rounded-xl transition-colors text-sm font-medium"
                >
                  Найти друзей
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Простые карточки друзей */}
                {friends.slice(0, 4).map((friendship, index) => {
                  const friend = currentUserId === friendship.requesterId 
                    ? friendship.receiver 
                    : friendship.requester;
                  
                  const status = getUserStatus(friend.lastSeen || null);
                  const isOnline = status.status === "online";
                  
                  return (
                    <motion.div
                      key={friendship.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => router.push(`/profile/${friend.id}`)}
                      className="flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg hover:bg-[#001e1d]/30 cursor-pointer transition-colors"
                    >
                      {/* Аватар */}
                      <div className="relative">
                        <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-lg overflow-hidden bg-[#004643] flex items-center justify-center">
                          <img
                            src={friend.avatar || "/default-avatar.png"}
                            alt={friend.name || "Аватар"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                        </div>
                        
                        {/* Онлайн индикатор */}
                        {isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 xs:w-3.5 xs:h-3.5 h-3 bg-[#10B981] rounded-full border-2 border-[#001e1d]" />
                        )}
                      </div>

                      {/* Информация */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#fffffe] font-medium text-xs xs:text-sm truncate">
                          {friend.name || (friend.email ? friend.email.split("@")[0] : "Пользователь")}
                        </p>
                        <p className="text-[#abd1c6] text-[10px] xs:text-xs mt-0.5">
                          {status.text}
                        </p>
                      </div>

                      <LucideIcons.ChevronRight className="text-[#abd1c6] flex-shrink-0" size="sm" />
                    </motion.div>
                  );
                })}

                {/* Простые дополнительные элементы */}
                {totalFriends > 4 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    onClick={() => {
                      goToFriends("friends");
                    }}
                    className="relative flex items-center justify-between p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-gradient-to-r from-[#001e1d]/40 to-[#001e1d]/20 hover:from-[#abd1c6]/10 hover:to-[#001e1d]/30 cursor-pointer transition-all duration-300 border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 shadow-md hover:shadow-lg overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#abd1c6]/0 via-[#abd1c6]/5 to-[#abd1c6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2 xs:gap-3 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-[#abd1c6]/30 to-[#94a1b2]/30 rounded-lg xs:rounded-xl flex items-center justify-center"
                      >
                        <LucideIcons.Users className="text-[#abd1c6]" size="sm" />
                      </motion.div>
                      <span className="text-[#fffffe] font-bold text-xs xs:text-sm">
                        Еще {totalFriends - 4} друзей
                      </span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="relative z-10"
                    >
                      <LucideIcons.ChevronRight className="text-[#abd1c6] group-hover:text-[#abd1c6] transition-colors" size="sm" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Простые заявки в друзья */}
                {pendingRequests > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      goToFriends("received");
                    }}
                    className="flex items-center justify-between p-3 xs:p-4 rounded-xl bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <div className="relative">
                        <LucideIcons.UserCheck className="text-[#f9bc60]" size="sm" />
                        {newRequestsCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-[#fffffe] font-medium text-xs xs:text-sm">{pendingRequests} заявок в друзья</p>
                        {newRequestsCount > 0 && (
                          <p className="text-[#f9bc60] text-[10px] xs:text-xs">{newRequestsCount} новых</p>
                        )}
                      </div>
                    </div>
                    <LucideIcons.ChevronRight className="text-[#f9bc60]" size="sm" />
                  </motion.div>
                )}

                {sentRequestsCount > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      goToFriends("sent");
                    }}
                    className="flex items-center justify-between p-3 xs:p-4 rounded-xl bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <LucideIcons.Send className="text-[#3b82f6]" size="sm" />
                      <div>
                        <p className="text-[#fffffe] font-medium text-xs xs:text-sm">{sentRequestsCount} отправленных заявок</p>
                        <p className="text-[#3b82f6] text-[10px] xs:text-xs">Можно отменить или подождать ответа</p>
                      </div>
                    </div>
                    <LucideIcons.ChevronRight className="text-[#3b82f6]" size="sm" />
                  </motion.div>
                )}

                {/* Простая кнопка поиска друзей */}
                {totalFriends > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      goToFriends("search");
                    }}
                    className="flex items-center justify-center p-3 xs:p-4 rounded-xl border border-dashed border-[#abd1c6]/30 hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <LucideIcons.UserPlus className="text-[#10B981]" size="sm" />
                      <span className="text-[#fffffe] font-medium text-xs xs:text-sm">Найти друзей</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

    </>
  );
}