'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Construction, Lock } from 'lucide-react';
import {
  GAME_DIFFICULTY_LABELS,
  GAMES_CATALOG,
  GAMES_UPCOMING_PLACEHOLDER_COUNT,
  type GameCatalogItem,
  type GameDifficulty,
} from '@/lib/games/catalog';
import { cn } from '@/lib/utils';
import { ShimmerPlayButton } from './effects/ShimmerPlayButton';
import { useLobbyMotionProfile } from './effects/useLobbyMotionProfile';

interface GamesCatalogProps {
  availableBonuses: number;
}

const ICON_RING_STYLES: Record<string, string> = {
  generator:
    'border-amber-400/60 bg-amber-400/10 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)]',
  math: 'border-lime-400/60 bg-lime-400/10 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.25)]',
  color:
    'border-orange-400/60 bg-orange-400/10 text-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.25)]',
  sequence:
    'border-violet-400/60 bg-violet-400/10 text-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.25)]',
  'odd-number':
    'border-sky-400/60 bg-sky-400/10 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
  'quick-balance':
    'border-fuchsia-400/60 bg-fuchsia-400/10 text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.25)]',
};

const CARD_HOVER_GLOW: Record<string, string> = {
  generator:
    'hover:border-amber-400/55 hover:shadow-lg hover:shadow-amber-500/25',
  math: 'hover:border-lime-400/55 hover:shadow-lg hover:shadow-lime-500/25',
  color:
    'hover:border-orange-400/55 hover:shadow-lg hover:shadow-orange-500/25',
  sequence:
    'hover:border-violet-400/55 hover:shadow-lg hover:shadow-violet-500/25',
  'odd-number':
    'hover:border-sky-400/55 hover:shadow-lg hover:shadow-sky-500/25',
  'quick-balance':
    'hover:border-fuchsia-400/55 hover:shadow-lg hover:shadow-fuchsia-500/25',
};

/** Бейдж категории — цвет совпадает с акцентом карточки */
const GAME_TAG_BADGE_STYLES: Record<string, string> = {
  generator:
    'border-amber-400/60 bg-amber-500/25 text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.22)]',
  math:
    'border-lime-400/60 bg-lime-500/25 text-lime-100 shadow-[0_0_14px_rgba(163,230,53,0.22)]',
  color:
    'border-orange-400/60 bg-orange-500/25 text-orange-100 shadow-[0_0_14px_rgba(251,146,60,0.22)]',
  sequence:
    'border-violet-400/60 bg-violet-500/25 text-violet-100 shadow-[0_0_14px_rgba(167,139,250,0.22)]',
  'odd-number':
    'border-sky-400/60 bg-sky-500/25 text-sky-100 shadow-[0_0_14px_rgba(56,189,248,0.22)]',
  'quick-balance':
    'border-fuchsia-400/60 bg-fuchsia-500/25 text-fuchsia-100 shadow-[0_0_14px_rgba(217,70,239,0.22)]',
};

const DIFFICULTY_BADGE_STYLES: Record<GameDifficulty, string> = {
  easy:
    'border-yellow-400/60 bg-yellow-500/25 text-yellow-100 shadow-[0_0_14px_rgba(250,204,21,0.22)]',
  medium:
    'border-amber-400/55 bg-amber-500/20 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.18)]',
  hard:
    'border-rose-400/60 bg-rose-500/25 text-rose-100 shadow-[0_0_14px_rgba(244,63,94,0.22)]',
};

/** Подсветка строки «Награда» — в тон акцента модуля */
const GAME_REWARD_STYLES: Record<string, { label: string; value: string }> = {
  generator: {
    label: 'text-amber-400/90',
    value: 'text-amber-200 font-semibold',
  },
  math: {
    label: 'text-lime-400/90',
    value: 'text-lime-200 font-semibold',
  },
  color: {
    label: 'text-orange-400/90',
    value: 'text-orange-200 font-semibold',
  },
  sequence: {
    label: 'text-violet-400/90',
    value: 'text-violet-200 font-semibold',
  },
  'odd-number': {
    label: 'text-sky-400/90',
    value: 'text-sky-200 font-semibold',
  },
  'quick-balance': {
    label: 'text-fuchsia-400/90',
    value: 'text-fuchsia-200 font-semibold',
  },
};

