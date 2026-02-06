"use client";

import Link from "next/link";

interface FriendsOnlineListProps {
  onlineUsers: any[];
  onlineLoading: boolean;
  getUserStatus: (lastSeen: string | null) => {
    status: "online" | "offline";
    text: string;
  };
  sendingRequests: Set<string>;
  onSendRequest: (userId: string) => Promise<void> | void;
  onCancelRequest: (
    friendshipId: string,
    userId: string,
  ) => Promise<void> | void;
}

export function FriendsOnlineList({
  onlineUsers,
  onlineLoading,
  getUserStatus,
  sendingRequests,
  onSendRequest,
  onCancelRequest,
}: FriendsOnlineListProps) {
  if (onlineLoading) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#abd1c6]">Загрузка...</p>
      </div>
    );
  }

  if (onlineUsers.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-dashed border-[#abd1c6]/30 bg-[#001e1d]/40">
        <p className="text-[#abd1c6]">Сейчас никого нет в сети</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 min-w-0">
      <p className="text-xs text-[#10B981] font-medium flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        В сети: {onlineUsers.length}
      </p>
      {onlineUsers.map((user: any) => (
        <div
          key={user.id}
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#001e1d]/25 rounded-xl border border-[#abd1c6]/15 hover:border-[#f9bc60]/30 transition-colors w-full min-w-0"
        >
          <Link
            href={`/profile/${user.id}`}
            prefetch={false}
            className="flex items-center gap-3 flex-1 group min-w-0"
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition overflow-hidden">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
              </div>
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#001e1d] bg-[#10B981]"
                title="В сети"
                aria-hidden
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <p
                  className="text-[#fffffe] font-medium group-hover:underline min-w-0 flex-1 truncate"
                  title={
                    user.name ||
                    (user.email ? user.email.split("@")[0] : "Пользователь")
                  }
                >
                  {user.name ||
                    (user.email
                      ? user.email.split("@")[0]
                      : "Пользователь")}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  В сети
                </span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            {user.friendshipStatus !== "PENDING" &&
              user.friendshipStatus !== "ACCEPTED" && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!sendingRequests.has(user.id)) {
                      await onSendRequest(user.id);
                    }
                  }}
                  disabled={sendingRequests.has(user.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingRequests.has(user.id)
                    ? "Отправка..."
                    : "Добавить"}
                </button>
              )}

            {user.friendshipStatus === "PENDING" &&
              user.isRequester &&
              user.friendshipId && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      !sendingRequests.has(user.id) &&
                      user.friendshipId
                    ) {
                      await onCancelRequest(user.friendshipId, user.id);
                    }
                  }}
                  disabled={sendingRequests.has(user.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#6B7280] hover:bg-[#4B5563] text-[#fffffe] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отменить
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
