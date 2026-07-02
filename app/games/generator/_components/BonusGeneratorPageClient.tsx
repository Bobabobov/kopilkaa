'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';
import {
  GENERATOR_COST,
  GENERATOR_RUN_ANIMATION_MS,
} from '@/lib/games/bonusGenerator';
import {
  formatGeneratorProbability,
  GENERATOR_REWARD_TIERS,
} from '@/lib/games/bonusGeneratorDistribution';
import {
  formatBonusDelta,
  GENERATOR_OUTCOME_MESSAGES,
  GENERATOR_OUTCOME_TITLES,
} from '@/lib/games/bonusGeneratorDisplay';
import { celebrateGeneratorLaunch } from '@/lib/games/bonusGeneratorConfetti';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import { NumberTicker } from '@/app/games/_components/effects/NumberTicker';
import { GameLeaderboard } from '@/app/games/_components/GameLeaderboard';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';
import { GamesFullscreenScrollShell } from '@/app/games/_components/GamesFullscreenScrollShell';
import { useGameLeaderboard } from '@/hooks/games/useGameLeaderboard';
import { BonusGeneratorCelebrate } from './BonusGeneratorCelebrate';
import { BonusGeneratorAnimatedReward } from './BonusGeneratorAnimatedReward';
import { useFeedbackMeaningfulOnResult } from '@/hooks/feedback/useFeedbackMeaningfulOnResult';

type GeneratorPhase = 'idle' | 'running' | 'result';

interface BonusGeneratorPageClientProps {
  initialBalance: number;
}

interface GeneratorApiResponse {
  success: boolean;
  data: BonusGeneratorRunResult;
}

const LABEL_REWARD: Record<BonusGeneratorRunResult['label'], number> = {
  none: 0,
  small: 5,
  refund: 15,
  boost: 30,
  super: 75,
  mega: 500,
};

const OUTER_COIN_COUNT = 6;
const INNER_COIN_COUNT = 3;
const OUTER_ORBIT_IDLE = 58;
const OUTER_ORBIT_END = 22;
const INNER_ORBIT_IDLE = 30;
const INNER_ORBIT_END = 14;

function synthesisOrbitRadius(
  idleRadius: number,
  endRadius: number,
  progress: number,
  isRunning: boolean,
): number {
  if (!isRunning) return idleRadius;
  const t = progress / 100;
  return idleRadius - (idleRadius - endRadius) * t;
}

function GoldenCoin({
  size = 'md',
  bright = false,
}: {
  size?: 'sm' | 'md';
  bright?: boolean;
}) {
  const sizeClass = size === 'sm' ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-9 w-9 sm:h-10 sm:w-10';

  return (
    <div className={cn('relative', sizeClass)}>
      <div
        className={cn(
          'h-full w-full rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700',
          'shadow-[0_3px_12px_rgba(245,158,11,0.5),inset_0_1px_3px_rgba(255,255,255,0.4)]',
          bright && 'shadow-[0_4px_18px_rgba(251,191,36,0.75),inset_0_2px_4px_rgba(255,255,255,0.55)]',
        )}
      />
      <div className='pointer-events-none absolute inset-1 rounded-full bg-gradient-to-br from-white/55 to-transparent opacity-75' />
    </div>
  );
}