const UPCOMING_CARD_ACCENTS = [
  'border-cyan-400/35 bg-cyan-400/5 text-cyan-400/70 shadow-[0_0_16px_rgba(34,211,238,0.12)]',
  'border-violet-400/35 bg-violet-400/5 text-violet-400/70 shadow-[0_0_16px_rgba(167,139,250,0.12)]',
] as const;

function GameComingSoonCard({
  index,
  glassBlur,
}: {
  index: number;
  glassBlur: string;
}) {
  const iconRing = UPCOMING_CARD_ACCENTS[index % UPCOMING_CARD_ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className='h-full transform-gpu will-change-transform'
    >
      <article
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-dashed',
          'border-zinc-700/80 bg-zinc-900/40 px-4 py-3 sm:p-5 md:p-6',
          glassBlur,
          'transform-gpu will-change-transform',
        )}
      >
        <div
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.04),transparent_45%,rgba(113,113,122,0.06))]'
          aria-hidden
        />

        <div className='relative flex items-start justify-between gap-2 sm:gap-3'>
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 transform-gpu items-center justify-center rounded-full border-2 will-change-transform sm:h-12 sm:w-12',
              iconRing,
            )}
            aria-hidden
          >
            <Construction className='h-5 w-5 opacity-80' />
          </span>
          <span className='rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-400/90 sm:text-[10px]'>
            В разработке
          </span>
        </div>

        <h2 className='relative mt-3 text-base font-bold tracking-tight text-zinc-400 sm:mt-4 sm:text-lg'>
          Скоро
        </h2>
        <p className='relative mt-1.5 flex-1 text-sm leading-relaxed text-zinc-600 sm:mt-2'>
          Готовим новую игру для каталога. Загляните позже.
        </p>

        <div className='relative mt-4 pt-1 sm:mt-5'>
          <div
            className='flex min-h-[44px] w-full transform-gpu cursor-not-allowed items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600 will-change-transform sm:text-xs'
            aria-disabled
          >
            В разработке
          </div>
        </div>
      </article>
    </motion.div>
  );
}

