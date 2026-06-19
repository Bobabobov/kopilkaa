'use client';

import { formatGraveDate } from '@/lib/vyzhivanie/graveyard';
import { formatRub } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TontineStatusResponse } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

function getDaysInRound(joinedAt: string, eliminatedAt: string): number {
  return Math.max(
    1,
    Math.floor(
      (Date.parse(eliminatedAt) - Date.parse(joinedAt)) / DAY_MS,
    ) + 1,
  );
}

function pickKeeperLine(data: TontineStatusResponse): string {
  const { user } = data;
  if (!user.joined || user.status !== 'ELIMINATED') {
    return 'Вы выбыли. Могила уже на карте.';
  }

  return `${user.displayName}, ну чего, ты пытался, но сам упустил свой шанс. Никто не виноват, кроме тебя.`;
}

type Props = {
  data: TontineStatusResponse;
  className?: string;
};

export function VyzhivanieEliminatedRecord({ data, className }: Props) {
  const { user } = data;
  if (!user.joined || user.status !== 'ELIMINATED') return null;

  const daysInRound =
    user.eliminatedAt != null
      ? getDaysInRound(user.joinedAt, user.eliminatedAt)
      : user.checkInStreak;

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-red-500/40 bg-[linear-gradient(180deg,rgba(15,3,8,0.96),rgba(2,6,23,0.92))] px-3 py-3 font-mono shadow-[inset_0_0_0_1px_rgba(244,114,182,0.08),0_0_28px_rgba(127,29,29,0.22)] sm:px-4 sm:py-4',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500/80 via-fuchsia-500/40 to-transparent" />

      <p className="text-[8px] uppercase tracking-[0.28em] text-red-300/85 sm:text-[9px]">
        цифровой след
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8] sm:text-xs">
        Раунд идёт дальше. Ваша кнопка больше не работает.
      </p>

      <div className="mt-3 grid gap-2 border border-[#1f2937] bg-black/50 p-2.5 text-[10px] sm:grid-cols-2 sm:gap-px sm:p-0 sm:text-[11px]">
        <div className="border-b border-[#1f2937] px-2 py-2 sm:border-b-0 sm:border-r sm:py-3">
          <p className="text-[8px] uppercase tracking-[0.2em] text-cyan-300/80">
            вошёл
          </p>
          <p className="mt-1 leading-snug text-[#e2e8f0]">
            {formatGraveDate(user.joinedAt)}
          </p>
        </div>
        <div className="px-2 py-2 sm:py-3">
          <p className="text-[8px] uppercase tracking-[0.2em] text-red-300/85">
            выбыл
          </p>
          <p className="mt-1 leading-snug text-[#fecaca]">
            {formatGraveDate(user.eliminatedAt)}
          </p>
        </div>
        <div className="border-t border-[#1f2937] px-2 py-2 sm:border-r sm:py-3">
          <p className="text-[8px] uppercase tracking-[0.2em] text-[#94a3b8]">
            в раунде
          </p>
          <p className="mt-1 text-[#cbd5e1]">
            {daysInRound} {daysInRound === 1 ? 'день' : daysInRound < 5 ? 'дня' : 'дней'}
          </p>
        </div>
        <div className="border-t border-[#1f2937] px-2 py-2 sm:py-3">
          <p className="text-[8px] uppercase tracking-[0.2em] text-[#94a3b8]">
            банк уплыл
          </p>
          <p className="mt-1 font-black text-[#fbbf24]/75 line-through decoration-red-400/80">
            {formatRub(data.prizeRub)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function getEliminatedKeeperLine(data: TontineStatusResponse): string {
  return pickKeeperLine(data);
}