function OrbitCoinRing({
  count,
  idleRadius,
  endRadius,
  startAngleOffset,
  phase,
  progress,
  reducedMotion,
  coinSize,
  baseDuration,
}: {
  count: number;
  idleRadius: number;
  endRadius: number;
  startAngleOffset: number;
  phase: GeneratorPhase;
  progress: number;
  reducedMotion: boolean | null;
  coinSize: 'sm' | 'md';
  baseDuration: number;
}) {
  const isRunning = phase === 'running';
  const radius = synthesisOrbitRadius(idleRadius, endRadius, progress, isRunning);
  const orbitDuration = isRunning
    ? Math.max(0.55, baseDuration * (1 - progress / 130))
    : baseDuration;

  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const startAngle = startAngleOffset + (index / count) * 360;

        return (
          <motion.div
            key={`${count}-${index}`}
            className='absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform'
            style={{ rotate: startAngle }}
            animate={
              reducedMotion ? undefined : { rotate: startAngle + 360 }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: orbitDuration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: (index / count) * 0.12,
                  }
            }
          >
            <div
              className='absolute -translate-x-1/2 -translate-y-1/2 transform-gpu'
              style={{ left: radius, top: 0 }}
            >
              <GoldenCoin size={coinSize} bright={isRunning && progress > 40} />
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

function SynthesisCoreVisual({
  phase,
  progress,
}: {
  phase: GeneratorPhase;
  progress: number;
}) {
  const reducedMotion = useReducedMotion();
  const isRunning = phase === 'running';

  return (
    <div className='relative h-36 w-36 transform-gpu will-change-transform sm:h-44 sm:w-44 pointer-events-none'>
      <motion.div
        className='absolute left-1/2 top-1/2 h-[7.5rem] w-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/20 sm:h-[8.75rem] sm:w-[8.75rem]'
        animate={reducedMotion || !isRunning ? undefined : { rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className='absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-amber-500/15 sm:h-16 sm:w-16' />

      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className='absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/25'
          style={{ transform: `rotate(${(index / 8) * 360}deg) translateY(-4.25rem)` }}
        />
      ))}

      <OrbitCoinRing
        count={OUTER_COIN_COUNT}
        idleRadius={OUTER_ORBIT_IDLE}
        endRadius={OUTER_ORBIT_END}
        startAngleOffset={0}
        phase={phase}
        progress={progress}
        reducedMotion={reducedMotion}
        coinSize='md'
        baseDuration={16}
      />
      <OrbitCoinRing
        count={INNER_COIN_COUNT}
        idleRadius={INNER_ORBIT_IDLE}
        endRadius={INNER_ORBIT_END}
        startAngleOffset={60}
        phase={phase}
        progress={progress}
        reducedMotion={reducedMotion}
        coinSize='sm'
        baseDuration={11}
      />
    </div>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function useSynthesisProgress(phase: GeneratorPhase): number {
  const [progress, setProgress] = useState(0);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (phase === 'idle') {
      setProgress(0);
      return;
    }

    if (phase === 'result') {
      setProgress(100);
      return;
    }

    const runId = ++runIdRef.current;
    const start = performance.now();
    let frameId = 0;

    setProgress(0);

    const tick = (now: number) => {
      if (runId !== runIdRef.current) return;
      const elapsed = Math.max(0, now - start);
      const next = Math.min(100, (elapsed / GENERATOR_RUN_ANIMATION_MS) * 100);
      setProgress(next);
      if (next < 100) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => {
      runIdRef.current += 1;
      window.cancelAnimationFrame(frameId);
    };
  }, [phase]);

  return progress;
}

function SynthesisTube({
  phase,
  progress,
}: {
  phase: GeneratorPhase;
  progress: number;
}) {
  const isIdle = phase === 'idle';
  const isRunning = phase === 'running';
  const fill = isIdle ? 100 : progress;

  const label = isIdle
    ? 'Готов к синтезу'
    : isRunning
      ? 'Синтез в процессе…'
      : 'Синтез завершён';

  return (
    <div className='w-full max-w-sm space-y-2'>
      <div className='flex items-center justify-between gap-3 text-xs uppercase tracking-widest text-zinc-500'>
        <span>{label}</span>
        <span className='font-mono tabular-nums text-emerald-400/80'>
          {Math.round(fill)}%
        </span>
      </div>

      <div className='relative h-2.5 overflow-hidden rounded-full bg-zinc-800/90 ring-1 ring-zinc-700/50'>
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-emerald-400 transform-gpu will-change-transform',
            isIdle && 'shadow-[0_0_20px_#10b981]',
          )}
          style={{ width: `${fill}%` }}
          animate={
            isIdle
              ? { opacity: [0.65, 1, 0.65], boxShadow: ['0 0 12px #10b981', '0 0 24px #10b981', '0 0 12px #10b981'] }
              : undefined
          }
          transition={
            isIdle
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.15 }
          }
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
      </div>
    </div>
  );
}

