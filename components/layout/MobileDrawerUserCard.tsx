"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface MobileDrawerUserCardProps {
  onNavigate?: () => void;
}

function getDisplayName(name: string | null, username: string | null): string {
  if (name?.trim()) return name.trim();
  if (username?.trim()) return username.trim();
  return "Ваш профиль";
}

function getInitials(name: string | null, username: string | null): string {
  const source = name?.trim() || username?.trim() || "К";
  return source.slice(0, 2).toUpperCase();
}

export function MobileDrawerUserCard({ onNavigate }: MobileDrawerUserCardProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = getDisplayName(user.name, user.username);
  const handle = user.username?.trim() ? `@${user.username.trim()}` : null;

  return (
    <Link
      href="/profile"
      onClick={onNavigate}
      className={cn(
        "group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border p-3.5 transition-all duration-200",
        "border-[#f9bc60]/25 bg-gradient-to-br from-[#f9bc60]/10 via-white/[0.04] to-transparent",
        "active:scale-[0.99] active:border-[#f9bc60]/40",
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-2xl"
        aria-hidden
      />

      <div className="relative shrink-0 rounded-full bg-gradient-to-br from-[#f9bc60]/80 to-[#e16162]/60 p-[2px]">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#001e1d]">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold tracking-wide text-[#f9bc60]">
              {getInitials(user.name, user.username)}
            </span>
          )}
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f9bc60]">
          Профиль
        </p>
        <p className="truncate text-base font-semibold text-[#fffffe]">
          {displayName}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#abd1c6]">
          {handle ?? "Личный кабинет"}
        </p>
      </div>

      <span
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          "border border-white/10 bg-white/[0.06] text-[#abd1c6]",
          "transition-colors group-active:bg-[#f9bc60]/15 group-active:text-[#f9bc60]",
        )}
        aria-hidden
      >
        <UserRound className="h-4 w-4" />
      </span>
    </Link>
  );
}
