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
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 transition-all duration-200 hover:border-white/15 hover:shadow-lg hover:shadow-black/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        <div className="absolute -right-10 top-0 w-40 h-40 bg-[#abd1c6]/10 blur-3xl rounded-full" />
      </div>
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg flex-shrink-0">
            <LucideIcons.UsersRound size="lg" className="text-[#0f2d2a]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#abd1c6] uppercase tracking-wide">
              Раздел друзей
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#fffffe] leading-tight mt-0.5">
              Мои друзья
            </h1>
            <p className="text-sm text-[#abd1c6] mt-2 max-w-2xl">
              Управляйте друзьями, отвечайте на заявки и находите новых людей —
              всё в одном месте.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onGoToSearch}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f9bc60] text-[#0f2d2a] font-bold hover:bg-[#e8a545] transition-all shadow-lg hover:shadow-[#f9bc60]/30 min-h-[44px]"
          >
            <LucideIcons.Search size="sm" />
            Найти друзей
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#fffffe] hover:bg-white/10 transition-colors min-h-[44px] font-semibold"
          >
            <LucideIcons.RefreshCw size="sm" />
            Обновить
          </button>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#fffffe] hover:bg-white/10 transition-colors min-h-[44px] font-semibold"
          >
            <LucideIcons.ArrowLeft size="sm" />
            В профиль
          </Link>
        </div>
      </div>
    </div>
  );
}
