"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

const mockActivity = [
  { id: "a1", text: "asdasdasd стал вашим другом", time: "3 дня назад", icon: "UserPlus" },
  { id: "a2", text: "TEST получил достижение «Легенда»", time: "1 день назад", icon: "Award" },
  { id: "a3", text: "Лена приняла вашу заявку", time: "5 часов назад", icon: "CheckCircle2" },
];

export function FriendsSidebar() {
  const [suggestions, setSuggestions] = useState<
    { id: string; name?: string | null; email?: string; avatar?: string | null; mutual?: string }[]
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
          mutual: u.mutualFriends ? `${u.mutualFriends} общих друзей` : undefined,
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
      <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#052d29] p-4 shadow-xl min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-[#fffffe]">Активность друзей</h3>
          <span className="px-2 py-1 text-[11px] rounded-full bg-[#001e1d]/70 text-[#abd1c6]">
            Сегодня
          </span>
        </div>
        <div className="rounded-xl border border-[#abd1c6]/10 bg-[#001e1d]/30 overflow-hidden">
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
                  <p className="text-sm text-[#fffffe] leading-snug">{item.text}</p>
                  <p className="text-xs text-white/60">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#052d29] p-4 shadow-xl min-w-0">
        <h3 className="text-lg font-semibold text-[#fffffe] mb-2.5">Возможно, вы знакомы</h3>
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
                  className="p-3 rounded-xl border border-[#abd1c6]/15 bg-[#001e1d]/40 shadow-sm hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#004643] flex items-center justify-center flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={person.avatar || "/default-avatar.png"}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <Link
                      href={`/profile/${person.id}`}
                      className="flex-1 min-w-0"
                      title="Открыть профиль"
                    >
                      <p className="text-[#fffffe] font-semibold truncate hover:underline">
                        {person.name || person.email || "Пользователь"}
                      </p>
                      <p className="text-xs text-[#abd1c6] truncate">
                        {person.mutual || "Общие интересы"}
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAdd(person.id)}
                      disabled={isSending || isSent}
                      className={`px-2.5 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                        isSent
                          ? "bg-[#10B981]/20 text-[#10B981] cursor-default"
                          : "bg-[#f9bc60]/80 hover:bg-[#f9bc60] text-[#001e1d]"
                      } ${isSending ? "opacity-70 cursor-wait" : ""}`}
                    >
                      {isSending ? "Отправка..." : isSent ? "Отправлено" : "Добавить"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {!loadingSuggestions && suggestions.length === 0 && (
            <div className="text-sm text-[#abd1c6] px-2 py-4 text-center border border-dashed border-[#abd1c6]/20 rounded-xl">
              Рекомендаций пока нет
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

