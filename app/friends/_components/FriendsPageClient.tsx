"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFriends } from "@/components/profile/hooks/useFriends";
import { useAutoHideScrollbar } from "@/hooks/ui/useAutoHideScrollbar";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { FriendsList } from "@/components/friends/FriendsList";
import { FriendsOnlineList } from "@/components/friends/FriendsOnlineList";
import { FriendsSearch } from "@/components/friends/FriendsSearch";
import { FriendsSidebar } from "@/components/friends/FriendsSidebar";
import { FriendsPageHeader } from "@/app/friends/_components/FriendsPageHeader";
import { FriendsSummaryCards } from "@/app/friends/_components/FriendsSummaryCards";
import {
  FriendsTabsBar,
  FriendsTabId,
} from "@/app/friends/_components/FriendsTabsBar";

export default function FriendsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const allowedTabs = new Set<FriendsTabId>([
    "friends",
    "sent",
    "received",
    "online",
    "search",
  ]);
  const initialTab: FriendsTabId = allowedTabs.has(tabParam as FriendsTabId)
    ? (tabParam as FriendsTabId)
    : "friends";

  const [activeTab, setActiveTab] = useState<FriendsTabId>(initialTab);
  const [lastReadRequestId, setLastReadRequestId] = useState<string | null>(
    null,
  );

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
    onlineUsers,
    onlineLoading,
    loadOnlineUsers,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    getUserStatus,
    sendingRequests,
  } = useFriends();

  useEffect(() => {
    if (activeTab === "online") {
      loadOnlineUsers();
    }
  }, [activeTab, loadOnlineUsers]);

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
    if (!lastReadRequestId || receivedRequests.length === 0)
      return receivedRequests.length;
    const lastReadIndex = receivedRequests.findIndex(
      (req) => req.id === lastReadRequestId,
    );
    if (lastReadIndex === -1) return receivedRequests.length;
    return lastReadIndex;
  }, [lastReadRequestId, receivedRequests]);

  const tabs = [
    {
      id: "friends" as const,
      label: "Друзья",
      count: friends.length,
      icon: <LucideIcons.UsersRound size="sm" />,
    },
    {
      id: "sent" as const,
      label: "Отправленные",
      count: sentRequests.length,
      icon: <LucideIcons.Send size="sm" />,
    },
    {
      id: "received" as const,
      label: "Полученные",
      count: receivedRequests.length,
      icon: <LucideIcons.Inbox size="sm" />,
    },
    {
      id: "online" as const,
      label: "Онлайн",
      count: onlineUsers.length,
      icon: <LucideIcons.Activity size="sm" />,
    },
    {
      id: "search" as const,
      label: "Поиск",
      icon: <LucideIcons.Search size="sm" />,
    },
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
      icon: <LucideIcons.Users className="text-[#f9bc60]" size="sm" />,
      color: "bg-white/5 border-[#f9bc60]/20",
    },
    {
      label: "Входящие заявки",
      value: receivedRequests.length,
      icon: <LucideIcons.UserPlus className="text-[#10B981]" size="sm" />,
      color: "bg-white/5 border-[#10B981]/20",
      hint: newRequestsCount > 0 ? `${newRequestsCount} новых` : undefined,
    },
    {
      label: "Отправленные",
      value: sentRequests.length,
      icon: <LucideIcons.Send className="text-[#3b82f6]" size="sm" />,
      color: "bg-white/5 border-[#3b82f6]/20",
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
      <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-5 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-6 sm:space-y-8 min-w-0">
        {/* Шапка */}
        <FriendsPageHeader onGoToSearch={goToSearch} onRefresh={refresh} />

        {/* Статистика */}
        <FriendsSummaryCards items={summary} />

        {/* Контент + боковая панель */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] gap-4 lg:gap-6 items-start min-w-0">
          <div className="bg-[#052d29] rounded-2xl border border-[#abd1c6]/20 shadow-2xl overflow-hidden min-w-0">
            <FriendsTabsBar
              tabs={tabs}
              activeTab={activeTab}
              onSelect={(tab) => {
                setActiveTab(tab);
                router.replace(`/friends?tab=${tab}`);
              }}
            />

            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {activeTab === "friends" && (
                  <motion.div
                    key="friends"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FriendsList
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
                    <FriendsList
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
                    <FriendsList
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

                {activeTab === "online" && (
                  <motion.div
                    key="online"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FriendsOnlineList
                      onlineUsers={onlineUsers}
                      onlineLoading={onlineLoading}
                      getUserStatus={getUserStatus}
                      sendingRequests={sendingRequests}
                      onSendRequest={handleSendRequest}
                      onCancelRequest={handleCancelRequest}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <FriendsSidebar />
        </div>
      </div>
    </div>
  );
}
