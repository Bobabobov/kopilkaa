"use client";

import { useOtherUserProfile } from "./useOtherUserProfile";
import OtherUserLoadingStates from "./OtherUserLoadingStates";
import { BannedNotice, isUserCurrentlyBanned } from "./BannedNotice";
import { OtherUserProfileContent } from "./OtherUserProfileContent";
import ReportUserModal from "./modals/ReportUserModal";
import type { OtherUserProfileProps } from "./types";

export default function OtherUserProfile({ userId }: OtherUserProfileProps) {
  const {
    user,
    loading,
    isAuthenticated,
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
  } = useOtherUserProfile(userId);

  if (isAuthenticated === null) {
    return <OtherUserLoadingStates state="checking" />;
  }

  if (isAuthenticated === false) {
    return <OtherUserLoadingStates state="unauthorized" />;
  }

  if (loading) {
    return <OtherUserLoadingStates state="loading" />;
  }

  if (!user) {
    return <OtherUserLoadingStates state="not-found" />;
  }

  if (isUserCurrentlyBanned(user)) {
    return <BannedNotice user={user} ToastComponent={ToastComponent} />;
  }

  const effectiveUserId = resolvedUserId || user.id;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      role="main"
      aria-label="Профиль пользователя"
    >
      <OtherUserProfileContent
        user={user}
        resolvedUserId={effectiveUserId}
        friendshipStatus={friendshipStatus}
        friendship={friendship}
        trustDerived={trustDerived}
        onSendRequest={sendFriendRequest}
        onAcceptIncoming={acceptFriendRequest}
        onDeclineIncoming={declineFriendRequest}
        onRemoveFriend={
          friendship?.status === "ACCEPTED" ? handleRemoveFriend : undefined
        }
      />

      <ToastComponent />

      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={effectiveUserId}
        userName={user.name}
      />
    </div>
  );
}
