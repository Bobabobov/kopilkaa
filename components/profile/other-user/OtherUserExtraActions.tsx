interface OtherUserExtraActionsProps {
  friendshipId?: string | null;
  onRemoveFriend?: () => Promise<void>;
}

export function OtherUserExtraActions({
  friendshipId,
  onRemoveFriend,
}: OtherUserExtraActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#abd1c6]/20">
      {friendshipId && onRemoveFriend && (
        <button
          onClick={onRemoveFriend}
          className="w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Удалить из друзей
        </button>
      )}
    </div>
  );
}
