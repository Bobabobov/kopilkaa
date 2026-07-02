'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ClipboardList, Loader2, RefreshCw } from 'lucide-react';
import type { DailyQuestView } from '@/lib/games/quests';
import { cn } from '@/lib/utils';
import { useLobbyMotionProfile } from './effects/useLobbyMotionProfile';

interface DailyQuestsApiResponse {
  success: boolean;
  data:
    | {
        quests: DailyQuestView[];
        rerollsRemaining: number;
      }
    | DailyQuestView[];
}

export function GamesDailyQuestsWidget() {
  const { heavyBlur } = useLobbyMotionProfile();
  const [quests, setQuests] = useState<DailyQuestView[]>([]);
  const [rerollsRemaining, setRerollsRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [rerollingQuestId, setRerollingQuestId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuests() {
      try {
        const response = await fetch('/api/games/daily-quests', {
          cache: 'no-store',
        });
        const raw = (await response.json().catch(() => null)) as DailyQuestsApiResponse | null;

        if (!cancelled && raw?.data) {
          if (Array.isArray(raw.data)) {
            setQuests(raw.data);
            setRerollsRemaining(0);
          } else {
            setQuests(raw.data.quests);
            setRerollsRemaining(raw.data.rerollsRemaining);
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadQuests();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReroll = async (questId: number): Promise<void> => {
    if (rerollsRemaining <= 0 || rerollingQuestId !== null) return;

    setRerollingQuestId(questId);
    setError(null);
    try {
      const response = await fetch('/api/games/daily-quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
        cache: 'no-store',
      });
      const raw = (await response.json().catch(() => null)) as
        | (DailyQuestsApiResponse & { error?: string })
        | null;
      if (!response.ok) {
        setError(raw?.error ?? 'Не удалось заменить задание');
        return;
      }
      const refreshResponse = await fetch('/api/games/daily-quests', {
        cache: 'no-store',
      });
      const refreshed = (await refreshResponse.json().catch(() => null)) as DailyQuestsApiResponse | null;
      if (!refreshResponse.ok || !refreshed?.data || Array.isArray(refreshed.data)) {
        setError('Задание заменено, но список не обновился. Обновите страницу.');
        return;
      }
      setQuests(refreshed.data.quests);
      setRerollsRemaining(refreshed.data.rerollsRemaining);
    } finally {
      setRerollingQuestId(null);
    }
  };

  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';
  const completedCount = quests.filter((quest) => quest.done).length;

  return (
    <motion.section
      aria-label='Ежедневные квесты'
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className='h-full'
    >
      <div
        className={cn(
          'h-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-zinc-900/80',
          'shadow-[0_0_20px_rgba(16,185,129,0.08)]',
          glassBlur,
        )}
      >
        <div className='flex h-full flex-col px-4 py-3 sm:p-5 md:p-6'>
          <div className='mb-4 flex items-start gap-3'>
            <span
              className='flex h-11 w-11 shrink-0 transform-gpu items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.2)] will-change-transform sm:h-12 sm:w-12'
              aria-hidden
            >
              <ClipboardList className='h-5 w-5' />
            </span>
            <div className='min-w-0'>
              <p className='font-mono text-[10px] uppercase tracking-widest text-orange-400/80 sm:text-xs'>
                Ежедневные контракты
              </p>
              <p className='mt-1 font-mono text-sm text-zinc-400'>
                {isLoading ? (
                  'Загрузка…'
                ) : (
                  <>
                    <span className='font-bold text-emerald-400'>{completedCount}</span>
                    <span className='text-zinc-600'> / </span>
                    <span>{quests.length || 3}</span>
                    <span className='text-zinc-500'> закрыто</span>
                  </>
                )}
              </p>
              {!isLoading ? (
                <p className='mt-1 font-mono text-[11px] text-zinc-500'>
                  Замена заданий: {rerollsRemaining}/{1}
                </p>
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <div className='flex flex-1 items-center justify-center py-8'>
              <Loader2 className='h-6 w-6 animate-spin text-emerald-500/60' />
            </div>
          ) : (
            <div className='flex flex-1 flex-col gap-2.5'>
              {error ? (
                <p className='rounded-lg border border-red-400/35 bg-red-500/10 px-3 py-2 text-xs text-red-300'>
                  {error}
                </p>
              ) : null}
              <ul className='flex flex-1 flex-col gap-2.5'>
              {quests.map((quest) => {
                const progressPercent = Math.round(
                  (quest.progress / quest.target) * 100,
                );

                return (
                  <li
                    key={quest.id}
                    className={cn(
                      'transform-gpu rounded-xl border px-3 py-2.5 will-change-transform sm:px-4 sm:py-3',
                      quest.done
                        ? 'border-emerald-500/25 bg-emerald-500/5'
                        : 'border-zinc-800/80 bg-zinc-950/40',
                    )}
                  >
                    <div className='flex items-start gap-3'>
                      <span
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                          quest.done
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]'
                            : 'border-zinc-700 bg-zinc-900/80',
                        )}
                        aria-hidden
                      >
                        {quest.done ? <Check className='h-3.5 w-3.5' /> : null}
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p
                          className={cn(
                            'text-sm leading-snug',
                            quest.done ? 'text-zinc-300' : 'text-zinc-400',
                          )}
                        >
                          {quest.title}
                        </p>
                        <div className='mt-2 flex flex-wrap items-center gap-2'>
                          <span className='font-mono text-[10px] text-zinc-500'>
                            {quest.progress}/{quest.target}
                          </span>
                          <span className='font-mono text-[10px] text-orange-400/90'>
                            +{quest.reward} бонусов
                          </span>
                          {!quest.done ? (
                            <button
                              type='button'
                              disabled={rerollsRemaining <= 0 || rerollingQuestId !== null}
                              onClick={() => void handleReroll(quest.id)}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] transition-colors',
                                rerollsRemaining > 0 && rerollingQuestId === null
                                  ? 'border-amber-500/35 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                                  : 'cursor-not-allowed border-zinc-700 bg-zinc-800/50 text-zinc-600',
                              )}
                            >
                              {rerollingQuestId === quest.id ? (
                                <Loader2 className='h-3 w-3 animate-spin' />
                              ) : (
                                <RefreshCw className='h-3 w-3' />
                              )}
                              заменить
                            </button>
                          ) : null}
                        </div>
                        <div className='mt-2 h-1 overflow-hidden rounded-full bg-zinc-800/80'>
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              quest.done
                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                : 'bg-emerald-500/50',
                            )}
                            style={{ width: `${Math.min(100, progressPercent)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
