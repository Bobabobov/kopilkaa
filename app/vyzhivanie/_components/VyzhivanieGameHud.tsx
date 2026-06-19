'use client';

import {
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { formatRub } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TontineStatusResponse } from '../types';
import { VyzhivanieDeadlineTimer } from './VyzhivanieDeadlineTimer';
import { getEliminatedKeeperLine } from './VyzhivanieEliminatedOverlay';

type Props = {
  data: TontineStatusResponse;
  loading: boolean;
  compact: boolean;
  onJoin: () => void;
  onCheckIn: () => void;
  onOpenStart: () => void;
  onFocusMyGrave?: () => void;
  hasEmptyGraveyard: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
};

const CHAT_MESSAGE_MAX_LENGTH = 120;

function KeeperAvatarButton({
  compact,
  open,
  onToggle,
}: {
  compact: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'relative grid shrink-0 animate-pulse place-items-center border border-red-300/50 bg-[radial-gradient(circle,rgba(127,29,29,0.42),rgba(17,24,39,0.96)_62%)] shadow-[0_0_30px_rgba(127,29,29,0.60),inset_0_0_20px_rgba(255,255,255,0.10)] transition-colors hover:border-cyan-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70',
        compact ? 'h-14 w-14 text-2xl' : 'h-20 w-20 text-4xl',
      )}
      aria-expanded={open}
      aria-label="Открыть мини-профиль смотрителя"
    >
      <span className="absolute -left-1 top-3 h-px w-5 bg-cyan-300/70" />
      <span className="absolute -right-1 bottom-4 h-px w-5 bg-red-300/70" />
      ☠
    </button>
  );
}

