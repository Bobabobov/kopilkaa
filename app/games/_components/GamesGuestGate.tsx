'use client';

import Link from 'next/link';
import { LogIn, ShieldAlert, UserPlus } from 'lucide-react';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { cn } from '@/lib/utils';
import { GamesLobbyShell } from './GamesLobbyShell';
import { useLobbyMotionProfile } from './effects/useLobbyMotionProfile';

interface GamesGuestGateProps {
  returnPath?: string;
}

export function GamesGuestGate({ returnPath = '/games' }: GamesGuestGateProps) {
  const { heavyBlur } = useLobbyMotionProfile();
  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  const loginHref = buildAuthModalUrl({
    pathname: returnPath,
    modal: 'auth/login/email',
  });
  const signupHref = buildAuthModalUrl({
    pathname: returnPath,
    modal: 'auth/signup',
  });

  return (
    <GamesLobbyShell>
      <div className='flex min-h-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-16'>
        <div
          className={cn(
            'w-full max-w-3xl overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-900/80',
            'px-4 py-8 text-center shadow-[0_0_20px_rgba(16,185,129,0.1)] sm:p-12',
            glassBlur,
          )}
          role='alert'
        >
          <span
            className='mx-auto flex h-14 w-14 transform-gpu items-center justify-center rounded-full border-2 border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] will-change-transform sm:h-16 sm:w-16'
            aria-hidden
          >
            <ShieldAlert className='h-6 w-6 sm:h-7 sm:w-7' />
          </span>

          <h1 className='mt-5 bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-400 bg-clip-text text-2xl font-black uppercase tracking-tight text-transparent sm:mt-6 sm:text-3xl md:text-4xl'>
            Доступ ограничен
          </h1>
          <p className='mx-auto mt-4 max-w-lg font-mono text-sm leading-relaxed text-emerald-500/70 sm:text-base'>
            Опа, а кто-то не авторизован — нельзя. Нужно войти или
            зарегистрироваться.
          </p>

          <div className='mt-7 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3'>
            <Link
              href={loginHref}
              className='inline-flex min-h-[44px] transform-gpu items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-6 text-xs font-extrabold uppercase tracking-widest text-zinc-950 shadow-lg shadow-emerald-500/10 transition-all will-change-transform hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 active:scale-95 motion-reduce:active:scale-100'
            >
              <LogIn className='h-4 w-4 shrink-0' />
              Войти
            </Link>
            <Link
              href={signupHref}
              className='inline-flex min-h-[44px] transform-gpu items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/60 px-6 font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors will-change-transform hover:border-emerald-500/30 hover:text-emerald-400'
            >
              <UserPlus className='h-4 w-4 shrink-0' />
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </GamesLobbyShell>
  );
}
