import { motion } from "framer-motion";

type BannedUser = {
  isBanned?: boolean;
  bannedUntil?: string | null;
  bannedReason?: string | null;
};

export function isUserCurrentlyBanned(user: BannedUser) {
  const isBanned = user.isBanned === true;
  const bannedUntil = user.bannedUntil ? new Date(user.bannedUntil) : null;
  return isBanned && (!bannedUntil || bannedUntil > new Date());
}

interface BannedNoticeProps {
  user: BannedUser;
  ToastComponent: React.ComponentType;
}

export function BannedNotice({ user, ToastComponent }: BannedNoticeProps) {
  const isCurrentlyBanned = isUserCurrentlyBanned(user);
  const bannedUntil = user.bannedUntil ? new Date(user.bannedUntil) : null;
  const isBannedPermanent = user.isBanned === true && !user.bannedUntil;

  if (!isCurrentlyBanned) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="w-full px-6 pt-32 pb-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-3">
                  Чечик в бане
                </h3>
                {isBannedPermanent ? (
                  <p className="text-[#abd1c6] text-base">
                    Этот аккаунт заблокирован навсегда.
                  </p>
                ) : (
                  <p className="text-[#abd1c6] text-base">
                    Этот аккаунт заблокирован до{" "}
                    {bannedUntil?.toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    г. в{" "}
                    {bannedUntil?.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    .
                  </p>
                )}
                {user.bannedReason && (
                  <p className="text-[#abd1c6] text-base mt-3">
                    Причина: {user.bannedReason}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <ToastComponent />
    </div>
  );
}
