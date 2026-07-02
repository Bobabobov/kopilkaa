'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown, Medal, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { resolveAvatarUrl } from '@/lib/avatar';
import type { GameLeaderboardEntry } from '@/lib/games/leaderboard';
import { cn } from '@/lib/utils';

const DEFAULT_AVATAR = '/default-avatar.png';
const LeaderboardRow = motion(Link);

interface GlobalLeaderboardsResponse {
  success: boolean;
  data: {
    topWinners: GameLeaderboardEntry[];
    topLosers: GameLeaderboardEntry[];
  };
}

interface GamesGlobalLeaderboardsProps {
  className?: string;
}

function RankMarker({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Crown className='h-4 w-4 text-amber-400' aria-hidden />;
  }

  if (rank === 2) {
    return <Medal className='h-4 w-4 text-zinc-300' aria-hidden />;
  }

  if (rank === 3) {
    return <Trophy className='h-4 w-4 text-orange-400' aria-hidden />;
  }

  return (
    <span className='font-mono text-xs font-bold text-zinc-500'>{rank}</span>
  );
}

interface LeaderboardTableProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  entries: GameLeaderboardEntry[];
  isLoading: boolean;
  scoreTone: 'positive' | 'negative';
  emptyText: string;
}

function LeaderboardTable({
  title,
  subtitle,
  icon,
  entries,
  isLoading,
  scoreTone,
  emptyText,
}: LeaderboardTableProps) {
  return (
    <section className='flex min-h-[360px] flex-col rounded-2xl border border-emerald-500/10 bg-zinc-900/40 p-5 backdrop-blur-md sm:p-6'>
      <header className='mb-4 flex items-start gap-3'>
        <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950/60'>
          {icon}
        </span>
        <div>
          <h2 className='font-mono text-sm uppercase tracking-wider text-zinc-100'>
            {title}
          </h2>
          <p className='mt-1 text-xs text-zinc-500'>{subtitle}</p>
        </div>
      </header>

      {isLoading ? (
        <div className='flex flex-1 flex-col justify-center space-y-3'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className='h-12 animate-pulse rounded-xl border border-zinc-800/50 bg-zinc-800/30'
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className='flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-800 px-4 py-8 text-center text-sm text-zinc-500'>
          {emptyText}
        </div>
      ) : (
        <ul className='flex flex-1 flex-col space-y-2 overflow-y-auto pr-1'>
          {entries.map((entry, index) => {
            const rank = index + 1;
            const displayName = entry.username ?? 'Игрок';

            return (
              <li key={entry.id}>
                <LeaderboardRow
                  href={`/profile/${entry.id}`}
                  prefetch={false}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    'transform-gpu flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5 will-change-transform',
                    'transition-colors hover:border-emerald-500/20 hover:bg-zinc-900/60',
                    rank <= 3 && 'border-emerald-500/15 bg-emerald-950/15',
                  )}
                >
                  <span
                    className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/60'
                    aria-label={`${rank} место`}
                  >
                    <RankMarker rank={rank} />
                  </span>
                  <div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-700'>
                    <Image
                      src={resolveAvatarUrl(entry.avatar || DEFAULT_AVATAR)}
                      alt={displayName}
                      fill
                      sizes='32px'
                      className='object-cover'
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                  <span className='min-w-0 flex-1 truncate text-sm text-zinc-200'>
                    {displayName}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-sm font-bold',
                      scoreTone === 'positive'
                        ? 'text-emerald-400'
                        : 'text-red-400',
                    )}
                  >
                    {scoreTone === 'positive' ? '+' : '−'}
                    {entry.score} бон.
                  </span>
                </LeaderboardRow>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function GamesGlobalLeaderboards({
  className,
}: GamesGlobalLeaderboardsProps) {
  const [topWinners, setTopWinners] = useState<GameLeaderboardEntry[]>([]);
  const [topLosers, setTopLosers] = useState<GameLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadGlobalLeaderboards() {
      setIsLoading(true);

      try {
        const response = await fetch('/api/games/leaderboard?scope=global', {
          cache: 'no-store',
        });
        const payload = (await response.json()) as GlobalLeaderboardsResponse;

        if (!cancelled && payload.success && payload.data) {
          setTopWinners(payload.data.topWinners);
          setTopLosers(payload.data.topLosers);
        }
      } catch {
        if (!cancelled) {
          setTopWinners([]);
          setTopLosers([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadGlobalLeaderboards();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={cn('mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6', className)}>
      <LeaderboardTable
        title='Чемпионы игр'
        subtitle='Кто больше всех выиграл бонусов во всех играх'
        icon={<TrendingUp className='h-4 w-4 text-emerald-400' aria-hidden />}
        entries={topWinners}
        isLoading={isLoading}
        scoreTone='positive'
        emptyText='Пока нет игроков с выигрышами'
      />
      <LeaderboardTable
        title='В минусе'
        subtitle='Кто потратил на игры больше, чем выиграл'
        icon={<TrendingDown className='h-4 w-4 text-red-400' aria-hidden />}
        entries={topLosers}
        isLoading={isLoading}
        scoreTone='negative'
        emptyText='Пока никто не в убытке по играм'
      />
    </div>
  );
}
