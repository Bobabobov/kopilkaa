import { motion } from "framer-motion";

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

export interface OtherUserFriendship {
  id: string;
  status: FriendshipStatus;
  requesterId: string;
  receiverId: string;
}

interface OtherUserFriendshipActionsProps {
  friendship: OtherUserFriendship | null;
  currentUserId: string | null;
  onSendFriendRequest: () => void;
  onAcceptFriendRequest: () => void;
  onDeclineFriendRequest: () => void;
}

export function OtherUserFriendshipActions({
  friendship,
  currentUserId,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
}: OtherUserFriendshipActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="space-y-3"
    >
      {!friendship && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onSendFriendRequest}
          className="group w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors"
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          Добавить в друзья
        </motion.button>
      )}

      {friendship &&
        friendship.status === "PENDING" &&
        friendship.requesterId !== currentUserId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <p className="text-[#abd1c6] text-sm text-center bg-[#001e1d]/30 p-3 rounded-xl border border-[#abd1c6]/10">
              Пользователь отправил вам заявку в друзья
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onAcceptFriendRequest}
                className="flex-1 px-3 py-2 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] rounded-lg transition-colors text-sm font-medium"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Принять
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onDeclineFriendRequest}
                className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
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
                  Отклонить
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}

      {friendship &&
        friendship.status === "PENDING" &&
        friendship.requesterId === currentUserId && (
          <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-[#f9bc60]/10 text-[#f9bc60]">
            Заявка отправлена
          </div>
        )}

      {friendship && friendship.status === "ACCEPTED" && (
        <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-[#10B981]/20 text-[#10B981]">
          ✓ Друзья
        </div>
      )}

      {friendship && friendship.status === "DECLINED" && (
        <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-red-500/20 text-red-400">
          Заявка отклонена
        </div>
      )}
    </motion.div>
  );
}
