'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function GamesLobbyTopBar() {
  return (
    <header className='relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-emerald-500/20 bg-zinc-950/95 px-3 py-2 font-mono shadow-[0_10px_28px_rgba(0,0,0,0.48),inset_0_-1px_0_rgba(16,185,129,0.12)] backdrop-blur-md sm:px-4'>
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent' />

      <Link
        href='/'
        className='inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900/80 px-2 py-1.5 text-xs uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 sm:text-sm'
      >
        <ArrowLeft className='h-4 w-4 shrink-0' />
        <span className='hidden sm:inline'>Копилка</span>
        <span className='sm:hidden'>Назад</span>
      </Link>

      <div className='min-w-0 text-center'>
        <p className='truncate text-sm font-black uppercase tracking-[0.22em] text-emerald-400 [text-shadow:0_0_14px_rgba(16,185,129,0.25)] sm:text-base'>
          Игровое лобби
        </p>
        <p className='truncate text-[10px] text-emerald-500/50 sm:text-xs'>
          game_lobby.sys · online
        </p>
      </div>

      <div className='w-[74px] sm:w-[92px]' aria-hidden />
    </header>
  );
}
