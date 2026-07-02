'use client';

import { useEffect, type ReactNode } from 'react';
import { GamesLobbyTopBar } from './GamesLobbyTopBar';
import { ParticlesBackground } from './effects/ParticlesBackground';
import { useLobbyMotionProfile } from './effects/useLobbyMotionProfile';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';

interface GamesLobbyShellProps {
  children: ReactNode;
}

export function GamesLobbyShell({ children }: GamesLobbyShellProps) {
  const { enableParticles } = useLobbyMotionProfile();

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
    <div className='relative flex h-full min-h-0 w-full flex-col bg-zinc-950 text-zinc-100'>
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          enableParticles
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-zinc-950 to-zinc-950'
            : 'bg-zinc-950 bg-[radial-gradient(ellipse_at_center,_rgba(6,78,59,0.2)_0%,_transparent_55%)]',
        )}
        aria-hidden
      />

      <ParticlesBackground enabled={enableParticles} />

      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] motion-reduce:opacity-50'
        aria-hidden
      />

      <GamesLobbyTopBar />

      <div className='games-lobby-scrollbar relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain'>
        {children}
      </div>
    </div>
  );
}
