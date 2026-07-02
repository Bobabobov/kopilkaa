'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function LevelsTopBar() {
  return (
    <header className="relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-[#f9bc60]/20 bg-[#001e1d]/95 px-3 py-2 font-mono shadow-[0_10px_28px_rgba(0,0,0,0.48),inset_0_-1px_0_rgba(249,188,96,0.15)] backdrop-blur-md sm:px-4">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#f9bc60]/45 to-transparent" />

      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#abd1c6]/25 bg-[#004643]/60 px-2 py-1.5 text-xs uppercase tracking-[0.14em] text-[#abd1c6] transition-colors hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60] sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Профиль</span>
        <span className="sm:hidden">Назад</span>
      </Link>

      <div className="min-w-0 text-center">
        <p className="truncate text-sm font-black uppercase tracking-[0.2em] text-[#f9bc60] [text-shadow:0_0_14px_rgba(249,188,96,0.25)] sm:text-base">
          Система уровней
        </p>
        <p className="truncate text-[10px] text-[#abd1c6]/55 sm:text-xs">
          level_ascension.sys · active
        </p>
      </div>

      <div className="w-[74px] sm:w-[92px]" aria-hidden />
    </header>
  );
}
