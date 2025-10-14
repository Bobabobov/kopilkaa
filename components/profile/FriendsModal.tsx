// components/profile/FriendsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFriends } from "./hooks/useFriends";
import FriendsTab from "./FriendsTab";
import FriendsSearch from "./FriendsSearch";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "friends" | "sent" | "received" | "search";
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="friends-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="rounded-2xl shadow-xl max-w-2xl w-full max-h-[75vh] overflow-hidden backdrop-blur-xl flex flex-col"
          style={{
            backgroundColor: "#004643",
            border: "1px solid #abd1c6"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок модалки */}
          <div className="p-4" style={{ backgroundColor: "#f9bc60" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 30, 29, 0.2)" }}
                >
                  <span className="text-xl" style={{ color: "#001e1d" }}>
                    👥
                  </span>
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "#001e1d" }}
                  >
                    Мои друзья
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "#001e1d", opacity: 0.8 }}
                  >
                    {friends.length}{" "}
                    {friends.length === 1
                      ? "друг"
                      : friends.length < 5
                        ? "друга"
                        : "друзей"}
                    {receivedRequests.length > 0 && (
                      <span
                        className="ml-2 px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: "rgba(0, 30, 29, 0.2)" }}
                      >
                        {receivedRequests.length} заявок
                      </span>
                    )}
                    <span className="ml-2 text-xs opacity-75">
                      • Esc для закрытия
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors duration-200"
                style={{ color: "#001e1d" }}
              >
                <svg
                  className="w-6 h-6"
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
          <div className="flex border-b" style={{ borderColor: "#abd1c6" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white">
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "#f9bc60" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Контент */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {activeTab === "friends" && (
              <FriendsTab
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
              <FriendsTab
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
              <FriendsTab
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
              <FriendsSearch
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
