'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown, Medal, Trophy } from 'lucide-react';
import { resolveAvatarUrl } from '@/lib/avatar';
import type { SequenceLeaderboardEntry } from '@/lib/games/sequenceGame';
import { cn } from '@/lib/utils';

const DEFAULT_AVATAR = '/default-avatar.png';
const LeaderboardRow = motion(Link);

interface SequenceLeaderboardProps {
  entries: SequenceLeaderboardEntry[];
  isLoading: boolean;
}

function RankMarker({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span
        className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/10 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
        aria-label='1 место'
      >
        <Crown className='h-4 w-4 text-amber-400' />
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span
        className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-400/30 bg-zinc-500/10 shadow-[0_0_10px_rgba(212,212,216,0.25)]'
        aria-label='2 место'
      >
        <Medal className='h-4 w-4 text-zinc-300' />
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span
        className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 shadow-[0_0_10px_rgba(251,146,60,0.3)]'
        aria-label='3 место'
      >
        <Trophy className='h-4 w-4 text-orange-400' />
      </span>
    );
  }

  return (
    <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/60 font-mono text-xs font-bold text-zinc-500'>
      {rank}
    </span>
  );
}

export function SequenceLeaderboard({
  entries,
  isLoading,
}: SequenceLeaderboardProps) {
  return (
    <aside className='flex min-h-[400px] flex-col space-y-4 rounded-2xl border border-emerald-500/10 bg-zinc-900/40 p-6 backdrop-blur-md'>
      <header className='space-y-2'>
        <span className='inline-block rounded-md border border-orange-500/25 bg-orange-500/10 px-3 py-1 font-mono text-sm uppercase tracking-wider text-orange-400'>
          Мегамозги сайта
        </span>
        <p className='font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600'>
          Топ-10 рекордов
        </p>
      </header>

      {isLoading ? (
        <div className='flex flex-1 flex-col justify-center space-y-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='h-14 animate-pulse rounded-xl border border-zinc-800/50 bg-zinc-800/30'
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className='flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 px-4 py-8 text-center'>
          <p className='font-mono text-sm text-zinc-500'>
            Пока никто не установил рекорд
          </p>
          <p className='mt-1 text-xs text-zinc-600'>Станьте первым мегамозгом</p>
        </div>
      ) : (
        <ul className='flex flex-1 flex-col space-y-2.5 overflow-y-auto pr-1'>
          {entries.map((entry, index) => {
            const rank = index + 1;
            const displayName = entry.username ?? 'Игрок';

            return (
              <li key={entry.id}>
                <LeaderboardRow
                  href={`/profile/${entry.id}`}
                  prefetch={false}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className={cn(
                    'transform-gpu flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5 backdrop-blur-sm will-change-transform',
                    'transition-colors hover:border-emerald-500/25 hover:bg-zinc-900/60',
                    rank <= 3 && 'border-emerald-500/15 bg-emerald-950/20',
                  )}
                  aria-label={`Профиль ${displayName}, рекорд ${entry.maxSequenceRecord}`}
                >
                  <RankMarker rank={rank} />
                  <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-zinc-700'>
                    <Image
                      src={resolveAvatarUrl(entry.avatar || DEFAULT_AVATAR)}
                      alt={displayName}
                      fill
                      sizes='36px'
                      className='object-cover'
                      onError={(event) => {
                        const target = event.currentTarget;
                        target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                  <span className='min-w-0 flex-1 truncate text-sm font-medium text-zinc-200'>
                    {displayName}
                  </span>
                  <span className='font-mono text-sm font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]'>
                    {entry.maxSequenceRecord}
                  </span>
                </LeaderboardRow>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
