// components/profile/FriendsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useFriends } from "../hooks/useFriends";
// Встроенные компоненты заменили внешние FriendsTab и FriendsSearch
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "friends" | "sent" | "received" | "search";
}

// Встроенный компонент списка друзей
function FriendsTabContent({ type, data, loading, currentUserId, getUserStatus, sendingRequests, actions }: any) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#abd1c6]">Загрузка...</p>
      </div>
    );
  }

  if (data.length === 0) {
    const messages = {
      friends: "У вас пока нет друзей",
      sent: "Нет отправленных заявок", 
      received: "Нет входящих заявок"
    };
    
    return (
      <div className="text-center py-8">
        <p className="text-[#abd1c6]">{messages[type as keyof typeof messages]}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item: any) => {
        const user = type === "friends" 
          ? (currentUserId === item.requesterId ? item.receiver : item.requester)
          : (type === "sent" ? item.receiver : item.requester);
          
        return (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-[#001e1d]/20 rounded-xl">
            <Link href={`/profile/${user.id}`} prefetch={false} className="flex items-center gap-3 flex-1 group">
              <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-[#f9bc60] font-bold">
                    {(user.name || user.email.split("@")[0])[0].toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-[#fffffe] font-medium group-hover:underline">
                  {user.name || user.email.split("@")[0]}
                </p>
                <p className="text-[#abd1c6] text-sm">{getUserStatus(user.lastSeen ?? null).text}</p>
              </div>
            </Link>
            
            <div className="flex gap-2">
              {type === "friends" && actions.onRemoveFriend && (
                <button
                  onClick={() => actions.onRemoveFriend(item.id)}
                  disabled={sendingRequests.has(item.id)}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors"
                >
                  Удалить
                </button>
              )}
              {type === "sent" && actions.onCancelRequest && (
                <button
                  onClick={() => actions.onCancelRequest(item.id)}
                  disabled={sendingRequests.has(item.id)}
                  className="px-3 py-1 bg-[#6B7280]/20 hover:bg-[#6B7280]/30 text-[#abd1c6] text-sm rounded-lg transition-colors"
                >
                  Отменить
                </button>
              )}
              {type === "received" && (
                <>
                  {actions.onAcceptRequest && (
                    <button
                      onClick={() => actions.onAcceptRequest(item.id)}
                      disabled={sendingRequests.has(item.id)}
                      className="px-3 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] text-sm rounded-lg transition-colors"
                    >
                      Принять
                    </button>
                  )}
                  {actions.onDeclineRequest && (
                    <button
                      onClick={() => actions.onDeclineRequest(item.id)}
                      disabled={sendingRequests.has(item.id)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors"
                    >
                      Отклонить
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Встроенный компонент поиска друзей
function FriendsSearchContent({ searchQuery, setSearchQuery, searchResults, searchLoading, currentUserId, getUserStatus, sendingRequests, onSendRequest, onCancelRequest }: any) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск пользователей..."
          className="w-full px-4 py-3 bg-[#001e1d]/20 border border-[#abd1c6]/30 rounded-xl text-[#fffffe] placeholder-[#abd1c6] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent"
        />
      </div>
      
      {searchLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#abd1c6]">Поиск...</p>
        </div>
      ) : searchResults.length === 0 && searchQuery ? (
        <div className="text-center py-8">
          <p className="text-[#abd1c6]">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchResults.map((user: any) => (
            <div key={user.id} className="flex items-center gap-3 p-3 bg-[#001e1d]/20 rounded-xl">
              <Link href={`/profile/${user.id}`} prefetch={false} className="flex items-center gap-3 flex-1 group">
                <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-[#f9bc60] font-bold">
                      {(user.name || user.email.split("@")[0])[0].toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-[#fffffe] font-medium group-hover:underline">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className="text-[#abd1c6] text-sm">{getUserStatus(user.lastSeen ?? null).text}</p>
                </div>
              </Link>
              
              <div className="flex gap-2">
                {user.friendshipStatus !== "PENDING" && user.friendshipStatus !== "ACCEPTED" && (
                  <button
                    onClick={() => onSendRequest(user.id)}
                    disabled={sendingRequests.has(user.id)}
                    className="px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {sendingRequests.has(user.id) ? "Отправка..." : "Добавить"}
                  </button>
                )}
                {user.friendshipStatus === "PENDING" && user.isRequester && user.friendshipId && (
                  <button
                    onClick={() => onCancelRequest(user.friendshipId, user.id)}
                    disabled={sendingRequests.has(user.id)}
                    className="px-4 py-2 bg-[#6B7280] hover:bg-[#4B5563] text-[#fffffe] font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FriendsModal({
  isOpen,
  onClose,
  initialTab = "friends",
}: FriendsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "friends" | "sent" | "received" | "search"
  >(initialTab || "friends");
  const { ToastComponent } = useBeautifulToast();
  
  // Автоскрытие скроллбаров
  useAutoHideScrollbar();

  const {
    // Состояние
    friends,
    sentRequests,
    receivedRequests,
    loading,
    currentUserId,

    // Поиск
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,

    // Действия
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,

    // Утилиты
    getUserStatus,
    sendingRequests,
  } = useFriends();

  // Монтирование для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Управление клавишами
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        const tabs: Array<"friends" | "sent" | "received" | "search"> = [
          "friends",
          "sent",
          "received",
          "search",
        ];
        const currentIndex = tabs.indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex]);
      } else if (event.key === "Tab" && event.shiftKey) {
        event.preventDefault();
        const tabs: Array<"friends" | "sent" | "received" | "search"> = [
          "friends",
          "sent",
          "received",
          "search",
        ];
        const currentIndex = tabs.indexOf(activeTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex]);
      }
    };

    // Сохраняем текущую прокрутку
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;

    // Блокируем прокрутку фона
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = "";
    };
  }, [isOpen, onClose, activeTab]);

  // Обработчики действий
  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
  };

  const handleCancelRequest = async (friendshipId: string, userId: string) => {
    await cancelFriendRequest(friendshipId, userId);
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    await acceptFriendRequest(friendshipId);
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    await declineFriendRequest(friendshipId);
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    await removeFriend(friendshipId);
  };

  if (!isOpen || !mounted) return null;

  const tabs = [
    {
      id: "friends" as const,
      label: "Друзья",
      count: friends.length,
      icon: "👥",
    },
    {
      id: "sent" as const,
      label: "Отправленные",
      count: sentRequests.length,
      icon: "📤",
    },
    {
      id: "received" as const,
      label: "Полученные",
      count: receivedRequests.length,
      icon: "📥",
    },
    { id: "search" as const, label: "Поиск", icon: "🔍" },
  ];

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="friends-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="friends-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] mx-4 flex flex-col custom-scrollbar"
          style={{
            border: '1px solid transparent',
            background: 'linear-gradient(to right, #004643, #001e1d) border-box, linear-gradient(135deg, #004643, #001e1d) padding-box',
            backgroundClip: 'border-box, padding-box',
            boxShadow: '0 0 0 1px rgba(171, 209, 198, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffffe]">
                    Мои друзья
                  </h2>
                  <p className="text-[#abd1c6]">
                    {friends.length}{" "}
                    {friends.length === 1
                      ? "друг"
                      : friends.length < 5
                        ? "друга"
                        : "друзей"}
                    {receivedRequests.length > 0 && (
                      <span className="ml-2">
                        • {receivedRequests.length} новых заявок
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#fffffe]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Табы */}
          <div className="flex border-b border-[#abd1c6]/20 bg-[#abd1c6]/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? "text-[#fffffe]"
                    : "text-[#abd1c6]/60 hover:text-[#abd1c6]"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#f9bc60] text-[#001e1d] font-semibold">
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f9bc60]" />
                )}
              </button>
            ))}
          </div>

          {/* Контент */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "friends" && (
              <FriendsTabContent
                type="friends"
                data={friends}
                loading={loading}
                currentUserId={currentUserId}
                getUserStatus={getUserStatus}
                sendingRequests={sendingRequests}
                actions={{
                  onRemoveFriend: handleRemoveFriend,
                }}
              />
            )}

            {activeTab === "sent" && (
              <FriendsTabContent
                type="sent"
                data={sentRequests}
                loading={loading}
                currentUserId={currentUserId}
                getUserStatus={getUserStatus}
                sendingRequests={sendingRequests}
                actions={{
                  onCancelRequest: handleCancelRequest,
                }}
              />
            )}

            {activeTab === "received" && (
              <FriendsTabContent
                type="received"
                data={receivedRequests}
                loading={loading}
                currentUserId={currentUserId}
                getUserStatus={getUserStatus}
                sendingRequests={sendingRequests}
                actions={{
                  onAcceptRequest: handleAcceptRequest,
                  onDeclineRequest: handleDeclineRequest,
                }}
              />
            )}

            {activeTab === "search" && (
              <FriendsSearchContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                searchLoading={searchLoading}
                currentUserId={currentUserId}
                getUserStatus={getUserStatus}
                sendingRequests={sendingRequests}
                onSendRequest={handleSendRequest}
                onCancelRequest={handleCancelRequest}
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Toast */}
      <ToastComponent />
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
