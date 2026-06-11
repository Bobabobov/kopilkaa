import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";

export type FriendshipStatus = "none" | "requested" | "incoming" | "friends";

interface FriendActionsProps {
  isOwner: boolean;
  status: FriendshipStatus;
  centered?: boolean;
  onSendRequest?: () => Promise<void> | void;
  onAcceptIncoming?: () => Promise<void> | void;
  onDeclineIncoming?: () => Promise<void> | void;
  onRemoveFriend?: () => Promise<void> | void;
}

export function FriendActions({
  isOwner,
  status,
  centered = false,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
}: FriendActionsProps) {
  if (isOwner) return null;

  const rowClass = cn(
    "flex flex-wrap items-center gap-2",
    centered && "justify-center",
  );

  if (status === "friends") {
    return (
      <div className={rowClass}>
        <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white">
          <LucideIcons.Check className="w-4 h-4 mr-1" /> Друзья
        </span>
        {onRemoveFriend && (
          <button
            onClick={onRemoveFriend}
            className="inline-flex items-center justify-center gap-1.5 xs:gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
            title="Удалить из друзей"
          >
            <LucideIcons.UserMinus size="sm" className="flex-shrink-0" />
            <span className={centered ? "inline" : "hidden sm:inline"}>
              Удалить из друзей
            </span>
          </button>
        )}
      </div>
    );
  }

  if (status === "incoming") {
    return (
      <div className={cn("flex flex-col gap-2", centered && "items-center")}>
        <p className="text-xs text-white/70 text-center">
          Пользователь отправил вам заявку
        </p>
        <div className={rowClass}>
          <button
            onClick={onAcceptIncoming}
            className="inline-flex items-center justify-center gap-1 xs:gap-1.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/50 px-3 py-1.5 xs:px-4 xs:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
          >
            <LucideIcons.Check size="sm" className="flex-shrink-0" />
            Принять
          </button>
          <button
            onClick={onDeclineIncoming}
            className="inline-flex items-center justify-center gap-1 xs:gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 xs:px-4 xs:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
          >
            <LucideIcons.X size="sm" className="flex-shrink-0" />
            Отклонить
          </button>
        </div>
      </div>
    );
  }

  if (status === "requested") {
    return (
      <div
        className={cn(
          "rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-center text-sm font-medium text-white",
          centered && "mx-auto w-fit",
        )}
      >
        Заявка отправлена
      </div>
    );
  }

  return (
    <motion.button
      onClick={onSendRequest}
      className="inline-flex items-center justify-center gap-1.5 xs:gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 xs:px-4 xs:py-2 text-xs xs:text-sm font-medium text-white transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title="Добавить в друзья"
    >
      <LucideIcons.UserPlus size="sm" className="flex-shrink-0" />
      <span className={centered ? "inline" : "hidden xs:inline"}>
        Добавить в друзья
      </span>
    </motion.button>
  );
}
