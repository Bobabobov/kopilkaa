// components/profile/other-user/OtherUserFriendsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";

type UserLite = {
  id: string;
  name?: string | null;
  email: string | null;
  avatar?: string | null;
  lastSeen?: string | null;
};

interface OtherUserFriendsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OtherUserFriendsModal({
  userId,
  isOpen,
  onClose,
}: OtherUserFriendsModalProps) {
  const [friends, setFriends] = useState<UserLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}/friends`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setFriends(data.friends || []);
        }
      } catch (e) {
        console.error("Error loading friends for modal:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId, isOpen, mounted]);

  // Закрытие по Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const body = (
    <AnimatePresence>
      <motion.div
        key="other-user-friends-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="other-user-friends-modal-content"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full max-h-[85vh] rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#f9bc60]/20 border border-[#f9bc60]/30 flex items-center justify-center flex-shrink-0">
                <LucideIcons.UsersRound size="sm" className="text-[#f9bc60]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-[#fffffe] truncate">
                  Друзья пользователя
                </h2>
                <p className="text-xs text-[#abd1c6] mt-0.5">
                  {loading
                    ? "Загрузка..."
                    : `${friends.length} ${
                        friends.length === 1
                          ? "друг"
                          : friends.length < 5
                            ? "друга"
                            : "друзей"
                      }`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-[#abd1c6] hover:text-[#fffffe] transition-colors flex-shrink-0"
            >
              <LucideIcons.X size="sm" />
            </button>
          </div>

          {/* Body — скролл без видимого скроллбара */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-5 py-3 space-y-2 scrollbar-hide overscroll-contain"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : friends.length === 0 ? (
              <div className="py-8 text-center">
                <div className="inline-flex w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-3">
                  <LucideIcons.Users size="sm" className="text-[#abd1c6]" />
                </div>
                <p className="text-sm text-[#abd1c6]">
                  У пользователя пока нет друзей
                </p>
              </div>
            ) : (
              friends.map((u) => (
                <Link
                  key={u.id}
                  href={`/profile/${u.id}`}
                  prefetch={false}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/5 hover:bg-white/10 hover:border-[#f9bc60]/30 transition-all duration-200 group"
                >
                  {u.avatar ? (
                    <img
                      src={resolveAvatarUrl(u.avatar)}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-[#f9bc60]/30 transition-shadow flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#f9bc60]/20 text-[#f9bc60] flex items-center justify-center text-sm font-bold border border-[#f9bc60]/30 flex-shrink-0">
                      {(u.name ||
                        (u.email
                          ? u.email.split("@")[0]
                          : "П"))[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                      {u.name ||
                        (u.email ? u.email.split("@")[0] : "Пользователь")}
                    </p>
                    {u.email && (
                      <p className="text-xs text-[#abd1c6]/80 truncate mt-0.5">
                        {u.email}
                      </p>
                    )}
                  </div>
                  <LucideIcons.ChevronRight
                    size="sm"
                    className="text-[#abd1c6]/60 group-hover:text-[#f9bc60] flex-shrink-0 transition-colors"
                  />
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(body, document.body);
}
