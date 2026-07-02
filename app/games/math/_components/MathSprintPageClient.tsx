'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DAILY_ATTEMPT_LIMIT,
  MATH_SPRINT_DIFFICULTIES,
  TIME_LIMIT_MS,
  type MathSprintAnswerResult,
  type MathSprintDifficulty,
} from '@/lib/games/shared/mathSprint';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import { NumberTicker } from '@/app/games/_components/effects/NumberTicker';
import { GamePurchaseAttemptButton } from '@/app/games/_components/GamePurchaseAttemptButton';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { useGameAttemptPurchase } from '@/hooks/games/useGameAttemptPurchase';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';
import { MathSprintDifficultyPicker, MathSprintDifficultyBadge } from './MathSprintDifficultyPicker';
import { MathSprintPlayingStage } from './MathSprintPlayingStage';
import { MathSprintResultPanel } from './MathSprintResultPanel';
import { useFeedbackMeaningfulOnResult } from '@/hooks/feedback/useFeedbackMeaningfulOnResult';

type MathSprintPhase = 'idle' | 'playing' | 'result';

interface AnswerFeedback {
  value: number;
  isCorrect: boolean;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

interface StartApiResponse {
  success: boolean;
  data: {
    difficulty: MathSprintDifficulty;
    questionText: string;
    options: number[];
    timeLimitMs: number;
    balanceAfter: number;
    serverStartTime: number;
    dailyAttemptsUsed: number;
    dailyAttemptsLeft: number;
    purchasedAttemptsAvailable: number;
  };
}

interface AnswerApiResponse {
  success: boolean;
  data: MathSprintAnswerResult;
}

interface MathSprintPageClientProps {
  initialBalance: number;
  initialDailyAttemptsUsed: number;
  initialPurchasedAttemptsAvailable: number;
  initialDailyAttemptPurchasesUsed: number;
}

type BriefingIconName = 'Clock' | 'Zap' | 'Target';

const BRIEFING_ICON_MAP = {
  Clock: LucideIcons.Clock,
  Zap: LucideIcons.Zap,
  Target: LucideIcons.Target,
} as const;

const BRIEFING_ITEMS: Array<{
  icon: BriefingIconName;
  text: string;
  iconClass: string;
}> = [
  {
    icon: 'Clock',
    text: '2 секунды на ответ — таймер на сервере',
    iconClass: 'text-emerald-400',
  },
  {
    icon: 'Zap',
    text: 'Ошибка или таймаут = проигрыш, вход списан',
    iconClass: 'text-amber-400',
  },
  {
    icon: 'Target',
    text: 'Уникальный пример при каждом запуске',
    iconClass: 'text-teal-400',
  },
];

export default function MathSprintPageClient({
  initialBalance,
  initialDailyAttemptsUsed,
  initialPurchasedAttemptsAvailable,
  initialDailyAttemptPurchasesUsed,
}: MathSprintPageClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [dailyAttemptsUsed, setDailyAttemptsUsed] = useState(
    initialDailyAttemptsUsed,
  );
  const [phase, setPhase] = useState<MathSprintPhase>('idle');
  useFeedbackMeaningfulOnResult(phase === 'result');
  const [difficulty, setDifficulty] = useState<MathSprintDifficulty>('medium');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<number[]>([]);
  const [timeLeftMs, setTimeLeftMs] = useState(TIME_LIMIT_MS);
  const [result, setResult] = useState<MathSprintAnswerResult | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerFrameRef = useRef<number | null>(null);
  const serverStartTimeRef = useRef<number | null>(null);
  const timerStartRef = useRef<number | null>(null);
  const readyBootstrappedRef = useRef(false);
  const hasTimedOutRef = useRef(false);

  const activeConfig = MATH_SPRINT_DIFFICULTIES[difficulty];
  const dailyAttemptsLeft = Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed);

  const {
    purchasedAttemptsAvailable,
    setPurchasedAttemptsAvailable,
    isPurchasing,
    canAffordPurchase,
    canPurchaseAttempt,
    hasAttemptSlot,
    handlePurchaseAttempt,
    extraAttemptCost,
    dailyAttemptPurchasesRemaining,
  } = useGameAttemptPurchase({
    purchaseUrl: '/api/games/math/purchase-attempt',
    initialPurchasedAttemptsAvailable,
    initialDailyAttemptPurchasesUsed,
    dailyAttemptsLeft,
    balance,
    phase,
    isSubmitting,
    difficulty,
    onError: setError,
    onBalanceChange: setBalance,
  });

