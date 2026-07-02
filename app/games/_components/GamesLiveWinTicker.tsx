'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import type { GameLiveWinEntry } from '@/lib/games/liveHistory';
import { cn } from '@/lib/utils';

interface LiveHistoryApiResponse {
  success: boolean;
  data: GameLiveWinEntry[];
}

const ROTATE_MS = 4200;

export function GamesLiveWinTicker() {
  const [entries, setEntries] = useState<GameLiveWinEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const response = await fetch('/api/games/live-history', {
          cache: 'no-store',
        });
        const raw = (await response.json().catch(() => null)) as LiveHistoryApiResponse | null;

        if (!cancelled && raw?.data) {
          setEntries(raw.data);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (entries.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % entries.length);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [entries.length]);

  const activeEntry = entries[activeIndex];

  return (
    <motion.section
      aria-label='Лента выигрышей'
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='mb-6 sm:mb-8'
    >
      <div
        className={cn(
          'flex transform-gpu items-center gap-3 overflow-hidden rounded-xl',
          'border border-emerald-500/10 bg-zinc-900/40 px-4 py-2 backdrop-blur-md will-change-transform',
        )}
      >
        <span
          className='flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-500/70'
          aria-hidden
        >
          <Radio className='h-3.5 w-3.5 animate-pulse text-emerald-400' />
          live
        </span>

        <div className='relative min-h-[1.25rem] min-w-0 flex-1 overflow-hidden'>
          {isLoading ? (
            <p className='truncate font-mono text-xs text-zinc-500'>
              Подключаем ленту выигрышей…
            </p>
          ) : entries.length === 0 ? (
            <p className='truncate font-mono text-xs text-zinc-500'>
              Пока нет свежих выигрышей — станьте первым в эфире
            </p>
          ) : (
            <AnimatePresence mode='wait'>
              <motion.p
                key={activeEntry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='transform-gpu truncate font-mono text-xs text-zinc-400 will-change-transform'
              >
                <span className='text-zinc-300'>{activeEntry.username}</span>
                <span className='text-zinc-600'> выиграл </span>
                <span className='font-bold text-emerald-400'>+{activeEntry.amount}</span>
                <span className='text-zinc-600'> в </span>
                <span className='text-orange-400/90'>{activeEntry.gameName}</span>
              </motion.p>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.section>
  );
}
