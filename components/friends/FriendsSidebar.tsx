"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
const mockActivity = [
  {
    id: "a1",
    text: "asdasdasd стал вашим другом",
    time: "3 дня назад",
    icon: "UserPlus",
  },
  {
    id: "a2",
    text: "TEST получил достижение «Легенда»",
    time: "1 день назад",
    icon: "Award",
  },
  {
    id: "a3",
    text: "Лена приняла вашу заявку",
    time: "5 часов назад",
    icon: "CheckCircle2",
  },
];

export function FriendsSidebar() {
  const [suggestions, setSuggestions] = useState<
    {
      id: string;
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
      mutual?: string;
    }[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sending, setSending] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState<Set<string>>(new Set());

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const res = await fetch("/api/friends/suggestions?limit=5", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(
        (data.users || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          mutual: u.mutualFriends
            ? `${u.mutualFriends} общих друзей`
            : undefined,
        })),
      );
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleAdd = async (userId: string) => {
    try {
      setSending((prev) => new Set(prev).add(userId));
      const res = await fetch("/api/profile/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });
      if (res.ok) {
        setSent((prev) => new Set(prev).add(userId));
        setSuggestions((prev) => prev.filter((p) => p.id !== userId));
        await fetchSuggestions();
      }
    } finally {
      setSending((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <aside className="hidden md:block lg:sticky lg:top-6 space-y-4 min-w-0">
      <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-semibold text-[#fffffe]">
            Активность друзей
          </h3>
          <span className="px-2 py-1 text-[11px] rounded-full bg-white/10 text-[#abd1c6] border border-white/10">
            Сегодня
          </span>
        </div>
        <p className="text-xs text-[#abd1c6] mb-3">
          Недавние события с друзьями, достижениями и заявками.
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {mockActivity.map((item, idx) => {
            const Icon =
              item.icon === "UserPlus"
                ? LucideIcons.UserPlus
                : item.icon === "Award"
                  ? LucideIcons.Award
                  : LucideIcons.CheckCircle2;
            return (
              <div
                key={item.id}
                className={`px-3 py-2.5 flex items-start gap-3 ${idx !== mockActivity.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div className="mt-0.5 text-[#f9bc60]">
                  <Icon size="sm" className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm text-[#fffffe] leading-snug">
                    {item.text}
                  </p>
                  <p className="text-xs text-white/60">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <h3 className="text-lg font-semibold text-[#fffffe]">
            Возможно, вы знакомы
          </h3>
          <button
            type="button"
            onClick={fetchSuggestions}
            disabled={loadingSuggestions}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-medium text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#fffffe] bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-60"
          >
            <LucideIcons.RefreshCw size="xs" />
            {loadingSuggestions ? "Обновляем..." : "Обновить"}
          </button>
        </div>
        <p className="text-xs text-[#abd1c6] mb-3">
          Рекомендации на основе общих друзей и недавней активности.
        </p>
        <div className="space-y-2.5">
          <AnimatePresence>
            {suggestions.map((person, idx) => {
              const isSending = sending.has(person.id);
              const isSent = sent.has(person.id);
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 min-w-0">
                    <Link
                      href={`/profile/${person.id}`}
                      className="block w-10 h-10 rounded-full bg-[#004643] overflow-hidden ring-1 ring-white/10 hover:ring-[#f9bc60]/40 transition flex-shrink-0"
                      title="Открыть профиль"
                      prefetch={false}
                    >
                      <img
                        src={resolveAvatarUrl(person.avatar)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                      />
                    </Link>

                    <Link
                      href={`/profile/${person.id}`}
                      className="min-w-0 group"
                      title="Открыть профиль"
                      prefetch={false}
                    >
                      <p
                        className="text-[#fffffe] font-semibold leading-tight min-w-0 truncate group-hover:underline"
                        title={person.name || person.email || "Пользователь"}
                      >
                        {person.name || person.email || "Пользователь"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5 min-w-0">
                        <span className="text-xs text-[#abd1c6] min-w-0 truncate">
                          {person.mutual || "Общие интересы"}
                        </span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAdd(person.id)}
                      disabled={isSending || isSent}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ${
                        isSent
                          ? "bg-[#10B981]/20 text-[#10B981] cursor-default"
                          : "bg-[#f9bc60]/80 hover:bg-[#f9bc60] text-[#001e1d]"
                      } ${isSending ? "opacity-70 cursor-wait" : ""}`}
                    >
                      {isSending
                        ? "Отправка..."
                        : isSent
                          ? "Отправлено"
                          : "Добавить"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {!loadingSuggestions && suggestions.length === 0 && (
            <div className="text-sm text-[#abd1c6] px-2 py-4 text-center border border-dashed border-white/10 rounded-xl bg-[#004643]/30 backdrop-blur-sm">
              Рекомендаций пока нет
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-4 sm:p-5 min-w-0">
        <h3 className="text-lg font-semibold text-[#fffffe] mb-1.5">
          Полезные шаги
        </h3>
        <p className="text-xs text-[#abd1c6] mb-3">
          Небольшие действия, которые помогут найти больше друзей.
        </p>
        <div className="space-y-2.5">
          <Link
            href="/profile?settings=1"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#f9bc60]/40 hover:bg-white/10 transition-colors"
          >
            <span className="inline-flex items-center gap-2 text-sm text-[#fffffe]">
              <LucideIcons.Edit3 size="sm" className="text-[#f9bc60]" />
              Заполнить профиль
            </span>
            <LucideIcons.ChevronRight size="sm" className="text-[#abd1c6]" />
          </Link>
          <Link
            href="/friends?tab=search"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#f9bc60]/40 hover:bg-white/10 transition-colors"
          >
            <span className="inline-flex items-center gap-2 text-sm text-[#fffffe]">
              <LucideIcons.Search size="sm" className="text-[#f9bc60]" />
              Найти друзей по интересам
            </span>
            <LucideIcons.ChevronRight size="sm" className="text-[#abd1c6]" />
          </Link>
          <Link
            href="/profile/achievements"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#f9bc60]/40 hover:bg-white/10 transition-colors"
          >
            <span className="inline-flex items-center gap-2 text-sm text-[#fffffe]">
              <LucideIcons.Trophy size="sm" className="text-[#f9bc60]" />
              Посмотреть достижения
            </span>
            <LucideIcons.ChevronRight size="sm" className="text-[#abd1c6]" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
