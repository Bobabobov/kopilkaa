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
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-emerald-950/40"
    >
      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-emerald-500/20 sm:h-11 sm:w-11">
          <img
            src={resolveAvatarUrl(friend.avatar)}
            alt={friend.name || "Аватар"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>

        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-emerald-950 ${
            isOnline ? "bg-emerald-400" : "bg-zinc-500"
          }`}
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-zinc-100">
          {friend.name ||
            (friend.email ? friend.email.split("@")[0] : "Пользователь")}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">{status.text}</p>
      </div>

      <LucideIcons.ChevronRight
        className="shrink-0 text-zinc-600"
        size="sm"
      />
    </button>
  );
}
