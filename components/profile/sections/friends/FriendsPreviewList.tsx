import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { Friendship } from "./types";
import { FriendPreviewCard } from "./FriendPreviewCard";

interface FriendsPreviewListProps {
  friends: Friendship[];
  currentUserId: string | null;
  totalFriends: number;
  pendingRequests: number;
  sentRequestsCount: number;
  newRequestsCount: number;
  onOpenProfile: (userId: string) => void;
  onNavigate: (tab: "friends" | "sent" | "received" | "search") => void;
}

export function FriendsPreviewList({
  friends,
  currentUserId,
  totalFriends,
  pendingRequests,
  sentRequestsCount,
  newRequestsCount,
  onOpenProfile,
  onNavigate,
}: FriendsPreviewListProps) {
  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {friends.slice(0, 4).map((friendship, index) => (
        <FriendPreviewCard
          key={friendship.id}
          friendship={friendship}
          currentUserId={currentUserId}
          index={index}
          onOpenProfile={onOpenProfile}
        />
      ))}

      {totalFriends > 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03, y: -3 }}
          onClick={() => onNavigate("friends")}
          className="relative flex items-center justify-between p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-gradient-to-r from-[#001e1d]/40 to-[#001e1d]/20 hover:from-[#abd1c6]/10 hover:to-[#001e1d]/30 cursor-pointer transition-all duration-300 border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 shadow-md hover:shadow-lg overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#abd1c6]/0 via-[#abd1c6]/5 to-[#abd1c6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center gap-2 xs:gap-3 relative z-10">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-[#abd1c6]/30 to-[#94a1b2]/30 rounded-lg xs:rounded-xl flex items-center justify-center"
            >
              <LucideIcons.Users className="text-[#abd1c6]" size="sm" />
            </motion.div>
            <span className="text-[#fffffe] font-bold text-xs xs:text-sm">
              Еще {totalFriends - 4} друзей
            </span>
          </div>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <LucideIcons.ChevronRight
              className="text-[#abd1c6] group-hover:text-[#abd1c6] transition-colors"
              size="sm"
            />
          </motion.div>
        </motion.div>
      )}

      {pendingRequests > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate("received")}
          className="flex items-center justify-between p-3 xs:p-4 rounded-xl bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="relative">
              <LucideIcons.UserCheck className="text-[#f9bc60]" size="sm" />
              {newRequestsCount > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
            <div>
              <p className="text-[#fffffe] font-medium text-xs xs:text-sm">
                {pendingRequests} заявок в друзья
              </p>
              {newRequestsCount > 0 && (
                <p className="text-[#f9bc60] text-[10px] xs:text-xs">
                  {newRequestsCount} новых
                </p>
              )}
            </div>
          </div>
          <LucideIcons.ChevronRight className="text-[#f9bc60]" size="sm" />
        </motion.div>
      )}

      {sentRequestsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate("sent")}
          className="flex items-center justify-between p-3 xs:p-4 rounded-xl bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 xs:gap-3">
            <LucideIcons.Send className="text-[#3b82f6]" size="sm" />
            <div>
              <p className="text-[#fffffe] font-medium text-xs xs:text-sm">
                {sentRequestsCount} отправленных заявок
              </p>
              <p className="text-[#3b82f6] text-[10px] xs:text-xs">
                Можно отменить или подождать ответа
              </p>
            </div>
          </div>
          <LucideIcons.ChevronRight className="text-[#3b82f6]" size="sm" />
        </motion.div>
      )}

      {totalFriends > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate("search")}
          className="flex items-center justify-center p-3 xs:p-4 rounded-xl border border-dashed border-[#abd1c6]/30 hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/5 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2 xs:gap-3">
            <LucideIcons.UserPlus className="text-[#10B981]" size="sm" />
            <span className="text-[#fffffe] font-medium text-xs xs:text-sm">
              Найти друзей
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
