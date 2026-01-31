import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileFriendsHeaderProps {
  totalFriends: number;
  pendingRequests: number;
  onAllClick: () => void;
}

export function ProfileFriendsHeader({
  totalFriends,
  pendingRequests,
  onAllClick,
}: ProfileFriendsHeaderProps) {
  return (
    <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <LucideIcons.Users className="text-[#f9bc60]" size="sm" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">
              Мои друзья
            </h3>
            <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5 truncate">
              {totalFriends > 0 ? `${totalFriends} друзей` : "Список друзей"}
              {pendingRequests > 0 && ` · ${pendingRequests} заявок`}
            </p>
          </div>
        </div>

        <button
          onClick={onAllClick}
          className="text-xs text-[#f9bc60] hover:text-[#e8a545] transition-colors flex-shrink-0 whitespace-nowrap"
        >
          Все
        </button>
      </div>
    </div>
  );
}
