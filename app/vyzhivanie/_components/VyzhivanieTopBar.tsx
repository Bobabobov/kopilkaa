'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatRub } from '@/lib/format';
import { VYZHIVANIE_PRIZE_RUB } from '@/lib/tontine/constants';
import type { TontineStatusResponse } from '../types';

type Props = {
  data: TontineStatusResponse | null;
};

export function VyzhivanieTopBar({ data }: Props) {
  return (
    <header className="relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-[#334155] bg-[linear-gradient(90deg,#020617,#050505,#020617)] px-3 py-2 font-mono shadow-[0_10px_28px_rgba(0,0,0,0.48),inset_0_-1px_0_rgba(34,211,238,0.08)] sm:px-4">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 border border-[#334155] bg-black/45 px-2 py-1.5 text-xs uppercase tracking-[0.14em] text-[#d1d5db] transition-colors hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-100 sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Копилка</span>
        <span className="sm:hidden">Назад</span>
      </Link>

      <div className="min-w-0 text-center">
        <p className="vyzhivanie-glitch-text truncate text-sm font-black uppercase tracking-[0.22em] text-[#e5e7eb] [text-shadow:0_0_14px_rgba(34,211,238,0.22)] sm:text-base">
          Выживание × Копилка
        </p>
        {data ? (
          <p className="truncate text-[10px] text-[#94a3b8] sm:text-xs">
            раунд #{data.roundNumber} · банк {formatRub(data.prizeRub ?? VYZHIVANIE_PRIZE_RUB)}
          </p>
        ) : null}
      </div>

      <div className="w-[74px] sm:w-[92px]" aria-hidden />
    </header>
  );
}
