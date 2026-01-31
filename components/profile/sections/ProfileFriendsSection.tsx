"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ProfileFriendsHeader } from "./friends/ProfileFriendsHeader";
import { ProfileFriendsLoading } from "./friends/ProfileFriendsLoading";
import { ProfileFriendsError } from "./friends/ProfileFriendsError";
import { ProfileFriendsEmpty } from "./friends/ProfileFriendsEmpty";
import { FriendsPreviewList } from "./friends/FriendsPreviewList";
import type { Friendship } from "./friends/types";

export default function ProfileFriendsSection() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [lastReadRequestId, setLastReadRequestId] = useState<string | null>(
    null,
  );

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

    window.addEventListener(
      "friend-requests-updated",
      handleFriendRequestNotification,
    );
    return () => {
      window.removeEventListener(
        "friend-requests-updated",
        handleFriendRequestNotification,
      );
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
    if (!lastReadRequestId || receivedRequests.length === 0)
      return receivedRequests.length;

    // Находим индекс последней прочитанной заявки
    const lastReadIndex = receivedRequests.findIndex(
      (request) => request.id === lastReadRequestId,
    );

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
        <ProfileFriendsHeader
          totalFriends={totalFriends}
          pendingRequests={pendingRequests}
          onAllClick={() => goToFriends("friends")}
        />

        {/* Контент */}
        <div className="p-4 sm:p-5 md:p-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <ProfileFriendsLoading />
            ) : error ? (
              <ProfileFriendsError
                onRetry={() => {
                  window.location.reload();
                }}
              />
            ) : totalFriends === 0 && pendingRequests === 0 ? (
              <ProfileFriendsEmpty
                onFindFriends={() => {
                  goToFriends("search");
                }}
              />
            ) : (
              <FriendsPreviewList
                friends={friends}
                currentUserId={currentUserId}
                totalFriends={totalFriends}
                pendingRequests={pendingRequests}
                sentRequestsCount={sentRequestsCount}
                newRequestsCount={newRequestsCount}
                onOpenProfile={(userId) => router.push(`/profile/${userId}`)}
                onNavigate={goToFriends}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
