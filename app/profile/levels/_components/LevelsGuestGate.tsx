'use client';

import Link from 'next/link';
import { LogIn, ShieldAlert, UserPlus } from 'lucide-react';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { cn } from '@/lib/utils';
import { LevelsShell } from './LevelsShell';
import { useLevelsMotionProfile } from './effects/useLevelsMotionProfile';

export function LevelsGuestGate() {
  const { heavyBlur } = useLevelsMotionProfile();
  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  const loginHref = buildAuthModalUrl({
    pathname: '/profile/levels',
    modal: 'auth/login/email',
  });
  const signupHref = buildAuthModalUrl({
    pathname: '/profile/levels',
    modal: 'auth/signup',
  });

  return (
    <LevelsShell>
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-16">
        <div
          className={cn(
            'w-full max-w-3xl overflow-hidden rounded-2xl border border-[#f9bc60]/30 bg-[#004643]/60',
            'px-4 py-8 text-center shadow-[0_0_24px_rgba(249,188,96,0.12)] sm:p-12',
            glassBlur,
          )}
          role="alert"
        >
          <span
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#f9bc60]/40 bg-[#f9bc60]/10 text-[#f9bc60] shadow-[0_0_20px_rgba(249,188,96,0.2)] sm:h-16 sm:w-16"
            aria-hidden
          >
            <ShieldAlert className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>

          <h1 className="mt-5 bg-gradient-to-r from-[#f9bc60] via-[#fffffe] to-[#abd1c6] bg-clip-text text-2xl font-black uppercase tracking-tight text-transparent sm:mt-6 sm:text-3xl">
            Войдите в профиль
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-mono text-sm leading-relaxed text-[#abd1c6]/75 sm:text-base">
            Система уровней доступна авторизованным пользователям. После входа
            увидите свой прогресс, графики и карту привилегий.
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              href={loginHref}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f9bc60] via-amber-400 to-[#e8a545] px-6 text-xs font-extrabold uppercase tracking-widest text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 transition-all hover:brightness-110 active:scale-95 motion-reduce:active:scale-100"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              Войти
            </Link>
            <Link
              href={signupHref}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#abd1c6]/30 bg-[#001e1d]/50 px-6 text-xs font-bold uppercase tracking-widest text-[#abd1c6] transition-colors hover:border-[#f9bc60]/35 hover:text-[#f9bc60]"
            >
              <UserPlus className="h-4 w-4 shrink-0" />
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </LevelsShell>
  );
}
