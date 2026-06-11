"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { ProfileFriendsHeader } from "./friends/ProfileFriendsHeader";
import { ProfileFriendsLoading } from "./friends/ProfileFriendsLoading";
import { ProfileFriendsError } from "./friends/ProfileFriendsError";
import { ProfileFriendsEmpty } from "./friends/ProfileFriendsEmpty";
import { FriendsPreviewList } from "./friends/FriendsPreviewList";
import type { Friendship } from "./friends/types";
import { logRouteCatchError } from "@/lib/api/parseApiError";

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

        const savedLastRead = localStorage.getItem("lastReadFriendRequestId");
        setLastReadRequestId(savedLastRead);
      }

      if (sentRes.ok) {
        const sentData = await sentRes.json();
        setSentRequests(sentData.friendships || []);
      }
    } catch (err) {
      logRouteCatchError("[ProfileFriendsSection] fetchFriends", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    const handleFriendRequestNotification = () => {
      void fetchFriends();
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
      void fetchFriends();
    };

    window.addEventListener("friends-updated", handleFriendsUpdated);
    return () => {
      window.removeEventListener("friends-updated", handleFriendsUpdated);
    };
  }, [fetchFriends]);

  const getNewRequestsCount = () => {
    if (!lastReadRequestId || receivedRequests.length === 0) {
      return receivedRequests.length;
    }

    const lastReadIndex = receivedRequests.findIndex(
      (request) => request.id === lastReadRequestId,
    );

    if (lastReadIndex === -1) {
      return receivedRequests.length;
    }

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
        <ProfileFriendsHeader
          totalFriends={totalFriends}
          pendingRequests={pendingRequests}
          onAllClick={() => goToFriends("friends")}
        />

        <Separator className="my-4 bg-white/10" />

        <CardContent className="space-y-0 !p-0">
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
