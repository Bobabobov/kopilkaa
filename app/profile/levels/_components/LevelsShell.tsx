'use client';

import { useEffect, type ReactNode } from 'react';
import { LevelsTopBar } from './LevelsTopBar';
import { LevelsAscensionParticles } from './effects/LevelsAscensionParticles';
import { useLevelsMotionProfile } from './effects/useLevelsMotionProfile';
import { cn } from '@/lib/utils';
import './effects/levelsHub.css';

interface LevelsShellProps {
  children: ReactNode;
}

export function LevelsShell({ children }: LevelsShellProps) {
  const { enableParticles } = useLevelsMotionProfile();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-[#001e1d] text-[#fffffe] isolate">
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          enableParticles
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f9bc60]/12 via-[#004643]/40 to-[#001e1d]'
            : 'bg-[radial-gradient(ellipse_at_center,_rgba(249,188,96,0.08)_0%,_transparent_55%)] bg-[#001e1d]',
        )}
        aria-hidden
      />

      <LevelsAscensionParticles enabled={enableParticles} />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(249,188,96,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(171,209,198,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)] motion-reduce:opacity-40"
        aria-hidden
      />

      <div
        className="levels-hub-orbit pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full border border-[#f9bc60]/10 bg-[radial-gradient(circle,rgba(249,188,96,0.06)_0%,transparent_70%)] sm:top-28 sm:h-80 sm:w-80"
        aria-hidden
      />

      <LevelsTopBar />

      <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        {children}
      </div>
    </div>
  );
}