function LaunchButton({
  canRun,
  isRunning,
  onClick,
}: {
  canRun: boolean;
  isRunning: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={!canRun || isRunning}
      className={cn(
        'group relative w-full max-w-sm overflow-hidden rounded-xl border border-emerald-500/40',
        'border-b-4 border-emerald-700 bg-gradient-to-b from-emerald-500 to-emerald-600',
        'px-6 py-4 text-center font-bold uppercase tracking-[0.18em] text-zinc-950',
        'transform-gpu will-change-transform transition-[transform,border-width] duration-100',
        'active:translate-y-1 active:border-b-0',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0 disabled:active:border-b-4',
        'shadow-[0_8px_0_rgba(4,120,87,0.9),0_0_30px_rgba(16,185,129,0.25)]',
      )}
    >
      <motion.span
        aria-hidden
        className='pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transform-gpu will-change-transform'
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
      <span className='relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base'>
        {isRunning ? (
          <>
            <LucideIcons.Loader2 size='sm' className='animate-spin' />
            Синтез…
          </>
        ) : (
          <>
            <LucideIcons.Zap size='sm' />
            Запустить синтез
          </>
        )}
      </span>
    </button>
  );
}

function LoyaltyTierCard({
  probabilityPercent,
  rewardDescription,
  isMega,
  isHighlighted,
}: {
  probabilityPercent: number;
  rewardDescription: string;
  isMega?: boolean;
  isHighlighted: boolean;
}) {
  return (
    <motion.div
      layout
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-300',
        isMega ? 'border-amber-500/25 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/50',
        isHighlighted && 'border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_24px_rgba(16,185,129,0.35)]',
      )}
      animate={
        isHighlighted
          ? { scale: [1, 1.03, 1], transition: { duration: 0.5 } }
          : undefined
      }
    >
      <span
        className={cn(
          'shrink-0 rounded-lg px-2 py-1 font-mono text-xs font-bold tabular-nums',
          isMega
            ? 'bg-amber-400/20 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
            : 'bg-emerald-400/15 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
        )}
      >
        {formatGeneratorProbability(probabilityPercent)}
      </span>
      <span
        className={cn(
          'text-xs leading-snug text-zinc-400 sm:text-sm',
          isMega && 'font-medium text-amber-200/90',
        )}
      >
        {rewardDescription}
      </span>
    </motion.div>
  );
}

