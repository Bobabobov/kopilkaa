"use client";

import Link from "next/link";

interface FriendsListProps {
  type: "friends" | "sent" | "received";
  data: any[];
  loading: boolean;
  currentUserId: string | null;
  getUserStatus: (lastSeen: string | null) => { text: string };
  sendingRequests: Set<string>;
  actions: {
    onRemoveFriend?: (id: string) => Promise<void> | void;
    onCancelRequest?: (id: string, userId: string) => Promise<void> | void;
    onAcceptRequest?: (id: string) => Promise<void> | void;
    onDeclineRequest?: (id: string) => Promise<void> | void;
  };
}

export function FriendsList({
  type,
  data,
  loading,
  currentUserId,
  getUserStatus,
  sendingRequests,
  actions,
}: FriendsListProps) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#abd1c6]">Загрузка...</p>
      </div>
    );
  }

  const items = Array.isArray(data) ? data : [];

  if (items.length === 0) {
    const messages = {
      friends: "У вас пока нет друзей",
      sent: "Нет отправленных заявок",
      received: "Нет входящих заявок",
    };
    return (
      <div className="text-center py-12 rounded-2xl border border-dashed border-[#abd1c6]/30 bg-[#001e1d]/40">
        <p className="text-[#abd1c6]">{messages[type]}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 min-w-0">
      {items.map((item: any) => {
        const user =
          type === "friends"
            ? currentUserId === item.requesterId
              ? item.receiver
              : item.requester
            : type === "sent"
            ? item.receiver
            : item.requester;

        return (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#001e1d]/25 rounded-xl border border-[#abd1c6]/15 hover:border-[#f9bc60]/30 transition-colors w-full min-w-0"
          >
            <Link
              href={`/profile/${user.id}`}
              prefetch={false}
              className="flex items-center gap-3 flex-1 group min-w-0"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[#f9bc60] font-bold">
                    {(user.name || user.email.split("@")[0])[0].toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#fffffe] font-medium group-hover:underline truncate">
                  {user.name || user.email.split("@")[0]}
                </p>
                <p className="text-[#abd1c6] text-sm">
                  {getUserStatus(user.lastSeen ?? null).text}
                </p>
              </div>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              {type === "friends" && actions.onRemoveFriend && (
                <button
                  type="button"
                  onClick={() => actions.onRemoveFriend?.(item.id)}
                  disabled={sendingRequests.has(item.id)}
                  className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-60 w-full sm:w-auto"
                >
                  Удалить
                </button>
              )}

              {type === "sent" && actions.onCancelRequest && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!sendingRequests.has(user.id) && item.id) {
                      await actions.onCancelRequest?.(item.id, user.id);
                    }
                  }}
                  disabled={sendingRequests.has(user.id) || !item.id}
                  className="px-3 py-1.5 bg-[#6B7280]/20 hover:bg-[#6B7280]/30 text-[#abd1c6] text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {sendingRequests.has(user.id) ? "Отмена..." : "Отменить"}
                </button>
              )}

              {type === "received" && (
                <>
                  {actions.onAcceptRequest && (
                    <button
                      type="button"
                      onClick={() => actions.onAcceptRequest?.(item.id)}
                      disabled={sendingRequests.has(item.id)}
                      className="px-3 py-1.5 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      Принять
                    </button>
                  )}
                  {actions.onDeclineRequest && (
                    <button
                      type="button"
                      onClick={() => actions.onDeclineRequest?.(item.id)}
                      disabled={sendingRequests.has(item.id)}
                      className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      Отклонить
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