function StatChip({
  label,
  value,
  valueClassName,
  compact,
}: {
  label: string;
  value: string | number;
  valueClassName: string;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border border-[#334155] bg-[#020617]/92 font-mono shadow-[0_10px_32px_rgba(0,0,0,0.46),inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_20px_rgba(34,211,238,0.04)] backdrop-blur-md transition-colors hover:border-cyan-300/45 hover:bg-black/95',
        compact ? 'px-2 py-1.5' : 'min-w-24 px-3 py-2.5',
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      <div className="pointer-events-none absolute -right-4 -top-4 h-10 w-10 rounded-full bg-cyan-400/10 blur-xl" />
      <p
        className={cn(
          'font-mono uppercase tracking-[0.22em] text-[#94a3b8]',
          compact ? 'text-[8px]' : 'text-[10px]',
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          'mt-1 font-mono font-black leading-tight [text-shadow:0_0_14px_currentColor]',
          compact ? 'text-sm' : 'text-lg',
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  );
}

function getPlayerName(user: TontineStatusResponse['user']): string {
  if (!user.joined) return 'игрок';
  return user.displayName;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickPhrase(phrases: string[], seed: string): string {
  return phrases[hashText(seed) % phrases.length];
}

function getSurvivalMessage(data: TontineStatusResponse): string {
  const { user } = data;

  if (!data.isAuthenticated) {
    return pickPhrase(
      [
        'Смотреть можно и без входа. Играть — уже нет.',
        'Пока ты гость, запись на карте не поднимаю. Экономлю пиксели.',
        'Хочешь в раунд — войди. Без аккаунта в реестр не попадёшь.',
        'Сейчас ты просто прохожий. Можешь поглазеть, могилы не кусаются.',
        'Войди в аккаунт, если готов. Просто смотреть тоже вариант, я не давлю.',
      ],
      `guest:${data.roundId}`,
    );
  }

  if (!user.joined) {
    return pickPhrase(
      [
        'Ты ещё не в раунде. Хочешь — заходи, но потом не пропадай.',
        'Раунд идёт. Место свободное есть. Пока без твоего имени.',
        'Вступишь — надо будет каждый день отмечаться. Забудешь — ну, сам понимаешь.',
        'Правило простое: зашёл в игру, потом каждый день жмёшь кнопку.',
        'Хочешь рискнуть — вступай. Не хочешь — тоже разумно, честно говоря.',
      ],
      `not-joined:${data.roundId}`,
    );
  }

  const name = getPlayerName(user);
  const seed = `${data.roundId}:${user.participantId}:${user.status}:${user.lastCheckInDate ?? 'none'}`;

  if (user.status === 'ELIMINATED') {
    return getEliminatedKeeperLine(data);
  }

  if (user.status === 'WINNER') {
    return pickPhrase(
      [
        `${name}, вы последний живой. Звучит мрачно, но банк ваш.`,
        `${name}, вы победили. Остальные не дотянули, бывает.`,
        `${name}, всё, вы остались один. Хорошая новость для кошелька.`,
        `${name}, банк ваш. Я бы поздравил теплее, но я всё-таки смотритель кладбища.`,
        `${name}, вы пережили всех. Вот где привычка заходить каждый день пригодилась.`,
      ],
      `winner:${seed}`,
    );
  }

  if (user.canCheckInToday) {
    return pickPhrase(
      [
        `${name}, сегодня вы ещё не нажали кнопку. Лучше сделать это сейчас.`,
        `${name}, нужен один клик. Да, звучит легко. Вот поэтому и забывают.`,
        `${name}, вы пока живы. Не заставляйте меня готовить вашу запись на карте.`,
        `${name}, отметьтесь сегодня. Завтра отмазки уже не помогут.`,
        `${name}, кнопка ждёт. Я тоже. Но я, в отличие от вас, не вылетаю.`,
      ],
      `required:${seed}`,
    );
  }

  return pickPhrase(
    [
      `${name}, на сегодня живы. Завтра повторим этот маленький цирк.`,
      `${name}, отметка есть. Запись на карте пока свернул, не благодарите.`,
      `${name}, сегодня всё нормально. Карта кладбища подождёт — она никуда не денется.`,
      `${name}, живы. Странно, но приятно.`,
      `${name}, успели. Завтра посмотрим, не подведёт ли память.`,
    ],
    `alive:${seed}`,
  );
}

function getThreatBadge(data: TontineStatusResponse): string {
  const { user } = data;

  if (!data.isAuthenticated) return 'зритель';
  if (!user.joined) return 'ещё не в игре';
  if (user.status === 'ELIMINATED') return 'уже всё';
  if (user.status === 'WINNER') return 'последний живой';
  if (user.canCheckInToday) return 'пора нажать';
  return 'жив. пока что';
}

function getGraveChatReply(data: TontineStatusResponse): string {
  const { user } = data;

  if (user.joined && user.status === 'ELIMINATED') {
    return 'Мёртвые не разговаривают.';
  }

  return 'Я с живыми не разговариваю.';
}

function getHudCollapsedLabel(
  data: TontineStatusResponse,
  flags: {
    canJoin: boolean;
    canCheckIn: boolean;
    checkedIn: boolean;
    isEliminated: boolean;
  },
): string {
  if (flags.isEliminated) return 'Выбыл';
  if (flags.canJoin) return 'Вступить в раунд';
  if (flags.canCheckIn) return 'Пора нажать';
  if (flags.checkedIn) return 'Отметка принята';
  if (!data.isAuthenticated) return 'Гость';
  return 'Смотритель на связи';
}

function sanitizeGraveChatInput(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, CHAT_MESSAGE_MAX_LENGTH);
}

export function VyzhivanieGameHud({
  data,
  loading,
  compact,
  onJoin,
  onCheckIn,
  onOpenStart,
  onFocusMyGrave,
  hasEmptyGraveyard,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: Props) {
  const { user } = data;
  const canJoin = data.isAuthenticated && !user.joined;
  const canCheckIn =
    user.joined && user.status === 'ALIVE' && user.canCheckInToday;
  const checkedIn =
    user.joined && user.status === 'ALIVE' && user.checkedInToday;
  const isEliminated = user.joined && user.status === 'ELIMINATED';
  const showDeadlineTimer = data.isAuthenticated && user.joined;

  const statsTop = compact ? 'left-2 right-2 top-2' : 'left-3 top-3';
  const statsLayout = compact
    ? 'grid grid-cols-4 gap-px'
    : 'grid grid-cols-4 gap-px';
  const survivalMessage = useMemo(() => getSurvivalMessage(data), [data]);
  const threatBadge = useMemo(() => getThreatBadge(data), [data]);
  const [typedMessage, setTypedMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [sentChatMessage, setSentChatMessage] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState<string | null>(null);
  const [keeperProfileOpen, setKeeperProfileOpen] = useState(false);
  const [hudExpanded, setHudExpanded] = useState(true);
  const hudCollapsedLabel = getHudCollapsedLabel(data, {
    canJoin,
    canCheckIn,
    checkedIn,
    isEliminated,
  });

  useEffect(() => {
    setTypedMessage('');

    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setTypedMessage(survivalMessage.slice(0, index));

      if (index >= survivalMessage.length) {
        window.clearInterval(id);
      }
    }, 18);

    return () => window.clearInterval(id);
  }, [survivalMessage]);

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const safeMessage = sanitizeGraveChatInput(chatMessage).trim();
    if (!safeMessage) return;

    setSentChatMessage(safeMessage);
    setChatReply(getGraveChatReply(data));
    setChatMessage('');
  };

  const handleChatChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatMessage(sanitizeGraveChatInput(event.target.value));
  };

  const handleChatPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text/plain');
    setChatMessage((current) => sanitizeGraveChatInput(`${current}${pasted}`));
  };

  return (
    <>
      <div className={cn('pointer-events-none absolute z-10', statsTop)}>
        <div
          className={cn(
            'overflow-hidden border border-[#334155] bg-black/55 font-mono shadow-[0_18px_45px_rgba(0,0,0,0.48),inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md',
            compact ? 'mx-auto max-w-[calc(100vw-1rem)]' : 'min-w-[430px]',
          )}
        >
          <div
            className={cn(
              'items-center justify-between border-b border-[#1f2937] bg-[linear-gradient(90deg,rgba(127,29,29,0.18),rgba(2,6,23,0.86))] px-3 py-1.5 text-[9px] uppercase tracking-[0.26em] text-[#94a3b8]',
              compact ? 'hidden' : 'flex',
            )}
          >
            <span className="text-red-300">сводка раунда</span>
            <span className="hidden text-cyan-200/70 sm:inline">
              кладбище считает без ошибок
            </span>
          </div>
          <div className={statsLayout}>
            <StatChip
              label="живы"
              value={data.aliveCount}
              valueClassName="text-cyan-300"
              compact={compact}
            />
            <StatChip
              label="выбыли"
              value={data.eliminatedCount}
              valueClassName="text-red-400"
              compact={compact}
            />
            <StatChip
              label="банк"
              value={formatRub(data.prizeRub)}
              valueClassName="text-[#f9bc60] text-xs sm:text-sm"
              compact={compact}
            />
            <StatChip
              label="дней"
              value={data.daysRunning}
              valueClassName="text-indigo-300"
              compact={compact}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'vyzhivanie-glitch-panel pointer-events-auto absolute z-10 overflow-hidden border border-[#5b6470] bg-[#020202]/97 font-mono text-[#e5e7eb] shadow-[0_26px_92px_rgba(0,0,0,0.95),0_0_0_2px_rgba(0,0,0,0.98),0_0_52px_rgba(127,29,29,0.34),inset_0_0_0_1px_rgba(255,255,255,0.09),inset_0_0_44px_rgba(127,29,29,0.18)] backdrop-blur-sm',
          compact
            ? cn(
                'inset-x-2 bottom-2',
                hudExpanded ? 'max-h-[44vh] overflow-y-auto' : '',
              )
            : 'inset-x-2 bottom-14 sm:inset-x-4',
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,#ffffff_4px)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(90deg,#ef4444_1px,transparent_1px),linear-gradient(0deg,#ef4444_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-pulse bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px animate-pulse bg-gradient-to-r from-transparent via-[#f9bc60] to-transparent" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 animate-pulse rounded-full bg-red-900/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-48 w-48 animate-pulse rounded-full bg-[#7c3aed]/18 blur-3xl" />
        <div className="pointer-events-none absolute left-3 top-3 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]">
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-red-400/60" />
        <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-red-400/60" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-[#f9bc60]/50" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-[#f9bc60]/50" />
        <div className="pointer-events-none absolute left-1/4 top-5 h-px w-28 animate-pulse bg-cyan-300/30" />
        <div className="pointer-events-none absolute right-1/4 top-8 h-px w-20 animate-pulse bg-red-400/40" />
        <div className="pointer-events-none absolute bottom-10 left-24 h-1 w-32 animate-pulse bg-[#7c3aed]/30 blur-[1px]" />
        <div className="pointer-events-none absolute bottom-16 right-28 h-1 w-24 animate-pulse bg-red-500/30 blur-[1px]" />

        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-[#334155] bg-[linear-gradient(90deg,rgba(127,29,29,0.22),rgba(0,0,0,0.92))] px-3 py-2">
          <span
            className={cn(
              'min-w-0 truncate text-[10px] font-black uppercase tracking-[0.16em]',
              isEliminated
                ? 'text-red-300'
                : canCheckIn
                  ? 'text-orange-300'
                  : checkedIn
                    ? 'text-emerald-300'
                    : canJoin
                      ? 'text-[#f9bc60]'
                      : 'text-[#94a3b8]',
            )}
          >
            {hudCollapsedLabel}
          </span>
          <button
            type="button"
            onClick={() => setHudExpanded((open) => !open)}
            className="inline-flex shrink-0 items-center gap-1 border border-[#4b5563] bg-black/60 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-[#d1d5db] transition-colors hover:border-cyan-300/60 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70"
            aria-expanded={hudExpanded}
            aria-label={hudExpanded ? 'Свернуть панель' : 'Развернуть панель'}
          >
            {hudExpanded ? (
              <>
                Свернуть
                <ChevronDown className="h-4 w-4" aria-hidden />
              </>
            ) : (
              <>
                Развернуть
                <ChevronUp className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </div>

        {hudExpanded ? (
          <>
        <div
          className={cn(
            'relative border-b border-red-950/60 bg-[linear-gradient(90deg,rgba(127,29,29,0.26),rgba(0,0,0,0.90),rgba(30,41,59,0.22))] px-4 py-2 pl-8 text-[9px] uppercase tracking-[0.35em] text-red-200/80',
            compact ? 'hidden' : '',
          )}
        >
          <span className="vyzhivanie-glitch-text mr-3 animate-pulse text-red-400">
            signal unstable
          </span>
          <span className="hidden sm:inline">death-check terminal</span>
          <span className="float-right hidden text-[#f9bc60]/80 sm:inline">
            graveyard protocol v.01
          </span>
        </div>

        {!isEliminated ? (
          <div
            className={cn(
              'relative grid gap-px bg-[#1f2937]',
              compact ? 'grid-cols-1' : 'md:grid-cols-[250px_1fr_290px]',
            )}
          >
          <div
            className={cn(
              'bg-[linear-gradient(135deg,rgba(0,0,0,0.99),rgba(31,41,55,0.92))] text-[10px] uppercase leading-tight tracking-wider text-[#cbd5e1] shadow-[inset_0_0_30px_rgba(127,29,29,0.22)]',
              compact ? 'hidden' : 'min-h-24 p-4',
            )}
          >
            <div className="relative overflow-hidden border border-red-500/20 bg-black/35 p-2">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-pulse bg-gradient-to-r from-transparent via-red-400 to-transparent" />
              <p className="vyzhivanie-glitch-text text-white drop-shadow-[0_0_10px_rgba(248,113,113,0.32)]">
                Кнопка или запись
              </p>
              <p className="mt-1 text-red-300">Я бы выбрал кнопку</p>
              <p className="mt-2 inline-flex items-center gap-2 border border-red-500/30 bg-red-950/30 px-2 py-1 text-[9px] text-red-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                {threatBadge}
              </p>
            </div>

            <div className="mt-2 grid grid-cols-5 gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'h-1 border border-red-500/20 bg-red-500/20 transition-all',
                    index % 3 === 0
                      ? 'animate-pulse bg-red-400/60 shadow-[0_0_8px_rgba(248,113,113,0.5)]'
                      : '',
                    index % 4 === 0 ? 'bg-cyan-400/30' : '',
                  )}
                />
              ))}
            </div>
          </div>

          <div
            className={cn(
              'relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.28),rgba(0,0,0,0.98)_64%)]',
              compact ? 'min-h-16 p-2' : 'min-h-24 p-4',
            )}
          >
            <div className="pointer-events-none absolute inset-y-2 left-6 w-px animate-pulse bg-red-500/30" />
            <div className="pointer-events-none absolute inset-y-2 right-6 w-px animate-pulse bg-red-500/30" />
            <div className="pointer-events-none absolute left-10 top-5 h-2 w-24 -skew-x-12 animate-pulse bg-cyan-400/10" />
            <div className="pointer-events-none absolute bottom-6 right-12 h-2 w-32 skew-x-12 animate-pulse bg-red-500/12" />
            {canCheckIn ? (
              <button
                type="button"
                disabled={loading}
                onClick={onCheckIn}
                className={cn(
                  'vyzhivanie-glitch-button vyzhivanie-action-button relative overflow-hidden border border-red-200 bg-[linear-gradient(180deg,#8b1cf6,#581c87)] font-black uppercase tracking-widest text-white shadow-[0_0_38px_rgba(124,58,237,0.86),0_0_22px_rgba(239,68,68,0.48),inset_0_0_20px_rgba(255,255,255,0.22)] transition-[transform,filter,box-shadow] hover:scale-[1.06] hover:shadow-[0_0_52px_rgba(124,58,237,0.95),0_0_28px_rgba(34,211,238,0.42),inset_0_0_24px_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60',
                  compact
                    ? 'min-h-12 w-full px-5 text-xs'
                    : 'min-h-14 px-10 text-sm',
                )}
              >
                <span className="pointer-events-none absolute -left-2 top-2 h-px w-8 bg-cyan-300/70" />
                <span className="pointer-events-none absolute -right-2 bottom-2 h-px w-8 bg-red-300/70" />
                <span className="pointer-events-none absolute inset-x-4 top-1 h-px bg-white/20" />
                <span className="relative z-10">
                  {loading ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    'Остаться живым'
                  )}
                </span>
              </button>
            ) : canJoin ? (
              <button
                type="button"
                disabled={loading}
                onClick={onJoin}
                className={cn(
                  'vyzhivanie-glitch-button vyzhivanie-action-button relative overflow-hidden border border-[#fde68a] bg-[linear-gradient(180deg,#ffd38a,#f9bc60)] font-black uppercase tracking-widest text-[#120904] shadow-[0_0_38px_rgba(249,188,96,0.76),0_0_24px_rgba(239,68,68,0.28),inset_0_0_18px_rgba(255,255,255,0.26)] transition-[transform,filter,box-shadow] hover:scale-[1.06] hover:shadow-[0_0_52px_rgba(249,188,96,0.9),0_0_28px_rgba(248,113,113,0.34),inset_0_0_24px_rgba(255,255,255,0.30)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde68a]/80 disabled:cursor-not-allowed disabled:opacity-60',
                  compact
                    ? 'min-h-12 w-full px-5 text-xs'
                    : 'min-h-14 px-10 text-sm',
                )}
              >
                <span className="pointer-events-none absolute -left-2 top-2 h-px w-8 bg-red-400/70" />
                <span className="pointer-events-none absolute -right-2 bottom-2 h-px w-8 bg-cyan-300/70" />
                <span className="relative z-10">
                  {loading ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    'Вступить в игру'
                  )}
                </span>
              </button>
            ) : checkedIn ? (
              <p
                className={cn(
                  'border border-emerald-400/60 bg-emerald-500/15 font-black uppercase tracking-widest text-emerald-200 shadow-[0_0_26px_rgba(16,185,129,0.28),inset_0_0_16px_rgba(16,185,129,0.16)]',
                  compact ? 'px-3 py-2 text-[10px]' : 'px-8 py-4 text-xs',
                )}
              >
                Отметка принята
              </p>
            ) : (
              <button
                type="button"
                onClick={onOpenStart}
                className="min-h-10 border border-[#6b7280] px-5 text-[11px] uppercase tracking-wider text-[#d1d5db] transition-colors hover:border-[#f9bc60] hover:text-[#f9bc60]"
              >
                Правила / старт
              </button>
            )}
          </div>

          <div
            className={cn(
              'bg-[linear-gradient(135deg,rgba(0,0,0,0.99),rgba(15,23,42,0.94))] shadow-[inset_0_0_30px_rgba(127,29,29,0.18)]',
              compact ? 'min-h-16 p-2' : 'min-h-24 p-3',
              !showDeadlineTimer && compact ? 'hidden' : '',
            )}
          >
            <VyzhivanieDeadlineTimer data={data} compact />
          </div>
        </div>
        ) : null}

        <div
          className={cn(
            'relative border-t border-[#334155] bg-[linear-gradient(180deg,rgba(7,10,16,0.99),rgba(0,0,0,0.99))]',
            compact ? 'px-3 py-3' : 'grid md:grid-cols-[128px_1fr]',
          )}
        >
          {!compact ? (
            <div className="flex items-center justify-center border-b border-[#334155] p-3 md:border-b-0 md:border-r">
              <KeeperAvatarButton
                compact={false}
                open={keeperProfileOpen}
                onToggle={() => setKeeperProfileOpen((open) => !open)}
              />
            </div>
          ) : null}
          <div className={cn(compact ? '' : 'min-h-32 px-5 py-5')}>
            {compact ? (
              <div className="mb-2 flex items-center gap-3">
                <KeeperAvatarButton
                  compact
                  open={keeperProfileOpen}
                  onToggle={() => setKeeperProfileOpen((open) => !open)}
                />
                <button
                  type="button"
                  onClick={() => setKeeperProfileOpen((open) => !open)}
                  className="vyzhivanie-glitch-text min-w-0 flex-1 text-left text-[10px] uppercase tracking-[0.24em] text-red-300/80 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70"
                  aria-expanded={keeperProfileOpen}
                >
                  Смотритель кладбища
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setKeeperProfileOpen((open) => !open)}
                className="vyzhivanie-glitch-text text-left text-[10px] uppercase tracking-[0.24em] text-red-300/80 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70"
                aria-expanded={keeperProfileOpen}
              >
                Смотритель кладбища
              </button>
            )}

            {keeperProfileOpen ? (
              <div
                className={cn(
                  'mt-2 grid gap-2 border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(2,6,23,0.92),rgba(127,29,29,0.12))] p-3 text-[10px] leading-relaxed text-[#cbd5e1] shadow-[0_0_22px_rgba(34,211,238,0.08),inset_0_0_18px_rgba(255,255,255,0.04)]',
                  compact ? 'text-[10px]' : 'sm:grid-cols-[1fr_auto]',
                )}
              >
                <div>
                  <p className="font-black uppercase tracking-[0.2em] text-cyan-200">
                    Профиль смотрителя
                  </p>
                  <p className="mt-1 text-[#94a3b8]">
                    Следит за отметками, выписывает выбывших в реестр и делает
                    вид, что ему всё равно.
                  </p>
                </div>
                <div className="grid gap-1 text-[9px] uppercase tracking-[0.16em] text-[#94a3b8] sm:min-w-36">
                  <span className="border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                    статус: на смене
                  </span>
                  <span className="border border-red-400/20 bg-red-500/10 px-2 py-1 text-red-200">
                    должность: выписывать мёртвых
                  </span>
                </div>
              </div>
            ) : null}

            <p
              className={cn(
                'mt-2 leading-relaxed text-[#f1f5f9] [text-shadow:0_0_10px_rgba(248,113,113,0.20)]',
                compact ? 'line-clamp-2 text-[11px]' : 'text-xs sm:text-sm',
              )}
            >
              {typedMessage}
              <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
            </p>

            {chatReply ? null : (
              <form
                onSubmit={handleChatSubmit}
                className={cn(
                  'grid gap-2 border border-red-500/20 bg-black/45 p-2 sm:grid-cols-[1fr_auto]',
                  compact ? 'mt-2' : 'mt-4',
                )}
              >
                <input
                  value={chatMessage}
                  onChange={handleChatChange}
                  onPaste={handleChatPaste}
                  maxLength={CHAT_MESSAGE_MAX_LENGTH}
                  placeholder="Сказать что-нибудь смотрителю..."
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-9 border border-[#334155] bg-[#020617] px-3 text-xs text-[#e5e7eb] outline-none transition-colors placeholder:text-[#64748b] focus:border-red-400"
                />
                <button
                  type="submit"
                  className="h-9 border border-red-400/50 bg-red-950/40 px-4 text-[10px] font-black uppercase tracking-widest text-red-200 transition-colors hover:bg-red-500/20"
                >
                  Отправить
                </button>
              </form>
            )}

            {chatReply ? (
              <div
                className={cn(
                  'space-y-2 border border-cyan-400/20 bg-cyan-950/10 text-xs shadow-[0_0_16px_rgba(34,211,238,0.08)]',
                  compact ? 'mt-2 p-2' : 'mt-3 p-3',
                )}
              >
                <div className="border border-[#334155] bg-[#020617]/80 px-3 py-2">
                  <p className="mb-1 text-[9px] uppercase tracking-[0.22em] text-[#94a3b8]">
                    Вы
                  </p>
                  <p className="text-[#e5e7eb]">{sentChatMessage}</p>
                </div>
                <div className="border border-red-400/30 bg-red-950/20 px-3 py-2">
                  <p className="mb-1 text-[9px] uppercase tracking-[0.22em] text-red-300">
                    Смотритель цифрового кладбища
                  </p>
                  <p className="text-cyan-100">{chatReply}</p>
                </div>
              </div>
            ) : null}

            {compact && !isEliminated ? (
              <button
                type="button"
                onClick={onOpenStart}
                className="mt-2 w-full border border-[#f9bc60]/50 bg-[#f9bc60]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#f9bc60]"
              >
                Правила
              </button>
            ) : null}
          </div>
        </div>
          </>
        ) : null}
      </div>

      {!isEliminated ? (
        <button
          type="button"
          onClick={onOpenStart}
          className={cn(
            'pointer-events-auto absolute right-2 top-3 z-10 border border-[#334155] bg-black/90 px-4 py-2 font-mono uppercase tracking-[0.18em] text-[#d1d5db] shadow-[0_12px_34px_rgba(0,0,0,0.48),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-[#f9bc60] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60] sm:right-3',
            compact ? 'hidden' : 'text-xs',
          )}
        >
          Правила
        </button>
      ) : (
        <>
          {onFocusMyGrave ? (
            <button
              type="button"
              onClick={onFocusMyGrave}
              className={cn(
                'pointer-events-auto absolute right-[calc(5.5rem+0.5rem)] top-3 z-10 border border-red-500/40 bg-black/90 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-red-100 shadow-[0_12px_34px_rgba(0,0,0,0.48),0_0_18px_rgba(239,68,68,0.18),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-red-400 hover:bg-red-950/40 hover:text-red-50 sm:right-[calc(6.5rem+0.75rem)]',
                compact ? 'right-2 top-[4.5rem] text-[10px]' : '',
              )}
            >
              Моя могила
            </button>
          ) : null}
          <button
            type="button"
            onClick={onOpenStart}
            className={cn(
              'pointer-events-auto absolute right-2 top-3 z-10 border border-red-500/35 bg-black/90 px-4 py-2 font-mono uppercase tracking-[0.18em] text-red-200/90 shadow-[0_12px_34px_rgba(0,0,0,0.48),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-red-400 hover:bg-red-950/30 hover:text-red-100 sm:right-3',
              compact ? 'hidden' : 'text-xs',
            )}
          >
            Запись
          </button>
        </>
      )}

      <div
        className={cn(
          'pointer-events-auto absolute right-2 top-14 z-10 overflow-hidden border border-[#334155] bg-black/90 p-1 font-mono text-[#d1d5db] shadow-[0_12px_34px_rgba(0,0,0,0.48),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md sm:right-3',
          compact ? 'hidden' : 'text-xs',
        )}
        aria-label="Масштаб карты"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <div
          className={cn(
            'mb-1 px-2 pt-1 text-[8px] uppercase tracking-[0.2em] text-[#64748b]',
            compact ? 'hidden' : '',
          )}
        >
          зум
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onZoomOut}
            className="h-8 min-w-8 border border-[#374151] px-2 transition-colors hover:border-cyan-300 hover:text-cyan-200"
            aria-label="Отдалить"
          >
            −
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            className="h-8 min-w-14 border border-[#374151] px-2 text-cyan-100 transition-colors hover:border-[#f9bc60] hover:text-[#f9bc60]"
            aria-label="Сбросить масштаб"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="h-8 min-w-8 border border-[#374151] px-2 transition-colors hover:border-cyan-300 hover:text-cyan-200"
            aria-label="Приблизить"
          >
            +
          </button>
        </div>
      </div>

      {hasEmptyGraveyard ? (
        <div
          className={cn(
            'pointer-events-none absolute right-2 top-32 z-10 border border-emerald-400/35 bg-black/85 px-3 py-2 font-mono uppercase tracking-[0.18em] text-emerald-200 shadow-[0_10px_30px_rgba(0,0,0,0.40),inset_0_0_18px_rgba(16,185,129,0.06)] backdrop-blur-md sm:right-3',
            compact ? 'hidden' : 'text-[10px]',
          )}
        >
          пока пусто
        </div>
      ) : null}
    </>
  );
}
