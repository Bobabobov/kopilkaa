import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getUserStatus } from "@/lib/userStatus";
import type { Friendship } from "./types";

interface FriendPreviewCardProps {
  friendship: Friendship;
  currentUserId: string | null;
  index: number;
  onOpenProfile: (userId: string) => void;
}

export function FriendPreviewCard({
  friendship,
  currentUserId,
  index,
  onOpenProfile,
}: FriendPreviewCardProps) {
  const friend =
    currentUserId === friendship.requesterId
      ? friendship.receiver
      : friendship.requester;

  const status = getUserStatus(friend.lastSeen || null);
  const isOnline = status.status === "online";

  return (
    <motion.div
      key={friendship.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      onClick={() => onOpenProfile(friend.id)}
      className="flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg hover:bg-[#001e1d]/30 cursor-pointer transition-colors"
    >
      <div className="relative">
        <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-lg overflow-hidden bg-[#004643] flex items-center justify-center">
          <img
            src={friend.avatar || "/default-avatar.png"}
            alt={friend.name || "Аватар"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
        </div>

        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 xs:w-3.5 xs:h-3.5 h-3 bg-[#10B981] rounded-full border-2 border-[#001e1d]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#fffffe] font-medium text-xs xs:text-sm truncate">
          {friend.name ||
            (friend.email ? friend.email.split("@")[0] : "Пользователь")}
        </p>
        <p className="text-[#abd1c6] text-[10px] xs:text-xs mt-0.5">
          {status.text}
        </p>
      </div>

      <LucideIcons.ChevronRight
        className="text-[#abd1c6] flex-shrink-0"
        size="sm"
      />
    </motion.div>
  );
}
