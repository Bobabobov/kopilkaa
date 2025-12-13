"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface FriendsListProps {
  type: "friends" | "sent" | "received";
  data: any[];
  loading: boolean;
  currentUserId: string | null;
  getUserStatus: (lastSeen: string | null) => { status: "online" | "offline"; text: string };
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
      {items.map((item: any, idx: number) => {
        const user =
          type === "friends"
            ? currentUserId === item.requesterId
              ? item.receiver
              : item.requester
            : type === "sent"
            ? item.receiver
            : item.requester;

        const userStatus = getUserStatus(user.lastSeen ?? null);
        const isOnline = userStatus.status === "online";
        const friendSince = item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("ru-RU")
          : "";
        const isAccepted = item.status === "ACCEPTED" || type === "friends";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.25, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
            className="relative flex flex-col gap-4 p-4 sm:p-5 bg-[#001e1d]/25 rounded-xl border border-[#abd1c6]/15 hover:border-[#f9bc60]/30 hover:bg-white/5 transition-colors w-full min-w-0"
          >
            <Link
              href={`/profile/${user.id}`}
              prefetch={false}
              className="flex items-center gap-4 flex-1 group min-w-0"
              aria-label="Посмотреть профиль"
              title="Перейти в профиль"
            >
              <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      // Скрываем изображение при ошибке и показываем fallback
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <span className={`text-[#f9bc60] font-bold ${user.avatar ? "hidden" : ""}`}>
                  {(user.name || user.email.split("@")[0])[0].toUpperCase()}
                </span>
                <span
                  className={`absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#001e1d] ${
                    isOnline ? "bg-green-400" : "bg-gray-500"
                  }`}
                  aria-label={isOnline ? "Онлайн" : "Оффлайн"}
                  title={isOnline ? "Онлайн" : "Оффлайн"}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[#fffffe] text-lg font-semibold group-hover:underline truncate">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  {isAccepted && (
                    <LucideIcons.CheckCircle2
                      size="sm"
                      className="text-[#10B981] flex-shrink-0"
                    />
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#001e1d]/50 ${
                      isOnline ? "text-green-300" : "text-gray-300"
                    }`}
                    title={isOnline ? "Онлайн" : "Оффлайн"}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border border-[#001e1d] ${
                        isOnline ? "bg-green-400" : "bg-gray-500"
                      }`}
                    />
                    {userStatus.text}
                  </span>
                  <span className="text-[#f9bc60]">•</span>
                  <span className="inline-flex items-center gap-1">
                    <LucideIcons.Calendar size="xs" className="text-[#abd1c6]" />
                    <span className="text-[#94a3b8]">Друг с {friendSince || "—"}</span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[#f9bc60]"
                    title="Достижения пользователя"
                  >
                    <LucideIcons.Crown size="xs" className="text-[#f9bc60]" />
                    Достижения
                  </span>
                </div>
              </div>
            </Link>

            <div className="border-b border-white/10" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/profile/${user.id}`}
                  prefetch={false}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-[#abd1c6]/25 text-[#abd1c6] hover:border-[#f9bc60]/60 hover:text-[#fffffe] hover:bg-white/5 transition-colors"
                  aria-label="Перейти в профиль"
                  title="Перейти в профиль"
                >
                  <LucideIcons.ExternalLink size="sm" />
                  <span className="text-sm font-medium">Профиль</span>
                </Link>
              </div>

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

              {type === "friends" && actions.onRemoveFriend && (
                <div className="relative ml-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) => (prev === item.id ? null : item.id));
                    }}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-[#abd1c6]/25 text-[#abd1c6] hover:border-[#f9bc60]/60 hover:text-[#fffffe] transition-colors"
                    aria-label="Еще действия"
                    title="Открыть меню действий"
                  >
                    <LucideIcons.More size="sm" />
                  </button>

                  <div
                    className={`absolute right-0 top-11 min-w-[180px] rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/95 shadow-xl transition duration-150 origin-top-right ${
                      openMenuId === item.id
                        ? "opacity-100 scale-100"
                        : "pointer-events-none opacity-0 scale-95"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        actions.onRemoveFriend?.(item.id);
                      }}
                      disabled={sendingRequests.has(item.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#fffffe] hover:bg-[#f9bc60]/10 transition-colors disabled:opacity-60 rounded-t-xl"
                    >
                      Удалить друга
                    </button>
                    <button
                      type="button"
                      disabled
                      className="w-full text-left px-4 py-2.5 text-sm text-[#abd1c6] hover:bg-[#f9bc60]/10 transition-colors rounded-b-xl cursor-not-allowed opacity-70"
                    >
                      Блокировать (скоро)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

