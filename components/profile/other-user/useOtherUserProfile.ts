"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useOtherUserData } from "./hooks/useOtherUserData";
import { useOtherUserTrust } from "./hooks/useOtherUserTrust";
import { useOtherUserFriendship } from "./hooks/useOtherUserFriendship";
import type { OtherUserProfileUser } from "./types";

export function useOtherUserProfile(userId: string) {
  const router = useRouter();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const emitFriendEvents = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("friends-updated"));
      window.dispatchEvent(new CustomEvent("friend-requests-updated"));
    }
  }, []);

  const { user, loading, isAuthenticated, currentUserId, resolvedUserId } =
    useOtherUserData({ userId });

  useEffect(() => {
    const handleOpenReportModal = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>;
      const targetId = resolvedUserId || user?.id || null;
      if (targetId && customEvent.detail?.userId === targetId) {
        setIsReportModalOpen(true);
      }
    };

    window.addEventListener("open-report-user-modal", handleOpenReportModal);
    return () => {
      window.removeEventListener(
        "open-report-user-modal",
        handleOpenReportModal,
      );
    };
  }, [resolvedUserId, user?.id]);

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
    isReportModalOpen,
    setIsReportModalOpen,
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
