'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KopiAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
  animate?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { container: 'h-10 w-10', image: 'h-8 w-8', badge: 'h-4 w-4 text-[8px]' },
  md: { container: 'h-12 w-12', image: 'h-10 w-10', badge: 'h-5 w-5 text-[9px]' },
  lg: { container: 'h-14 w-14 sm:h-16 sm:w-16', image: 'h-11 w-11 sm:h-12 sm:w-12', badge: 'h-5 w-5 text-[9px]' },
} as const;

export function KopiAvatar({
  size = 'md',
  showOnline = false,
  animate = false,
  className,
}: KopiAvatarProps) {
  const sizes = SIZE_MAP[size];

  const avatar = (
    <div
      className={cn(
        'relative flex flex-shrink-0 items-center justify-center rounded-full border-2 border-[#f9bc60]/40 bg-[#004643]/80 shadow-[0_0_20px_rgba(249,188,96,0.15)]',
        sizes.container,
        className,
      )}
    >
      <Image
        src="/FAQ.png"
        alt=""
        width={56}
        height={56}
        className={cn(sizes.image, 'object-contain drop-shadow-lg')}
        loading="lazy"
      />
      {showOnline && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#001e1d] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
          aria-hidden
        />
      )}
    </div>
  );

  if (!animate) return avatar;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {avatar}
    </motion.div>
  );
}

interface KopiMessageBubbleProps {
  role: 'kopi' | 'user';
  text: string;
  index?: number;
}

export function KopiMessageBubble({ role, text, index = 0 }: KopiMessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 28,
        delay: index * 0.04,
      }}
      className={cn(
        'flex w-full min-w-0',
        isUser ? 'justify-end' : 'justify-start gap-2',
      )}
    >
      {!isUser && <KopiAvatar size="sm" className="mt-0.5 shrink-0 self-end" />}
      <div
        className={cn(
          'min-w-0 max-w-[min(82%,calc(100%-2.75rem))] break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]',
          isUser && 'max-w-[min(88%,100%)]',
          isUser ? 'rounded-br-md' : 'rounded-bl-md',
        )}
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #e8a545 0%, #f9bc60 100%)',
                color: '#001e1d',
                boxShadow: '0 4px 16px rgba(249, 188, 96, 0.2)',
              }
            : {
                background: 'rgba(171, 209, 198, 0.1)',
                color: '#fffffe',
                border: '1px solid rgba(171, 209, 198, 0.18)',
              }
        }
      >
        {text}
      </div>
    </motion.div>
  );
}

export function KopiTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex w-full min-w-0 items-end gap-2"
    >
      <KopiAvatar size="sm" className="shrink-0" />
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-md border px-4 py-3"
        style={{
          background: 'rgba(171, 209, 198, 0.1)',
          borderColor: 'rgba(171, 209, 198, 0.18)',
        }}
        aria-label="Копи печатает"
      >
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-[#abd1c6]"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: dot * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface KopiBackButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function KopiBackButton({
  label,
  onClick,
  disabled = false,
  className,
}: KopiBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
        'border-[#f9bc60]/45 bg-[#f9bc60]/12 text-[#f9bc60]',
        'hover:border-[#f9bc60]/65 hover:bg-[#f9bc60]/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

interface KopiFabPulseProps {
  active?: boolean;
}

export function KopiFabPulse({ active = true }: KopiFabPulseProps) {
  if (!active) return null;

  return (
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-full bg-[#f9bc60]/10"
      animate={{ opacity: [0.35, 0.7, 0.35] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    />
  );
}

interface KopiFabButtonProps {
  isOpen: boolean;
  isTourActive: boolean;
  showPulse: boolean;
  onClick: () => void;
  onDismiss: () => void;
}

export function KopiFabButton({
  isOpen,
  isTourActive,
  showPulse,
  onClick,
  onDismiss,
}: KopiFabButtonProps) {
  return (
    <motion.div
      className="group relative inline-block max-w-full"
      whileHover={isTourActive ? undefined : { scale: 1.02, y: -1 }}
      whileTap={isTourActive ? undefined : { scale: 0.98 }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={isOpen ? 'Закрыть чат с Копи' : 'Открыть помощника Копи'}
        aria-expanded={isOpen}
        disabled={isTourActive}
        className={cn(
          'relative isolate overflow-hidden rounded-full border shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-shadow',
          'border-[#f9bc60]/35 group-hover:border-[#f9bc60]/55 group-hover:shadow-[0_12px_36px_rgba(249,188,96,0.22)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]',
          isTourActive && 'cursor-default opacity-80',
          isOpen && 'border-[#f9bc60]/50 shadow-[0_0_24px_rgba(249,188,96,0.2)]',
        )}
        style={{
          background:
            'linear-gradient(135deg, rgba(0,78,67,0.92) 0%, rgba(0,30,29,0.96) 55%, rgba(0,48,44,0.94) 100%)',
        }}
      >
        <KopiFabPulse active={showPulse && !isOpen} />

        <span
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-gradient-to-r from-[#f9bc60]/12 to-transparent"
          aria-hidden
        />

        <span className="relative flex items-center gap-2 p-1 min-[400px]:gap-2.5 min-[400px]:py-1.5 min-[400px]:pl-1.5 min-[400px]:pr-3.5 sm:pr-4">
          <span className="relative shrink-0">
            <span
              className={cn(
                'absolute -inset-0.5 rounded-full bg-[#f9bc60]/20 blur-sm transition-opacity',
                'opacity-60 group-hover:opacity-100',
              )}
              aria-hidden
            />
            <KopiAvatar size="lg" className="relative" />
            {!isOpen && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#001e1d]/40 bg-[#f9bc60] text-[10px] font-bold text-[#001e1d] shadow-md"
                aria-hidden
              >
                ?
              </span>
            )}
          </span>

          <span className="hidden min-w-0 flex-col text-left leading-tight min-[400px]:flex">
            <span className="text-sm font-bold tracking-tight text-[#fffffe] sm:text-[15px]">
              Копи
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-[#abd1c6]/90 sm:text-[11px]">
              <MessageCircle className="h-3 w-3 shrink-0 text-[#abd1c6]/70" aria-hidden />
              <span className="truncate">Помощник «Копилки»</span>
            </span>
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
        }}
        disabled={isTourActive}
        className={cn(
          'absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-colors',
          'border-[#abd1c6]/30 bg-[#001e1d] text-[#abd1c6] hover:bg-[#004643] hover:text-[#fffffe]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50',
          isTourActive && 'pointer-events-none opacity-50',
        )}
        aria-label="Скрыть помощника Копи"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
