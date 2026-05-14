"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useOtherUserData } from "./hooks/useOtherUserData";
import { useOtherUserTrust } from "./hooks/useOtherUserTrust";
import { useOtherUserFriendship } from "./hooks/useOtherUserFriendship";
import type { OtherUserProfileUser } from "./types";

export function useOtherUserProfile(userId: string) {
  const router = useRouter();
  const { showToast, ToastComponent } = useBeautifulToast();

  const emitFriendEvents = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("friends-updated"));
      window.dispatchEvent(new CustomEvent("friend-requests-updated"));
    }
  }, []);

  const { user, loading, isAuthenticated, currentUserId, resolvedUserId } =
    useOtherUserData({ userId });

  const { approvedApplications, trustDerived } = useOtherUserTrust({
    isAuthenticated,
    resolvedUserId,
    fallbackUserId: userId,
  });

  const {
    friendship,
    friendshipStatus,
    fetchFriendshipStatus,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    handleRemoveFriend,
  } = useOtherUserFriendship({
    resolvedUserId,
    isAuthenticated,
    currentUserId,
    user,
    emitFriendEvents,
    showToast,
  });

  useEffect(() => {
    if (currentUserId && resolvedUserId && currentUserId === resolvedUserId) {
      router.push("/profile");
    }
  }, [currentUserId, resolvedUserId, router]);

  return {
    user: user as OtherUserProfileUser | null,
    loading,
    isAuthenticated,
    currentUserId,
    resolvedUserId,
    ToastComponent,
    trustDerived,
    friendship,
    friendshipStatus,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    handleRemoveFriend,
  };
}
