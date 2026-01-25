import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export type FriendshipStatus = "none" | "requested" | "incoming" | "friends";

interface FriendActionsProps {
  isOwner: boolean;
  status: FriendshipStatus;
  onSendRequest?: () => Promise<void> | void;
  onAcceptIncoming?: () => Promise<void> | void;
  onDeclineIncoming?: () => Promise<void> | void;
  onRemoveFriend?: () => Promise<void> | void;
}

export function FriendActions({
  isOwner,
  status,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
}: FriendActionsProps) {
  if (isOwner) return null;

  if (status === "friends") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white">
          ✓ Друзья
        </span>
        {onRemoveFriend && (
          <button
            onClick={onRemoveFriend}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
          >
            <LucideIcons.UserMinus size="sm" />
            Удалить из друзей
          </button>
        )}
      </div>
    );
  }

  if (status === "incoming") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-white/70 text-center">
          Пользователь отправил вам заявку
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAcceptIncoming}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/50 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
          >
            <LucideIcons.Check size="sm" />
            Принять
          </button>
          <button
            onClick={onDeclineIncoming}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
          >
            <LucideIcons.X size="sm" />
            Отклонить
          </button>
        </div>
      </div>
    );
  }

  if (status === "requested") {
    return (
      <div className="text-center px-4 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-white">
        Заявка отправлена
      </div>
    );
  }

  return (
    <motion.button
      onClick={onSendRequest}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <LucideIcons.UserPlus size="sm" />
      Добавить в друзья
    </motion.button>
  );
}
