"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFriends } from "@/components/profile/hooks/useFriends";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";
import { LucideIcons } from "@/components/ui/LucideIcons";

type Tab = "friends" | "sent" | "received" | "search";

function FriendsTabContent({
  type,
  data,
  loading,
  currentUserId,
  getUserStatus,
  sendingRequests,
  actions,
}: any) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#abd1c6]">Загрузка...</p>
      </div>
    );
  }

  const items = Array.isArray(data) ? data : [];

  if (items.length === 0) {
    const messages = {
      friends: "У вас пока нет друзей",
      sent: "Нет отправленных заявок",
      received: "Нет входящих заявок",
    };
    return (
      <div className="text-center py-12 rounded-2xl border border-dashed border-[#abd1c6]/30 bg-[#001e1d]/40">
        <p className="text-[#abd1c6]">{messages[type as keyof typeof messages]}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item: any) => {
        const user =
          type === "friends"
            ? currentUserId === item.requesterId
              ? item.receiver
              : item.requester
            : type === "sent"
            ? item.receiver
            : item.requester;

        return (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#001e1d]/25 rounded-xl border border-[#abd1c6]/15 hover:border-[#f9bc60]/30 transition-colors w-full"
          >
            <Link
              href={`/profile/${user.id}`}
              prefetch={false}
              className="flex items-center gap-3 flex-1 group min-w-0"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[#f9bc60] font-bold">
                    {(user.name || user.email.split("@")[0])[0].toUpperCase()}
                  </span>
                )}
              </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[#fffffe] font-medium group-hover:underline truncate">
                  {user.name || user.email.split("@")[0]}
                </p>
                <p className="text-[#abd1c6] text-sm">
                  {getUserStatus(user.lastSeen ?? null).text}
                </p>
              </div>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              {type === "friends" && actions.onRemoveFriend && (
                <button
                  type="button"
                  onClick={() => actions.onRemoveFriend(item.id)}
                  disabled={sendingRequests.has(item.id)}
                  className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-60 w-full sm:w-auto"
                >
                  Удалить
                </button>
              )}

              {type === "sent" && actions.onCancelRequest && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!sendingRequests.has(user.id) && actions.onCancelRequest && item.id) {
                      await actions.onCancelRequest(item.id, user.id);
                    }
                  }}
                  disabled={sendingRequests.has(user.id) || !item.id}
                  className="px-3 py-1.5 bg-[#6B7280]/20 hover:bg-[#6B7280]/30 text-[#abd1c6] text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {sendingRequests.has(user.id) ? "Отмена..." : "Отменить"}
                </button>
              )}

              {type === "received" && (
                <>
                  {actions.onAcceptRequest && (
                    <button
                      type="button"
                      onClick={() => actions.onAcceptRequest(item.id)}
                      disabled={sendingRequests.has(item.id)}
                      className="px-3 py-1.5 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      Принять
                    </button>
                  )}
                  {actions.onDeclineRequest && (
                    <button
                      type="button"
                      onClick={() => actions.onDeclineRequest(item.id)}
                      disabled={sendingRequests.has(item.id)}
                      className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-50"
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

function FriendsSearchContent({
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  currentUserId,
  getUserStatus,
  sendingRequests,
  onSendRequest,
  onCancelRequest,
}: any) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск пользователей..."
          className="w-full px-4 py-3 bg-[#001e1d]/25 border border-[#abd1c6]/30 rounded-xl text-[#fffffe] placeholder-[#abd1c6] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent"
        />
      </div>

      {searchLoading ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#abd1c6]">Поиск...</p>
        </div>
      ) : searchResults.length === 0 && searchQuery ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-[#abd1c6]/30 bg-[#001e1d]/40">
          <p className="text-[#abd1c6]">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchResults.map((user: any) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#001e1d]/25 rounded-xl border border-[#abd1c6]/15 hover:border-[#f9bc60]/30 transition-colors w-full"
          >
              <Link
                href={`/profile/${user.id}`}
                prefetch={false}
              className="flex items-center gap-3 flex-1 group min-w-0"
              >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[#f9bc60] font-bold">
                      {(user.name || user.email.split("@")[0])[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[#fffffe] font-medium group-hover:underline truncate">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className="text-[#abd1c6] text-sm">
                    {getUserStatus(user.lastSeen ?? null).text}
                  </p>
                </div>
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                {user.friendshipStatus !== "PENDING" &&
                  user.friendshipStatus !== "ACCEPTED" && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!sendingRequests.has(user.id) && onSendRequest) {
                          await onSendRequest(user.id);
                        }
                      }}
                      disabled={sendingRequests.has(user.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingRequests.has(user.id) ? "Отправка..." : "Добавить"}
                    </button>
                  )}

                {user.friendshipStatus === "PENDING" &&
                  user.isRequester &&
                  user.friendshipId && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!sendingRequests.has(user.id) && onCancelRequest && user.friendshipId) {
                          await onCancelRequest(user.friendshipId, user.id);
                        }
                      }}
                      disabled={sendingRequests.has(user.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#6B7280] hover:bg-[#4B5563] text-[#fffffe] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function FriendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const allowedTabs = new Set<Tab>(["friends", "sent", "received", "search"]);
  const initialTab: Tab = allowedTabs.has(tabParam as Tab)
    ? (tabParam as Tab)
    : "friends";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [lastReadRequestId, setLastReadRequestId] = useState<string | null>(null);

  useAutoHideScrollbar();

  const {
    friends,
    sentRequests,
    receivedRequests,
    loading,
    currentUserId,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    getUserStatus,
    sendingRequests,
  } = useFriends();

  useEffect(() => {
    const saved = localStorage.getItem("lastReadFriendRequestId");
    if (saved) {
      setLastReadRequestId(saved);
    }
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Помечаем заявки прочитанными, если зашли во вкладку "received"
  useEffect(() => {
    if (activeTab !== "received" || receivedRequests.length === 0) return;
    const latestId = receivedRequests[0].id;
    setLastReadRequestId(latestId);
    localStorage.setItem("lastReadFriendRequestId", latestId);
  }, [activeTab, receivedRequests]);

  const newRequestsCount = useMemo(() => {
    if (!lastReadRequestId || receivedRequests.length === 0) return receivedRequests.length;
    const lastReadIndex = receivedRequests.findIndex((req) => req.id === lastReadRequestId);
    if (lastReadIndex === -1) return receivedRequests.length;
    return lastReadIndex;
  }, [lastReadRequestId, receivedRequests]);

  const tabs = [
    { id: "friends" as Tab, label: "Друзья", count: friends.length, icon: "👥" },
    { id: "sent" as Tab, label: "Отправленные", count: sentRequests.length, icon: "📤" },
    { id: "received" as Tab, label: "Полученные", count: receivedRequests.length, icon: "📥" },
    { id: "search" as Tab, label: "Поиск", icon: "🔍" },
  ];

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

  const summary = [
    {
      label: "Всего друзей",
      value: friends.length,
      icon: <LucideIcons.Users className="text-[#f9bc60]" size="md" />,
      color: "bg-[#f9bc60]/10 border-[#f9bc60]/25",
    },
    {
      label: "Входящие заявки",
      value: receivedRequests.length,
      icon: <LucideIcons.UserPlus className="text-[#10B981]" size="md" />,
      color: "bg-[#10B981]/10 border-[#10B981]/25",
      hint: newRequestsCount > 0 ? `${newRequestsCount} новых` : undefined,
    },
    {
      label: "Отправленные",
      value: sentRequests.length,
      icon: <LucideIcons.Send className="text-[#3b82f6]" size="md" />,
      color: "bg-[#3b82f6]/10 border-[#3b82f6]/25",
    },
  ];

  const goToSearch = () => {
    setActiveTab("search");
    router.replace("/friends?tab=search");
  };

  const refresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen text-[#fffffe]">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-6 sm:space-y-8">
        {/* Шапка */}
        <div className="relative overflow-hidden rounded-2xl border border-[#abd1c6]/20 bg-[#052d29] px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-10 -top-10 w-44 h-44 bg-[#f9bc60]/10 blur-3xl" />
            <div className="absolute -right-8 top-0 w-36 h-36 bg-[#abd1c6]/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-[#abd1c6]">Раздел друзей</p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Мои друзья</h1>
              <p className="text-sm text-[#abd1c6] mt-2 max-w-2xl">
                Управляйте друзьями, отвечайте на заявки или находите новых людей. Всё в одном месте.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goToSearch}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#f9bc60] text-[#001e1d] font-semibold hover:bg-[#e8a545] transition-colors"
              >
                <LucideIcons.UserPlus size="sm" />
                Найти друзей
              </button>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/60 hover:text-[#fffffe] transition-colors"
              >
                <LucideIcons.Refresh size="sm" />
                Обновить
              </button>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/60 hover:text-[#fffffe] transition-colors"
              >
                <LucideIcons.ArrowLeft size="sm" />
                В профиль
              </Link>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {summary.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border ${item.color} p-4 flex items-center gap-3 shadow-md`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#001e1d]/60 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#abd1c6]">{item.label}</p>
                <p className="text-xl font-bold text-[#fffffe]">
                  {item.value}
                  {item.hint && <span className="ml-2 text-xs text-[#f9bc60]">{item.hint}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Контент */}
        <div className="bg-[#052d29] rounded-2xl border border-[#abd1c6]/20 shadow-2xl overflow-hidden">
          <div className="flex-shrink-0 bg-[#021e1c]/95 border-b border-[#abd1c6]/15 px-3 sm:px-5 py-2 sm:py-3 overflow-x-auto">
            <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      router.replace(`/friends?tab=${tab.id}`);
                    }}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#f9bc60] text-[#001e1d] shadow-lg"
                        : "bg-[#0a2d29] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#f9bc60]/50 hover:text-[#fffffe]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[#001e1d]/80 text-[#f9bc60] font-semibold">
                          {tab.count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {activeTab === "friends" && (
                <motion.div
                  key="friends"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FriendsTabContent
                    type="friends"
                    data={friends}
                    loading={loading}
                    currentUserId={currentUserId}
                    getUserStatus={getUserStatus}
                    sendingRequests={sendingRequests}
                    actions={{ onRemoveFriend: handleRemoveFriend }}
                  />
                </motion.div>
              )}

              {activeTab === "sent" && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FriendsTabContent
                    type="sent"
                    data={sentRequests}
                    loading={loading}
                    currentUserId={currentUserId}
                    getUserStatus={getUserStatus}
                    sendingRequests={sendingRequests}
                    actions={{ onCancelRequest: handleCancelRequest }}
                  />
                </motion.div>
              )}

              {activeTab === "received" && (
                <motion.div
                  key="received"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
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
                </motion.div>
              )}

              {activeTab === "search" && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

