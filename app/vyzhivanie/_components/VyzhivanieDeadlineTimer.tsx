'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TontineStatusResponse } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

type TimerState =
  | { kind: 'hidden' }
  | {
      kind: 'required';
      title: string;
      targetMs: number;
    }
  | {
      kind: 'done';
      title: string;
      targetMs: number;
    }
  | {
      kind: 'finished';
      title: string;
      text: string;
    };

type Props = {
  data: TontineStatusResponse;
  compact?: boolean;
  className?: string;
};

function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

function getUtcDayStartMs(ms: number): number {
  const date = new Date(ms);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getNextUtcMidnightMs(ms: number): number {
  return getUtcDayStartMs(ms) + DAY_MS;
}

function getTimeBarState(
  targetLeft: number,
  isRequired: boolean,
): {
  percent: number;
  colorClassName: string;
  glowClassName: string;
  urgent: boolean;
} {
  const percent = Math.max(0, Math.min(100, (targetLeft / DAY_MS) * 100));

  if (!isRequired) {
    return {
      percent,
      colorClassName: 'bg-emerald-400',
      glowClassName: 'shadow-[0_0_14px_rgba(52,211,153,0.55)]',
      urgent: false,
    };
  }

  if (percent > 50) {
    return {
      percent,
      colorClassName: 'bg-emerald-400',
      glowClassName: 'shadow-[0_0_14px_rgba(52,211,153,0.55)]',
      urgent: false,
    };
  }

  if (percent > 25) {
    return {
      percent,
      colorClassName: 'bg-yellow-300',
      glowClassName: 'shadow-[0_0_14px_rgba(253,224,71,0.55)]',
      urgent: false,
    };
  }

  if (percent > 10) {
    return {
      percent,
      colorClassName: 'bg-orange-400',
      glowClassName: 'shadow-[0_0_16px_rgba(251,146,60,0.62)]',
      urgent: false,
    };
  }

  return {
    percent,
    colorClassName: 'bg-red-500',
    glowClassName: 'shadow-[0_0_20px_rgba(239,68,68,0.75)]',
    urgent: true,
  };
}

function buildTimerState(
  data: TontineStatusResponse,
  nowMs: number,
): TimerState {
  const { user } = data;

  if (!data.isAuthenticated || !user.joined) {
    return { kind: 'hidden' };
  }

  if (user.status === 'ELIMINATED') {
    return {
      kind: 'finished',
      title: 'Запись закрыта',
      text: 'Раунд идёт дальше, но ваша кнопка уже молчит.',
    };
  }

  if (user.status === 'WINNER') {
    return {
      kind: 'finished',
      title: 'Последний живой',
      text: 'Вы пережили всех. Смотритель недоволен, банк доволен.',
    };
  }

  const nextDayMs = getNextUtcMidnightMs(nowMs);

  if (user.canCheckInToday) {
    return {
      kind: 'required',
      title: 'Кнопка ждёт',
      targetMs: nextDayMs,
    };
  }

  return {
    kind: 'done',
    title: 'Сегодня зачтено',
    targetMs: nextDayMs,
  };
}

function getTimerText(isRequired: boolean, compact: boolean): string {
  if (isRequired) {
    return compact
      ? 'Нажмите сегодня. Потом будет поздно.'
      : 'Нажмите «Остаться живым» сегодня. Смотритель уже готовит запись на карте.';
  }

  return compact
    ? 'На сегодня всё. До завтра живёте.'
    : 'На сегодня вы отбились. Новая кнопка появится после ночного сброса.';
}

export function VyzhivanieDeadlineTimer({
  data,
  compact = false,
  className,
}: Props) {
  const serverBaseMsRef = useRef(Date.parse(data.serverNow));
  const clientBaseMsRef = useRef(Date.now());
  const [nowMs, setNowMs] = useState(serverBaseMsRef.current);

  useEffect(() => {
    serverBaseMsRef.current = Date.parse(data.serverNow);
    clientBaseMsRef.current = Date.now();
    setNowMs(serverBaseMsRef.current);

    const id = window.setInterval(() => {
      setNowMs(serverBaseMsRef.current + Date.now() - clientBaseMsRef.current);
    }, 1000);

    return () => window.clearInterval(id);
  }, [data.serverNow]);

  const timer = useMemo(() => buildTimerState(data, nowMs), [data, nowMs]);

  if (timer.kind === 'hidden') return null;

  if (timer.kind === 'finished') {
    return (
      <div
        className={cn(
          'relative overflow-hidden border border-red-500/35 bg-[linear-gradient(135deg,rgba(127,29,29,0.18),rgba(2,6,23,0.86))] px-3 py-3 font-mono shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_0_22px_rgba(127,29,29,0.14)]',
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/70 to-transparent" />
        <p className="text-[9px] uppercase tracking-[0.22em] text-red-300/80">
          {timer.title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#d1d5db]">
          {timer.text}
        </p>
      </div>
    );
  }

  const isRequired = timer.kind === 'required';
  const targetLeft = timer.targetMs - nowMs;
  const timeBar = getTimeBarState(targetLeft, isRequired);

  return (
    <div
      className={cn(
        'relative overflow-hidden border bg-[linear-gradient(135deg,rgba(2,6,23,0.94),rgba(7,12,20,0.86))] px-3 py-3 font-mono shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_0_24px_rgba(0,0,0,0.24)]',
        isRequired
          ? 'border-[#f97316]/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_0_24px_rgba(249,115,22,0.10)]'
          : 'border-emerald-500/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_0_24px_rgba(16,185,129,0.10)]',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 w-1',
          isRequired ? 'bg-[#f97316]' : 'bg-emerald-400',
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              'text-[9px] uppercase tracking-[0.22em]',
              isRequired ? 'text-[#fdba74]' : 'text-emerald-300',
            )}
          >
            {timer.title}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#cbd5e1]">
            {getTimerText(isRequired, compact)}
          </p>
        </div>

        <p
          className={cn(
            'shrink-0 font-black tabular-nums [text-shadow:0_0_14px_currentColor]',
            compact ? 'text-sm' : 'text-lg',
            isRequired ? 'text-[#fb923c]' : 'text-emerald-300',
          )}
        >
          {formatDuration(targetLeft)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[8px] uppercase tracking-[0.18em] text-[#64748b]">
        <span>{isRequired ? 'время до вылета' : 'до новой кнопки'}</span>
        <span>{Math.round(timeBar.percent)}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden border border-[#1f2937] bg-[#020617] shadow-[inset_0_0_12px_rgba(0,0,0,0.7)]">
        <div
          className={cn(
            'h-full transition-all duration-1000',
            timeBar.colorClassName,
            timeBar.glowClassName,
            timeBar.urgent ? 'animate-pulse' : '',
          )}
          style={{ width: `${timeBar.percent}%` }}
        />
      </div>
    </div>
  );
}
