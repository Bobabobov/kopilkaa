// components/profile/OtherUserCard.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import ReportUserModal from "./modals/ReportUserModal";
import { OtherUserAvatar, type OtherUserBasic } from "./OtherUserAvatar";
import { OtherUserInfo } from "./OtherUserInfo";
import {
  OtherUserFriendshipActions,
  type OtherUserFriendship,
} from "./OtherUserFriendshipActions";
import { OtherUserExtraActions } from "./OtherUserExtraActions";
import { OtherUserQuickActions } from "./OtherUserQuickActions";
import { useRemoveFriend } from "./hooks/useRemoveFriend";

interface OtherUserCardProps {
  user: OtherUserBasic;
  friendship: OtherUserFriendship | null;
  currentUserId: string | null;
  onSendFriendRequest: () => void;
  onAcceptFriendRequest: () => void;
  onDeclineFriendRequest: () => void;
}

export default function OtherUserCard({
  user,
  friendship,
  currentUserId,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
}: OtherUserCardProps) {
  const { showToast, confirm } = useBeautifulNotifications();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { handleRemoveFriend } = useRemoveFriend({
    friendshipId: friendship?.id,
    confirm,
    showToast,
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:p-7 shadow-2xl border border-[#abd1c6]/20 hover:shadow-3xl hover:border-[#abd1c6]/30 transition-all duration-500 group sticky top-6"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        <div className="relative z-10 space-y-6">
          <OtherUserAvatar user={user} />
          <OtherUserInfo createdAt={user.createdAt} />
          <OtherUserFriendshipActions
            friendship={friendship}
            currentUserId={currentUserId}
            onSendFriendRequest={onSendFriendRequest}
            onAcceptFriendRequest={onAcceptFriendRequest}
            onDeclineFriendRequest={onDeclineFriendRequest}
          />
          <OtherUserExtraActions
            friendshipId={friendship?.id}
            onRemoveFriend={handleRemoveFriend}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
          <OtherUserQuickActions />
        </div>
      </motion.div>

      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={user.id}
        userName={user.name}
      />
    </div>
  );
}