function GameCard({
  game,
  availableBonuses,
  index,
  glassBlur,
}: {
  game: GameCatalogItem;
  availableBonuses: number;
  index: number;
  glassBlur: string;
}) {
  const canAfford = availableBonuses >= game.costMin;
  const Icon = game.icon;
  const iconRing = ICON_RING_STYLES[game.id] ?? ICON_RING_STYLES.math;
  const hoverGlow = CARD_HOVER_GLOW[game.id] ?? CARD_HOVER_GLOW.math;
  const rewardStyle = GAME_REWARD_STYLES[game.id] ?? GAME_REWARD_STYLES.math;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className='h-full transform-gpu will-change-transform'
    >
      <article
        className={cn(
          'group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60',
          'px-4 py-3 transition-all duration-300 sm:p-5 md:p-6',
          glassBlur,
          'transform-gpu will-change-transform',
          'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
          hoverGlow,
          !canAfford && 'opacity-85',
        )}
      >
        <div className='flex items-start justify-between gap-2 sm:gap-3'>
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 transform-gpu items-center justify-center rounded-full border-2 will-change-transform sm:h-12 sm:w-12',
              iconRing,
            )}
            aria-hidden
          >
            <Icon className='h-5 w-5' />
          </span>
          <div className='flex max-w-[55%] flex-wrap justify-end gap-1 sm:max-w-none sm:gap-1.5'>
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider sm:px-2.5 sm:text-[10px]',
                GAME_TAG_BADGE_STYLES[game.id] ?? GAME_TAG_BADGE_STYLES.math,
              )}
            >
              {game.tag}
            </span>
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider sm:px-2.5 sm:text-[10px]',
                DIFFICULTY_BADGE_STYLES[game.difficulty],
              )}
            >
              {GAME_DIFFICULTY_LABELS[game.difficulty]}
            </span>
          </div>
        </div>

        <h2 className='mt-3 text-base font-bold tracking-tight text-zinc-100 sm:mt-4 sm:text-lg'>
          {game.title}
        </h2>
        <p className='mt-1.5 flex-1 text-sm leading-relaxed text-zinc-400 sm:mt-2'>
          {game.description}
        </p>

        <div className='mt-3 space-y-1 font-mono text-[11px] sm:mt-4 sm:text-xs'>
          <p className='text-emerald-400'>
            Стоимость:{' '}
            <span className='font-semibold text-emerald-300'>{game.costLabel}</span>
          </p>
          <p className={rewardStyle.label}>
            Награда:{' '}
            <span className={rewardStyle.value}>{game.rewardHint}</span>
          </p>
        </div>

        <div className='mt-4 pt-1 sm:mt-5'>
          {canAfford ? (
            <ShimmerPlayButton href={game.href}>Играть</ShimmerPlayButton>
          ) : (
            <Link
              href='/good-deeds'
              className='flex min-h-[44px] w-full transform-gpu items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors will-change-transform hover:border-amber-500/30 hover:text-amber-400/80 sm:text-xs'
            >
              <Lock className='h-3.5 w-3.5 shrink-0' />
              <span className='text-center'>
                Нужно ещё {game.costMin - availableBonuses} бонусов
              </span>
            </Link>
          )}
        </div>
      </article>
    </motion.div>
  );
}

export function GamesCatalog({ availableBonuses }: GamesCatalogProps) {
  const { heavyBlur } = useLobbyMotionProfile();
  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  return (
    <section
      id='games-catalog'
      aria-label='Каталог игр'
      className='scroll-mt-24 mb-8 sm:mb-10 md:mb-12'
    >
      <div className='mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <h2 className='font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-500/50 sm:text-xs'>
            Каталог
          </h2>
          <p className='mt-1 text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl md:text-3xl'>
            Активные модули
          </p>
          <p className='mt-1 font-mono text-xs text-zinc-500 sm:text-sm'>
            Ставка списывается при старте сессии
          </p>
        </div>
        <span className='w-fit shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 font-mono text-[10px] text-emerald-400 sm:px-3 sm:text-xs'>
          {GAMES_CATALOG.length} online
        </span>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6'>
        {GAMES_CATALOG.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            availableBonuses={availableBonuses}
            index={index}
            glassBlur={glassBlur}
          />
        ))}
      </div>

      <div className='mt-10 border-t border-zinc-800/80 pt-8 sm:mt-12 sm:pt-10'>
        <div className='mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between'>
          <div className='min-w-0'>
            <p className='mt-1 text-lg font-bold tracking-tight text-zinc-300 sm:text-xl md:text-2xl'>
              В разработке
            </p>
            <p className='mt-1 font-mono text-xs text-zinc-600 sm:text-sm'>
              Скоро появятся новые игры
            </p>
          </div>
          <span className='w-fit shrink-0 rounded-full border border-zinc-600/35 bg-zinc-800/50 px-2.5 py-1 font-mono text-[10px] text-zinc-500 sm:px-3 sm:text-xs'>
            {GAMES_UPCOMING_PLACEHOLDER_COUNT} offline
          </span>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6'>
          {Array.from({ length: GAMES_UPCOMING_PLACEHOLDER_COUNT }).map((_, index) => (
            <GameComingSoonCard
              key={`upcoming-${index}`}
              index={index}
              glassBlur={glassBlur}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