  const canAfford = balance >= activeConfig.cost;
  const canStart =
    canAfford && phase === 'idle' && !isSubmitting && !isPurchasing && hasAttemptSlot;
  const settingsLocked = phase !== 'idle';

  const stopTimer = useCallback(() => {
    if (timerFrameRef.current !== null) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }
  }, []);

  const finishWithTimeout = useCallback(async () => {
    if (hasTimedOutRef.current || isSubmitting) {
      return;
    }

    hasTimedOutRef.current = true;
    stopTimer();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/games/math/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ selectedAnswer: -1 }),
      });

      const raw = await response.json().catch(() => null);
      const payload = raw as AnswerApiResponse | null;

      if (payload?.data) {
        setResult(payload.data);
      } else {
        setResult({
          won: false,
          reason: 'timeout',
          reactionMs: TIME_LIMIT_MS + 1,
          reward: 0,
          balanceAfter: null,
          difficulty,
        });
      }

      setPhase('result');
    } catch {
      setResult({
        won: false,
        reason: 'timeout',
        reactionMs: TIME_LIMIT_MS + 1,
        reward: 0,
        balanceAfter: null,
        difficulty,
      });
      setPhase('result');
    } finally {
      setIsSubmitting(false);
    }
  }, [difficulty, isSubmitting, stopTimer]);

  const startTimer = useCallback(
    (serverStartTime: number) => {
      serverStartTimeRef.current = serverStartTime;
      timerStartRef.current = performance.now();
      hasTimedOutRef.current = false;

      const tick = () => {
        if (timerStartRef.current === null || serverStartTimeRef.current === null) {
          return;
        }

        const serverElapsed = Date.now() - serverStartTimeRef.current;
        const remaining = Math.max(0, TIME_LIMIT_MS - serverElapsed);
        setTimeLeftMs(remaining);

        if (remaining <= 0 || serverElapsed > TIME_LIMIT_MS) {
          void finishWithTimeout();
          return;
        }

        timerFrameRef.current = requestAnimationFrame(tick);
      };

      timerFrameRef.current = requestAnimationFrame(tick);
    },
    [finishWithTimeout],
  );

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  useLayoutEffect(() => {
    if (phase !== 'playing' || !questionText || readyBootstrappedRef.current) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch('/api/games/math/ready', {
          method: 'POST',
          cache: 'no-store',
        });
        const raw = await response.json().catch(() => null);

        if (cancelled) {
          return;
        }

        if (response.ok && raw?.data?.serverStartTime) {
          readyBootstrappedRef.current = true;
          startTimer(raw.data.serverStartTime);
          return;
        }
      } catch {
        // fallback ниже
      }

      if (!cancelled) {
        readyBootstrappedRef.current = true;
        startTimer(Date.now());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phase, questionText, startTimer]);

  const handleStart = useCallback(async () => {
    if (!canStart) {
      return;
    }

    setError(null);
    setResult(null);
    readyBootstrappedRef.current = false;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/games/math/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ difficulty }),
      });

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось запустить математический спринт'),
        );
      }

      const payload = raw as StartApiResponse;
      setQuestionText(payload.data.questionText);
      setOptions(payload.data.options);
      setBalance(payload.data.balanceAfter);
      setDailyAttemptsUsed(payload.data.dailyAttemptsUsed);
      setPurchasedAttemptsAvailable(payload.data.purchasedAttemptsAvailable);
      setTimeLeftMs(TIME_LIMIT_MS);
      setPhase('playing');
    } catch (startError) {
      setPhase('idle');
      setError(
        startError instanceof Error
          ? startError.message
          : 'Не удалось запустить математический спринт',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [canStart, difficulty]);

  const handleAnswer = useCallback(
    async (selectedAnswer: number) => {
      if (phase !== 'playing' || isSubmitting || hasTimedOutRef.current) {
        return;
      }

      stopTimer();
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/games/math/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ selectedAnswer }),
        });

        const raw = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getMessageFromApiJson(raw, 'Не удалось отправить ответ'),
          );
        }

        const payload = raw as AnswerApiResponse;
        setAnswerFeedback({ value: selectedAnswer, isCorrect: payload.data.won });
        await wait(320);
        setAnswerFeedback(null);
        setResult(payload.data);

        if (payload.data.balanceAfter !== null) {
          setBalance(payload.data.balanceAfter);
        }

        setPhase('result');
        invalidateProfileCache();
      } catch (answerError) {
        setError(
          answerError instanceof Error
            ? answerError.message
            : 'Не удалось отправить ответ',
        );
        setPhase('idle');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, phase, stopTimer],
  );

  const handlePlayAgain = useCallback(() => {
    stopTimer();
    timerStartRef.current = null;
    serverStartTimeRef.current = null;
    hasTimedOutRef.current = false;
    readyBootstrappedRef.current = false;
    setQuestionText('');
    setOptions([]);
    setResult(null);
    setAnswerFeedback(null);
    setTimeLeftMs(TIME_LIMIT_MS);
    setError(null);
    setPhase('idle');
  }, [stopTimer]);

  return (
    <div className='games-lobby-scrollbar relative flex h-full min-h-0 w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-zinc-950'>
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:48px_48px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14)_0%,transparent_70%)]'
        aria-hidden
      />

      <main className='relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <header className='mb-6 sm:mb-8'>
          <Link
            href='/games'
            className='inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-400'
          >
            <LucideIcons.ArrowLeft size='sm' />
            ../games
          </Link>

          <div className='mt-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 font-mono text-xs text-emerald-400'>
              MS
            </div>
            <div>
              <h1 className='font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl'>
                Математический Спринт
              </h1>
              <p className='mt-0.5 font-mono text-xs text-zinc-500'>
                compute_core v2.0 · reaction_protocol
              </p>
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6'>
          {/* Левая колонка — вычислительное ядро */}
          <section className='lg:col-span-2'>
            <div className='flex min-h-[350px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8'>
              <div className='mb-4 flex items-center justify-between border-b border-zinc-800/80 pb-3'>
                <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600'>
                  {phase === 'idle' && 'status: standby'}
                  {phase === 'playing' && 'status: computing'}
                  {phase === 'result' && 'status: complete'}
                </span>
                <div className='flex items-center gap-2'>
                  {(phase === 'idle' || phase === 'playing') && (
                    <MathSprintDifficultyBadge difficulty={difficulty} />
                  )}
                  <span className='flex items-center gap-1.5 font-mono text-[10px] text-zinc-600'>
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      phase === 'playing'
                        ? 'animate-pulse bg-emerald-400 shadow-[0_0_6px_#10b981]'
                        : 'bg-zinc-700',
                    )}
                  />
                  {phase === 'playing' ? 'live' : 'idle'}
                  </span>
                </div>
              </div>

              <AnimatePresence mode='wait'>
                {phase === 'idle' && (
                  <motion.div
                    key='idle'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className='flex flex-1 flex-col justify-between gap-8 transform-gpu will-change-transform'
                  >
                    <div className='space-y-4'>
                      <p className='font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-500/80'>
                        // mission_brief
                      </p>
                      <ul className='space-y-3'>
                        {BRIEFING_ITEMS.map((item) => {
                          const Icon = BRIEFING_ICON_MAP[item.icon];

                          return (
                            <li
                              key={item.text}
                              className='flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5'
                            >
                              <span
                                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80'
                                aria-hidden
                              >
                                <Icon size='sm' className={item.iconClass} />
                              </span>
                              <span className='text-sm leading-snug text-zinc-400'>
                                {item.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className='flex flex-col items-center gap-3'>
                      {!canAfford && (
                        <p className='font-mono text-xs text-orange-400'>
                          Недостаточно бонусов (нужно {activeConfig.cost})
                        </p>
                      )}
                      {dailyAttemptsLeft <= 0 && purchasedAttemptsAvailable <= 0 && (
                        <p className='font-mono text-xs text-orange-400'>
                          Суточный лимит исчерпан — купите доп. попытку за{' '}
                          {extraAttemptCost} бонусов
                        </p>
                      )}

                      <motion.button
                        type='button'
                        disabled={!canStart}
                        onClick={() => void handleStart()}
                        whileTap={canStart ? { scale: 0.98 } : undefined}
                        className={cn(
                          'relative w-full max-w-md overflow-hidden rounded-xl',
                          'border-b-4 border-emerald-700 bg-gradient-to-b from-emerald-500 to-emerald-600',
                          'px-6 py-4 font-mono text-base font-bold tracking-wide text-white',
                          'transform-gpu will-change-transform',
                          'active:translate-y-[4px] active:border-b-0',
                          'disabled:cursor-not-allowed disabled:opacity-40',
                        )}
                      >
                        <span
                          className='games-lobby-shimmer-beam transform-gpu'
                          aria-hidden
                        />
                        <span className='relative z-10 flex items-center justify-center gap-2'>
                          <LucideIcons.Zap size='sm' />
                          Запустить спринт
                        </span>
                      </motion.button>

                      <GamePurchaseAttemptButton
                        visible={dailyAttemptsLeft <= 0}
                        disabled={!canPurchaseAttempt}
                        isPurchasing={isPurchasing}
                        canAffordPurchase={canAffordPurchase}
                        extraAttemptCost={extraAttemptCost}
                        purchasedAttemptsAvailable={purchasedAttemptsAvailable}
                        dailyAttemptPurchasesRemaining={
                          dailyAttemptPurchasesRemaining
                        }
                        onPurchase={() => void handlePurchaseAttempt()}
                      />

                      <p className='max-w-md text-center text-xs text-zinc-500'>
                        Время ответа рассчитывается на сервере. Играйте при
                        стабильном интернет-соединении.
                      </p>
                    </div>
                  </motion.div>
                )}

                {phase === 'playing' && (
                  <motion.div
                    key='playing'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col transform-gpu will-change-transform'
                  >
                    <MathSprintPlayingStage
                      difficulty={difficulty}
                      questionText={questionText}
                      options={options}
                      timeLeftMs={timeLeftMs}
                      isSubmitting={isSubmitting}
                      answerFeedback={answerFeedback}
                      onAnswer={(value) => void handleAnswer(value)}
                    />
                  </motion.div>
                )}

                {phase === 'result' && result && (
                  <motion.div
                    key='result'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col transform-gpu will-change-transform'
                  >
                    <MathSprintResultPanel
                      result={result}
                      balance={balance}
                      onPlayAgain={handlePlayAgain}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className='mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-300'>
                  {error}
                </div>
              )}
            </div>
          </section>

          {/* Правая колонка — панель управления */}
          <aside className='lg:col-span-1'>
            <div className='space-y-6 rounded-2xl border border-emerald-500/10 bg-zinc-900/40 p-6 backdrop-blur-md'>
              <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600'>
                // control_panel
              </p>

              <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
                <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                    Доступно бонусов
                  </p>
                  <p className='mt-1 font-mono text-2xl font-bold text-emerald-400'>
                    <NumberTicker value={balance} durationMs={800} />
                  </p>
                </div>

                <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                    Стоимость запуска
                  </p>
                  <p className='mt-1 font-mono text-2xl font-bold text-zinc-100'>
                    {activeConfig.cost}
                    <span className='ml-1 text-sm font-normal text-zinc-500'>
                      бон.
                    </span>
                  </p>
                </div>
              </div>

              <MathSprintDifficultyPicker
                difficulty={difficulty}
                onChange={setDifficulty}
                disabled={settingsLocked}
              />

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Суточный лимит
                </p>
                <p className='mt-1.5 font-mono text-sm text-zinc-400'>
                  Осталось попыток:{' '}
                  <span
                    className={cn(
                      'text-lg font-bold',
                      dailyAttemptsLeft <= 2
                        ? 'text-orange-400'
                        : 'text-emerald-400',
                    )}
                  >
                    {dailyAttemptsLeft}
                  </span>{' '}
                  из {DAILY_ATTEMPT_LIMIT}
                </p>
                <div className='mt-2 h-1 overflow-hidden rounded-full bg-zinc-800'>
                  <motion.div
                    className='h-full transform-gpu rounded-full bg-emerald-500/70 will-change-transform'
                    animate={{
                      width: `${(dailyAttemptsLeft / DAILY_ATTEMPT_LIMIT) * 100}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  />
                </div>

                {purchasedAttemptsAvailable > 0 && (
                  <p className='mt-2 font-mono text-xs text-zinc-500'>
                    Доп. попыток в резерве:{' '}
                    <span className='font-bold text-teal-400'>
                      {purchasedAttemptsAvailable}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
