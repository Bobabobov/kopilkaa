'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coins, HeartHandshake, Play } from 'lucide-react';
import { GAMES_CATALOG, GAMES_UPCOMING_PLACEHOLDER_COUNT } from '@/lib/games/catalog';
import { cn } from '@/lib/utils';
import { NumberTicker } from './effects/NumberTicker';
import { useLobbyMotionProfile } from './effects/useLobbyMotionProfile';

interface GamesBalanceStripProps {
  availableBonuses: number;
}

export function GamesBalanceStrip({ availableBonuses }: GamesBalanceStripProps) {
  const { heavyBlur } = useLobbyMotionProfile();

  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  return (
    <motion.section
      id='games-balance'
      aria-label='Баланс бонусов'
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className='scroll-mt-24 h-full'
    >
      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-900/80',
          'shadow-[0_0_20px_rgba(16,185,129,0.1)]',
          glassBlur,
        )}
      >
        <div className='px-4 py-3 sm:p-5 md:p-6'>
          <div className='flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-start gap-3 sm:gap-4'>
              <span
                className='flex h-11 w-11 shrink-0 transform-gpu items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] will-change-transform sm:h-12 sm:w-12'
                aria-hidden
              >
                <Coins className='h-5 w-5' />
              </span>
              <div className='min-w-0'>
                <p className='font-mono text-[10px] uppercase tracking-widest text-emerald-500/50 sm:text-xs'>
                  Доступно для игр
                </p>
                <p className='mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0'>
                  <NumberTicker
                    value={availableBonuses}
                    className='font-mono text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_#10b981] filter sm:text-4xl'
                  />
                  <span className='font-mono text-sm text-zinc-500 sm:text-base'>
                    бонусов
                  </span>
                </p>
                <div className='mt-2 flex flex-wrap gap-2 sm:mt-3'>
                  <span className='rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 font-mono text-[10px] text-emerald-400/80 sm:px-3 sm:text-xs'>
                    {GAMES_CATALOG.length} online
                  </span>
                  <span className='rounded-full border border-zinc-600/35 bg-zinc-800/50 px-2.5 py-1 font-mono text-[10px] text-zinc-500 sm:px-3 sm:text-xs'>
                    {GAMES_UPCOMING_PLACEHOLDER_COUNT} offline
                  </span>
                  {availableBonuses < 5 ? (
                    <span className='rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 font-mono text-[10px] text-amber-400/80 sm:px-3 sm:text-xs'>
                      low_balance
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end'>
              <Link
                href='/good-deeds'
                className='inline-flex min-h-[44px] transform-gpu items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/60 px-4 font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition-colors will-change-transform hover:border-emerald-500/30 hover:text-emerald-400 sm:px-5 sm:text-xs'
              >
                <HeartHandshake className='h-4 w-4 shrink-0' />
                Заработать бонусы
              </Link>
              <a
                href='#games-catalog'
                className={cn(
                  'inline-flex min-h-[44px] transform-gpu items-center justify-center gap-2 rounded-full',
                  'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 sm:px-6',
                  'font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-950 sm:text-xs',
                  'shadow-lg shadow-emerald-500/30 will-change-transform',
                  'transition-[transform,box-shadow] duration-300',
                  'hover:scale-[1.02] hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500',
                  'hover:shadow-emerald-500/50 active:scale-95 motion-reduce:hover:scale-100',
                )}
              >
                <Play className='h-4 w-4 shrink-0' />
                К играм
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
