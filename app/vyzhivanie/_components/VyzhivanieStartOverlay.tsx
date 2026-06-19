'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRub } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TontineStatusResponse } from '../types';
import {
  getEliminatedKeeperLine,
  VyzhivanieEliminatedRecord,
} from './VyzhivanieEliminatedOverlay';
import { VyzhivanieDeadlineTimer } from './VyzhivanieDeadlineTimer';

type Props = {
  data: TontineStatusResponse;
  loading: boolean;
  onJoin: () => void;
  onCheckIn: () => void;
  onClose: () => void;
  onFocusMyGrave?: () => void;
  initialRulesOpen?: boolean;
};

function getStatusText(data: TontineStatusResponse): string | null {
  const { user } = data;

  if (!data.isAuthenticated) {
    return 'Войдите в аккаунт, если хотите участвовать.';
  }

  if (!user.joined) {
    return 'Вы пока не в раунде. Можно просто смотреть, а можно рискнуть.';
  }

  if (user.status === 'ELIMINATED') {
    return 'Вы выбыли. Ваша могила теперь на карте.';
  }

  if (user.status === 'WINNER') {
    return 'Вы победили. Остальные забыли нажать кнопку.';
  }

  if (user.canCheckInToday) {
    return 'Сегодня кнопку ещё не нажимали. Я бы не откладывал.';
  }

  return null;
}

