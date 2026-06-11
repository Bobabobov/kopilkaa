import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { getUserStatus } from "@/lib/userStatus";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { Friendship } from "./types";

interface FriendPreviewCardProps {
  friendship: Friendship;
  currentUserId: string | null;
  index?: number;
  onOpenProfile: (userId: string) => void;
}

export function FriendPreviewCard({
  friendship,
  currentUserId,
  onOpenProfile,
}: FriendPreviewCardProps) {
  const friend =
    currentUserId === friendship.requesterId
      ? friendship.receiver
      : friendship.requester;

  const status = getUserStatus(friend.lastSeen || null);
  const isOnline = status.status === "online";

  return (
    <button
      type="button"
      onClick={() => onOpenProfile(friend.id)}
      className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/[0.05] first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#004643]/40 sm:h-11 sm:w-11">
          <img
            src={resolveAvatarUrl(friend.avatar)}
            alt={friend.name || "Аватар"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>

        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#001e1d] bg-[#10B981]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#fffffe]">
          {friend.name ||
            (friend.email ? friend.email.split("@")[0] : "Пользователь")}
        </p>
        <p className="mt-0.5 text-xs text-[#abd1c6]">{status.text}</p>
      </div>

      <LucideIcons.ChevronRight className="shrink-0 text-[#abd1c6]" size="sm" />
    </button>
  );
}
