interface OtherUserExtraActionsProps {
  friendshipId?: string | null;
  onRemoveFriend?: () => Promise<void>;
  onOpenReport: () => void;
}

export function OtherUserExtraActions({ friendshipId, onRemoveFriend, onOpenReport }: OtherUserExtraActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#abd1c6]/20">
      {friendshipId && onRemoveFriend && (
        <button
          onClick={onRemoveFriend}
          className="w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Удалить из друзей
        </button>
      )}
      <button
        onClick={onOpenReport}
        className="w-full px-4 py-3 rounded-xl bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 border border-[#f9bc60]/30 hover:border-[#f9bc60]/50 text-[#f9bc60] font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#f9bc60]/20 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Пожаловаться
      </button>
    </div>
  );
}
