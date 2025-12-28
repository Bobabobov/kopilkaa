"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function FriendsPageHeader({
  onGoToSearch,
  onRefresh,
}: {
  onGoToSearch: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#abd1c6]/20 bg-[#052d29] px-4 sm:px-6 lg:px-8 py-6 sm:py-7 min-w-0 mt-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 -top-10 w-44 h-44 bg-[#f9bc60]/10 blur-3xl" />
        <div className="absolute -right-8 top-0 w-36 h-36 bg-[#abd1c6]/10 blur-3xl" />
      </div>
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-sm text-[#abd1c6]">Раздел друзей</p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Мои друзья</h1>
          <p className="text-sm text-[#abd1c6] mt-2 max-w-2xl">
            Управляйте друзьями, отвечайте на заявки или находите новых людей. Всё в одном месте.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onGoToSearch}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#f9bc60] text-[#001e1d] font-semibold hover:bg-[#e8a545] transition-transform transition-colors shadow-[0_0_8px_rgba(255,210,115,0.4)] hover:shadow-[0_0_14px_rgba(255,210,115,0.55)] hover:scale-105"
          >
            <LucideIcons.UserPlus size="sm" />
            Найти друзей
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/60 hover:text-[#fffffe] transition-colors"
          >
            <LucideIcons.Refresh size="sm" />
            Обновить
          </button>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/60 hover:text-[#fffffe] transition-colors"
          >
            <LucideIcons.ArrowLeft size="sm" />
            В профиль
          </Link>
        </div>
      </div>
    </div>
  );
}