function ResultHud({ result }: { result: BonusGeneratorRunResult }) {
  const title = GENERATOR_OUTCOME_TITLES[result.label];
  const message = GENERATOR_OUTCOME_MESSAGES[result.label];

  return (
    <motion.div
      className='w-full max-w-md rounded-2xl border border-emerald-500/25 bg-zinc-900/70 p-4 backdrop-blur-md sm:p-5'
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <p
        className={cn(
          'text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400',
          result.isMegaBonus && 'text-amber-400',
        )}
      >
        {title}
      </p>

      <p className='mt-2 text-center text-3xl font-black tabular-nums sm:text-4xl'>
        {result.reward > 0 ? (
          <span className='bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 bg-clip-text text-transparent'>
            <BonusGeneratorAnimatedReward value={result.reward} />
          </span>
        ) : (
          <span className='text-zinc-100'>
            <BonusGeneratorAnimatedReward value={result.reward} />
          </span>
        )}
        <span className='ml-2 text-base font-semibold text-zinc-500'>бонусов</span>
      </p>

      <p className='mt-2 text-center text-xs text-zinc-500 sm:text-sm'>{message}</p>

      <div className='mt-4 grid grid-cols-3 gap-2'>
        <div className='rounded-lg border border-zinc-800 bg-zinc-950/50 px-2 py-2 text-center'>
          <p className='text-[10px] uppercase tracking-wide text-zinc-600'>Списано</p>
          <p className='mt-0.5 font-bold text-zinc-200'>−{result.cost}</p>
        </div>
        <div className='rounded-lg border border-zinc-800 bg-zinc-950/50 px-2 py-2 text-center'>
          <p className='text-[10px] uppercase tracking-wide text-zinc-600'>Итог</p>
          <p
            className={cn(
              'mt-0.5 font-bold',
              result.netChange >= 0 ? 'text-emerald-400' : 'text-zinc-200',
            )}
          >
            {formatBonusDelta(result.netChange)}
          </p>
        </div>
        <div className='rounded-lg border border-zinc-800 bg-zinc-950/50 px-2 py-2 text-center'>
          <p className='text-[10px] uppercase tracking-wide text-zinc-600'>Баланс</p>
          <p className='mt-0.5 font-bold text-zinc-200'>{result.balanceAfter}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function BonusGeneratorPageClient({
  initialBalance,
}: BonusGeneratorPageClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const {
    entries: leaderboardEntries,
    isLoading: leaderboardLoading,
    meta: leaderboardMeta,
  } = useGameLeaderboard('generator');
  const [phase, setPhase] = useState<GeneratorPhase>('idle');
  useFeedbackMeaningfulOnResult(phase === 'result');
  const [result, setResult] = useState<BonusGeneratorRunResult | null>(null);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [flashReward, setFlashReward] = useState<number | null>(null);

  const synthesisProgress = useSynthesisProgress(phase);
  const isRunning = phase === 'running';
  const canRun = balance >= GENERATOR_COST && !isRunning;

  useEffect(() => {
    if (!result) {
      setFlashReward(null);
      return;
    }

    const reward = LABEL_REWARD[result.label];
    setFlashReward(reward);
    const timer = window.setTimeout(() => setFlashReward(null), 1000);
    return () => window.clearTimeout(timer);
  }, [result, celebrateKey]);

  const handleRun = useCallback(async () => {
    if (!canRun) return;

    setError(null);
    setResult(null);
    setPhase('running');

    try {
      celebrateGeneratorLaunch();
    } catch {
      // confetti не должен блокировать запуск
    }

    try {
      const [response] = await Promise.all([
        fetch('/api/games/generator/run', {
          method: 'POST',
          cache: 'no-store',
        }),
        wait(GENERATOR_RUN_ANIMATION_MS),
      ]);

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось запустить генератор бонусов'),
        );
      }

      const payload = raw as GeneratorApiResponse;
      setResult(payload.data);
      setBalance(payload.data.balanceAfter);
      setCelebrateKey((key) => key + 1);
      setPhase('result');
      invalidateProfileCache();
    } catch (runError) {
      setPhase('idle');
      setError(
        runError instanceof Error
          ? runError.message
          : 'Не удалось запустить генератор бонусов',
      );
    }
  }, [canRun]);

  return (
    <div className='relative flex h-full min-h-0 w-full flex-col bg-zinc-950'>
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:28px_28px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-y-0 left-0 w-full lg:w-2/3'
        aria-hidden
      >
        <div className='absolute left-1/2 top-[42%] h-[min(520px,70vw)] w-[min(520px,85vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_68%)]' />
      </div>

      <GamesFullscreenScrollShell>
      <main className='px-4 py-6 sm:px-6 sm:py-8 lg:px-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
        <div className='mx-auto max-w-7xl'>
          <header className='mb-6 sm:mb-8'>
            <Link
              href='/games'
              className='inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-emerald-400'
            >
              <LucideIcons.ArrowLeft size='sm' />
              Ко всем играм
            </Link>
            <h1 className='mt-3 text-2xl font-bold tracking-wide text-zinc-100 sm:text-3xl lg:text-4xl'>
              Генератор Бонусов
            </h1>
            <p className='mt-2 max-w-2xl text-sm text-zinc-500 sm:text-base'>
              Игровой терминал программы лояльности — запустите синтез и получите
              усиление баланса.
            </p>
          </header>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8'>
            {/* Левая колонка — слот-ядро */}
            <section className='flex flex-col items-center gap-6 lg:col-span-2 lg:gap-8'>
              <div className='relative flex w-full max-w-lg flex-col items-center'>
                <motion.div
                  className={cn(
                    'pointer-events-none relative flex aspect-square w-full max-w-[min(400px,88vw)] items-center justify-center',
                    'rounded-full border-2 border-emerald-500/30 bg-zinc-900/80',
                    'shadow-[0_0_50px_rgba(16,185,129,0.1),inset_0_0_60px_rgba(0,0,0,0.45)]',
                    'backdrop-blur-md transform-gpu will-change-transform',
                    isRunning && 'shadow-[0_0_80px_rgba(16,185,129,0.28)]',
                  )}
                  animate={
                    isRunning
                      ? { scale: [1, 1.015, 1] }
                      : undefined
                  }
                  transition={
                    isRunning
                      ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                      : undefined
                  }
                >
                  <div
                    className='pointer-events-none absolute inset-4 rounded-full border border-emerald-500/10'
                    aria-hidden
                  />
                  <div
                    className='pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.06),transparent_45%)]'
                    aria-hidden
                  />

                  <SynthesisCoreVisual phase={phase} progress={synthesisProgress} />

                  {phase === 'result' && result?.isMegaBonus && (
                    <motion.div
                      className='pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.2),transparent_65%)]'
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <p className='mt-4 text-center text-xs uppercase tracking-[0.25em] text-emerald-500/70'>
                  Синтезатор бонусов
                </p>
              </div>

              <SynthesisTube phase={phase} progress={synthesisProgress} />

              <AnimatePresence mode='wait'>
                {phase === 'result' && result ? (
                  <ResultHud key='result' result={result} />
                ) : null}
              </AnimatePresence>

              {error && (
                <div className='w-full max-w-sm rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300'>
                  {error}
                </div>
              )}

              <LaunchButton
                canRun={canRun}
                isRunning={isRunning}
                onClick={() => void handleRun()}
              />

              {balance < GENERATOR_COST && phase !== 'running' && (
                <p className='text-center text-xs text-zinc-600'>
                  Нужно минимум {GENERATOR_COST} бонусов для запуска
                </p>
              )}
            </section>

            {/* Правая колонка — инфо-хад */}
            <aside className='lg:col-span-1'>
              <div className='sticky top-6 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md sm:p-6'>
                <div className='space-y-4'>
                  <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-4'>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600'>
                      Доступно бонусов
                    </p>
                    <p className='mt-1 font-mono text-3xl font-bold text-amber-400'>
                      <NumberTicker value={balance} durationMs={800} />
                    </p>
                  </div>

                  <div className='rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4'>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600'>
                      Стоимость запуска
                    </p>
                    <p className='mt-1 text-2xl font-bold text-zinc-100'>
                      {GENERATOR_COST}
                      <span className='ml-1.5 text-sm font-medium text-zinc-500'>
                        бонусов
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className='text-sm font-bold uppercase tracking-widest text-zinc-300'>
                    Программа лояльности
                  </h2>
                  <p className='mt-1 text-xs text-zinc-600'>
                    Вероятности вознаграждения за один запуск синтеза
                  </p>

                  <div className='mt-4 space-y-2'>
                    {GENERATOR_REWARD_TIERS.map((tier) => (
                      <LoyaltyTierCard
                        key={`${tier.probabilityPercent}-${tier.reward}`}
                        probabilityPercent={tier.probabilityPercent}
                        rewardDescription={tier.rewardDescription}
                        isMega={tier.isMega}
                        isHighlighted={flashReward === tier.reward}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <GameLeaderboard
                entries={leaderboardEntries}
                isLoading={leaderboardLoading}
                meta={leaderboardMeta}
              />
            </aside>
          </div>
        </div>
      </main>
      </GamesFullscreenScrollShell>

      <BonusGeneratorCelebrate result={result} celebrateKey={celebrateKey} />
    </div>
  );
}
