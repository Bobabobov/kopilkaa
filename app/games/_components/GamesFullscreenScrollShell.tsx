'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';

interface GamesFullscreenScrollShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Подстраницы /games/* рендерятся внутри fullscreen layout
 * (`fixed inset-0 overflow-hidden`). Скролл должен жить здесь, а не на body.
 */
export function GamesFullscreenScrollShell({
  children,
  className,
}: GamesFullscreenScrollShellProps) {
  return (
    <div
      className={cn(
        'games-lobby-scrollbar relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain touch-pan-y',
        className,
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  );
}