export function VyzhivanieStartOverlay({
  data,
  loading,
  onJoin,
  onCheckIn,
  onClose,
  onFocusMyGrave,
  initialRulesOpen = false,
}: Props) {
  const [rulesOpen, setRulesOpen] = useState(initialRulesOpen);
  const { user } = data;
  const isEliminated =
    data.isAuthenticated && user.joined && user.status === 'ELIMINATED';
  const canJoin = data.isAuthenticated && !user.joined;
  const canCheckIn =
    user.joined && user.status === 'ALIVE' && user.canCheckInToday;
  const statusText = isEliminated ? null : getStatusText(data);
  const keeperLine = isEliminated ? getEliminatedKeeperLine(data) : null;

  useEffect(() => {
    setRulesOpen(initialRulesOpen);
  }, [initialRulesOpen]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-black/80 p-2 font-mono backdrop-blur-md sm:p-4">
      <div
        className={cn(
          'vyzhivanie-glitch-panel relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-sm border bg-[#020202]/98 text-[#e5e7eb]',
          isEliminated
            ? 'border-red-950/80 shadow-[0_28px_110px_rgba(0,0,0,0.92),0_0_0_2px_rgba(40,0,0,0.95),0_0_64px_rgba(127,29,29,0.38),inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_60px_rgba(88,28,135,0.14)]'
            : 'border-[#5b6470] shadow-[0_28px_110px_rgba(0,0,0,0.88),0_0_0_2px_rgba(0,0,0,0.95),0_0_54px_rgba(127,29,29,0.26),inset_0_0_0_1px_rgba(255,255,255,0.09),inset_0_0_44px_rgba(127,29,29,0.12)]',
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,#ffffff_4px)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(90deg,#ef4444_1px,transparent_1px),linear-gradient(0deg,#22d3ee_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="pointer-events-none absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-red-400/60" />
        <div className="pointer-events-none absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-[#f9bc60]/60" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-[#22d3ee]/50" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-red-400/50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-pulse bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 animate-pulse rounded-full bg-red-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />
        {isEliminated ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/3 h-40 bg-gradient-to-b from-red-950/25 via-transparent to-transparent" />
        ) : null}

        <div
          className={cn(
            'relative border-b px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] sm:px-4 sm:py-2 sm:text-[9px] sm:tracking-[0.34em]',
            isEliminated
              ? 'border-red-950/70 bg-[linear-gradient(90deg,rgba(69,10,10,0.45),rgba(0,0,0,0.92),rgba(59,7,100,0.22))] text-red-200/70'
              : 'border-red-950/50 bg-[linear-gradient(90deg,rgba(127,29,29,0.20),rgba(0,0,0,0.88),rgba(30,41,59,0.18))] text-red-200/75',
          )}
        >
          <span className="vyzhivanie-glitch-text mr-3 text-emerald-300">
            {isEliminated ? 'Кладбище приняло вас' : 'кладбище открыто'}
          </span>
          <span className="hidden sm:inline">раунд #{data.roundNumber}</span>
          <span
            className={cn(
              'float-right hidden sm:inline',
              isEliminated ? 'text-red-200/60' : 'text-[#f9bc60]/80',
            )}
          >
            {isEliminated ? 'смотритель не забыл' : 'смотритель не спит'}
          </span>
        </div>

        <div className="vyzhivanie-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={cn(
              'relative px-4 py-4 text-center sm:px-5 sm:py-7',
              isEliminated
                ? 'bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.34),transparent_46%),radial-gradient(circle_at_bottom,rgba(88,28,135,0.14),transparent_52%)]'
                : 'bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.24),transparent_42%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.10),transparent_48%)]',
            )}
          >
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#9ca3af] sm:text-[10px] sm:tracking-[0.42em]">
              {isEliminated ? 'файл закрыт' : 'игра на выбывание'}
            </p>
            {isEliminated ? (
              <>
                <p className="mt-2 text-[10px] uppercase tracking-[0.34em] text-red-300/45 line-through decoration-red-500/50 sm:text-xs">
                  выживание
                </p>
                <h1 className="vyzhivanie-glitch-text mt-1 text-3xl font-black uppercase tracking-[0.14em] text-red-200 [text-shadow:0_0_28px_rgba(239,68,68,0.42),0_0_8px_rgba(244,114,182,0.35)] sm:text-5xl sm:tracking-[0.18em]">
                  Выбыл
                </h1>
                <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-[#cbd5e1] sm:text-xs">
                  Один пропущенный день — и всё. Минус{' '}
                  <span className="font-black text-[#fbbf24]">
                    {formatRub(data.prizeRub)}
                  </span>
                </p>
                <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 text-[8px] uppercase tracking-[0.16em] text-red-300/75 sm:mt-4 sm:text-[9px] sm:tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" />
                  <span>игра продолжается. вы — запись на карте</span>
                </div>
              </>
            ) : (
              <>
                <h1 className="vyzhivanie-glitch-text mt-2 text-3xl font-black uppercase tracking-[0.12em] text-white [text-shadow:0_0_22px_rgba(248,113,113,0.28)] sm:mt-3 sm:text-5xl sm:tracking-[0.16em]">
                  Выживание
                </h1>
                <p className="mx-auto mt-2 max-w-md text-[11px] leading-relaxed text-[#9ca3af] sm:text-xs">
                  Заходишь раз в день и жмёшь кнопку. Забыл — ну, место на карте
                  найдётся.
                </p>
                <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 text-[8px] uppercase tracking-[0.16em] text-red-300/80 sm:mt-4 sm:text-[9px] sm:tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-400" />
                  <span>один клик в день. смешно, пока сам не забудешь</span>
                </div>
              </>
            )}
          </div>

          <div className="relative grid grid-cols-2 border-y border-[#334155] bg-black/70 text-center text-[9px] uppercase sm:grid-cols-4 sm:text-xs">
            <div
              className={cn(
                'border-b border-r border-[#334155] p-2.5 sm:border-b-0 sm:p-4',
                isEliminated ? 'opacity-45' : 'transition-colors hover:bg-red-500/[0.05]',
              )}
            >
              <p
                className={cn(
                  'text-sm font-black sm:text-base',
                  isEliminated
                    ? 'text-[#fbbf24]/50 line-through decoration-red-400/60'
                    : 'text-[#facc15] [text-shadow:0_0_14px_rgba(250,204,21,0.28)]',
                )}
              >
                {formatRub(data.prizeRub)}
              </p>
              <p className="mt-1 text-[#9ca3af]">банк</p>
            </div>
            <div className="border-b border-[#334155] p-2.5 transition-colors hover:bg-cyan-500/[0.05] sm:border-b-0 sm:border-r sm:p-4">
              <p className="text-sm font-black text-cyan-300 [text-shadow:0_0_14px_rgba(34,211,238,0.35)] sm:text-base">
                {data.aliveCount}
              </p>
              <p className="mt-1 text-[#9ca3af]">живы</p>
            </div>
            <div
              className={cn(
                'border-r border-[#334155] p-2.5 sm:p-4',
                isEliminated
                  ? 'bg-red-950/20'
                  : 'transition-colors hover:bg-red-500/[0.05]',
              )}
            >
              <p className="text-sm font-black text-red-400 [text-shadow:0_0_14px_rgba(248,113,113,0.35)] sm:text-base">
                {data.eliminatedCount}
              </p>
              <p className="mt-1 text-[#9ca3af]">
                {isEliminated ? 'вы здесь' : 'выбыли'}
              </p>
            </div>
            <div className="p-2.5 transition-colors hover:bg-purple-500/[0.05] sm:p-4">
              <p className="text-sm font-black text-indigo-300 [text-shadow:0_0_14px_rgba(129,140,248,0.35)] sm:text-base">
                {data.daysRunning}
              </p>
              <p className="mt-1 text-[#9ca3af]">дней</p>
            </div>
          </div>

          <div className="relative">
            <div className="space-y-3 px-3 py-4 sm:space-y-5 sm:px-8 sm:py-6">
              {keeperLine ? (
                <div className="border border-red-500/35 bg-[linear-gradient(90deg,rgba(69,10,10,0.28),rgba(2,6,23,0.9))] px-3 py-3 text-center text-xs leading-relaxed text-[#fecaca] shadow-[0_0_32px_rgba(239,68,68,0.14),inset_0_0_22px_rgba(127,29,29,0.12)] sm:px-4 sm:py-4 sm:text-sm">
                  <p className="mb-1 text-[8px] uppercase tracking-[0.22em] text-red-300/90 sm:text-[9px] sm:tracking-[0.28em]">
                    смотритель
                  </p>
                  <p className="mx-auto max-w-[26rem]">{keeperLine}</p>
                </div>
              ) : null}

              {statusText ? (
                <div className="border border-red-500/25 bg-[linear-gradient(90deg,rgba(127,29,29,0.15),rgba(2,6,23,0.82))] px-3 py-3 text-center text-xs leading-relaxed text-[#e5e7eb] shadow-[0_0_28px_rgba(239,68,68,0.10),inset_0_0_18px_rgba(127,29,29,0.08)] sm:px-4 sm:py-4 sm:text-sm">
                  <p className="mb-1 text-[8px] uppercase tracking-[0.22em] text-red-300/80 sm:text-[9px] sm:tracking-[0.28em]">
                    смотритель
                  </p>
                  <p className="mx-auto max-w-[24rem]">{statusText}</p>
                </div>
              ) : null}

              {isEliminated ? (
                <VyzhivanieEliminatedRecord data={data} />
              ) : (
                <VyzhivanieDeadlineTimer data={data} />
              )}

              {!isEliminated &&
                (rulesOpen ? (
                <div className="border border-red-500/25 bg-[#030407]/95 p-3 text-[11px] leading-relaxed text-[#cbd5e1] shadow-[0_0_24px_rgba(127,29,29,0.14),inset_0_0_30px_rgba(127,29,29,0.06)] sm:p-4 sm:text-xs">
                  <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#1f2937] pb-3 sm:mb-4">
                    <div>
                      <p className="font-black uppercase tracking-wider text-[#f9bc60]">
                        Правила
                      </p>
                      <p className="mt-1 text-[11px] normal-case text-[#94a3b8]">
                        Всё просто: зашёл, нажал, живёшь дальше. Не нажал —
                        появишься на карте.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRulesOpen(false)}
                      className="inline-flex h-7 w-7 items-center justify-center border border-[#4b5563] text-[#9ca3af] transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Закрыть правила"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                    <div className="border border-[#243244] bg-black/55 p-2.5 shadow-[inset_0_0_18px_rgba(34,211,238,0.04)] sm:p-3">
                      <p className="font-black uppercase text-cyan-100">
                        1. Вступи
                      </p>
                      <p className="mt-1 text-[#a7b0bf]">
                        Нажми «Вступить в раунд». Всё, ты в списке живых.
                      </p>
                    </div>
                    <div className="border border-[#243244] bg-black/55 p-2.5 shadow-[inset_0_0_18px_rgba(248,113,113,0.04)] sm:p-3">
                      <p className="font-black uppercase text-cyan-100">
                        2. Жми каждый день
                      </p>
                      <p className="mt-1 text-[#a7b0bf]">
                        Раз в день нажимай «Остаться живым». Да, прям так
                        просто.
                      </p>
                    </div>
                    <div className="border border-[#243244] bg-black/55 p-2.5 shadow-[inset_0_0_18px_rgba(248,113,113,0.04)] sm:p-3">
                      <p className="font-black uppercase text-red-200">
                        3. Пропуск = вылет
                      </p>
                      <p className="mt-1 text-[#a7b0bf]">
                        Пропустил день — выбываешь. Я предупреждал, если что.
                      </p>
                    </div>
                    <div className="border border-[#243244] bg-black/55 p-2.5 shadow-[inset_0_0_18px_rgba(250,204,21,0.04)] sm:p-3">
                      <p className="font-black uppercase text-[#fde68a]">
                        4. Последний забирает банк
                      </p>
                      <p className="mt-1 text-[#a7b0bf]">
                        Останешься последним — забираешь банк. Остальные станут
                        записями на карте.
                      </p>
                    </div>
                    <div className="border border-red-500/25 bg-red-950/10 p-2.5 sm:col-span-2 sm:p-3">
                      <p className="font-black uppercase text-red-200">
                        Когда нажимать?
                      </p>
                      <p className="mt-1 text-[#a7b0bf]">
                        Если видишь таймер — жми кнопку сегодня. Завтра будет
                        новая попытка не облажаться.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2 text-[10px] uppercase leading-relaxed text-[#a7b0bf] sm:grid-cols-2 sm:text-xs">
                  <p className="border border-[#1f2937] bg-black/55 px-3 py-2.5 transition-colors hover:border-cyan-300/40 hover:text-white sm:py-3">
                    01 / вступи в раунд
                  </p>
                  <p className="border border-[#1f2937] bg-black/55 px-3 py-2.5 transition-colors hover:border-cyan-300/40 hover:text-white sm:py-3">
                    02 / жми кнопку каждый день
                  </p>
                  <p className="border border-[#1f2937] bg-black/55 px-3 py-2.5 transition-colors hover:border-red-400/50 hover:text-white sm:py-3">
                    03 / забыл — вылетел
                  </p>
                  <p className="border border-[#1f2937] bg-black/55 px-3 py-2.5 transition-colors hover:border-[#f9bc60]/50 hover:text-white sm:py-3">
                    04 / последний живой забирает банк
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'z-10 grid shrink-0 grid-cols-2 gap-1.5 border-t border-[#1f2937] bg-[#020202]/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:flex sm:flex-row sm:justify-center sm:bg-transparent sm:pb-2',
          )}
        >
          {!data.isAuthenticated ? (
            <>
              <Button
                asChild
                className="min-h-9 bg-[#f9bc60] font-mono text-[10px] uppercase text-[#001e1d] shadow-[0_0_24px_rgba(249,188,96,0.28)] hover:bg-[#ffd38a] sm:min-h-10 sm:text-sm"
              >
                <Link href="/login">Войти</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="min-h-9 border-[#6b7280] font-mono text-[10px] uppercase hover:border-cyan-300/70 sm:min-h-10 sm:text-sm"
              >
                <Link href="/register">Регистрация</Link>
              </Button>
            </>
          ) : canJoin ? (
            <Button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="vyzhivanie-glitch-button col-span-2 min-h-11 bg-[#f9bc60] px-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-[#001e1d] shadow-[0_0_28px_rgba(249,188,96,0.42),inset_0_0_14px_rgba(255,255,255,0.18)] hover:bg-[#ffd38a] sm:col-span-1 sm:min-h-10 sm:min-w-52 sm:px-5 sm:text-sm"
            >
              Вступить в раунд
            </Button>
          ) : canCheckIn ? (
            <Button
              type="button"
              disabled={loading}
              onClick={onCheckIn}
              className="vyzhivanie-glitch-button col-span-2 min-h-11 bg-[#7c3aed] px-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_0_32px_rgba(124,58,237,0.70),0_0_18px_rgba(248,113,113,0.30),inset_0_0_16px_rgba(255,255,255,0.18)] sm:col-span-1 sm:min-h-10 sm:min-w-52 sm:px-5 sm:text-sm"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Остаться живым
            </Button>
          ) : isEliminated ? (
            <Button
              type="button"
              onClick={onFocusMyGrave ?? onClose}
              className="vyzhivanie-glitch-button col-span-2 min-h-11 border border-red-500/40 bg-[linear-gradient(180deg,rgba(69,10,10,0.55),rgba(15,3,8,0.92))] px-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-red-100 shadow-[0_0_28px_rgba(239,68,68,0.22),inset_0_0_14px_rgba(244,114,182,0.08)] hover:bg-red-950/80 sm:col-span-1 sm:min-h-10 sm:min-w-52 sm:px-5 sm:text-sm"
            >
              Моя могила
            </Button>
          ) : null}

          {!isEliminated ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setRulesOpen((open) => !open)}
              className="min-h-9 border-[#f9bc60]/50 px-2 font-mono text-[10px] uppercase text-[#f9bc60] hover:bg-[#f9bc60]/10 hover:shadow-[0_0_18px_rgba(249,188,96,0.20)] sm:min-h-10 sm:px-4 sm:text-sm"
            >
              <HelpCircle className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              {rulesOpen ? 'Скрыть' : 'Правила'}
            </Button>
          ) : null}

          {!isEliminated ? (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={cn(
                'min-h-9 border-[#6b7280] px-2 font-mono text-[10px] uppercase hover:border-cyan-300/70 hover:text-cyan-100 sm:min-h-10 sm:px-4 sm:text-sm',
                canJoin || canCheckIn ? '' : 'sm:min-w-40',
              )}
            >
              Кладбище
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-h-9 border-[#6b7280] px-2 font-mono text-[10px] uppercase text-[#94a3b8] hover:border-red-400/50 hover:text-red-100 sm:min-h-10 sm:px-4 sm:text-sm"
            >
              Закрыть
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
