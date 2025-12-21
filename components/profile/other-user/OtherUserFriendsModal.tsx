// components/profile/other-user/OtherUserFriendsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

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
        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          key="other-user-friends-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="max-w-2xl w-full max-h-[80vh] rounded-3xl bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] border border-[#abd1c6]/30 shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-bottom border-[#abd1c6]/25">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f9bc60] flex items-center justify-center text-xs text-[#001e1d]">
                <LucideIcons.Users size="xs" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#fffffe]">
                  Друзья пользователя
                </h2>
                <p className="text-[11px] text-[#abd1c6]/80">
                  {friends.length}{" "}
                  {friends.length === 1
                    ? "друг"
                    : friends.length < 5
                      ? "друга"
                      : "друзей"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#001e1d]/40 hover:bg-[#001e1d]/60 flex items-center justify-center text-[#abd1c6] transition-colors"
            >
              <LucideIcons.X size="sm" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-11 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/20 animate-pulse"
                  />
                ))}
              </div>
            ) : friends.length === 0 ? (
              <p className="text-sm text-[#abd1c6] text-center py-4">
                У пользователя пока нет друзей.
              </p>
            ) : (
              friends.map((u) => (
                <Link
                  key={u.id}
                  href={`/profile/${u.id}`}
                  prefetch={false}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#001e1d]/40 hover:bg-[#001e1d]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-colors"
                >
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004643] to-[#001e1d] text-[#f9bc60] flex items-center justify-center text-xs font-bold border border-[#f9bc60]/40">
                      {(u.name || (u.email ? u.email.split("@")[0] : "П"))[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#fffffe]">
                      {u.name || (u.email ? u.email.split("@")[0] : "Пользователь")}
                    </p>
                    {u.email && (
                      <p className="text-[10px] text-[#abd1c6]/70 truncate">
                        {u.email}
                      </p>
                    )}
                  </div>
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


