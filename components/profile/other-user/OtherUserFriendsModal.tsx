// components/profile/other-user/OtherUserFriendsModal.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassModal } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { logRouteCatchError } from "@/lib/api/parseApiError";

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

  useEffect(() => {
    if (!isOpen) return;

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
        logRouteCatchError("[OtherUserFriendsModal] load", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId, isOpen]);

  const friendsLabel = loading
    ? "Загрузка..."
    : `${friends.length} ${
        friends.length === 1
          ? "друг"
          : friends.length < 5
            ? "друга"
            : "друзей"
      }`;

  return (
    <GlassModal
      open={isOpen}
      onClose={onClose}
      size="md"
      zIndex={999}
      maxHeight="85vh"
      title="Друзья пользователя"
      icon={
        <LucideIcons.UsersRound size="sm" className="text-[#f9bc60]" />
      }
      subtitle={friendsLabel}
      bodyClassName="space-y-2 px-4 py-3 scrollbar-hide sm:px-5"
    >
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : friends.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
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
            className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/5 px-3 py-2.5 transition-all duration-200 hover:border-[#f9bc60]/30 hover:bg-white/10"
          >
            {u.avatar ? (
              <img
                src={resolveAvatarUrl(u.avatar)}
                alt=""
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-1 ring-white/10 transition-shadow group-hover:ring-[#f9bc60]/30"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            ) : (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/20 text-sm font-bold text-[#f9bc60]">
                {(u.name || (u.email ? u.email.split("@")[0] : "П"))[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#fffffe] transition-colors group-hover:text-[#f9bc60]">
                {u.name ||
                  (u.email ? u.email.split("@")[0] : "Пользователь")}
              </p>
              {u.email && (
                <p className="mt-0.5 truncate text-xs text-[#abd1c6]/80">
                  {u.email}
                </p>
              )}
            </div>
            <LucideIcons.ChevronRight
              size="sm"
              className="flex-shrink-0 text-[#abd1c6]/60 transition-colors group-hover:text-[#f9bc60]"
            />
          </Link>
        ))
      )}
    </GlassModal>
  );
}
