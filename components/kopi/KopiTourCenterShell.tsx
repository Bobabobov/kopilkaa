'use client';

import Image from 'next/image';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KopiTourCenterShellProps {
  children: ReactNode;
  className?: string;
  /** Лёгкое затемнение — страница остаётся видимой */
  backdropClassName?: string;
  showKopiAvatar?: boolean;
}

export function KopiTourCenterShell({
  children,
  className,
  backdropClassName,
  showKopiAvatar = true,
}: KopiTourCenterShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <div
        className={cn(
          'absolute inset-0 bg-[#001e1d]/15',
          backdropClassName,
        )}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className={cn(
          'relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl',
          className,
        )}
        style={{
          borderColor: 'rgba(249, 188, 96, 0.35)',
          background:
            'linear-gradient(165deg, rgba(0,78,67,0.98) 0%, rgba(0,30,29,0.99) 100%)',
        }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f9bc60]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-[#abd1c6]/10 blur-3xl" />

        {showKopiAvatar && (
          <div className="flex justify-center pt-6 sm:pt-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f9bc60]/40 bg-[#004643]/80 shadow-[0_0_32px_rgba(249,188,96,0.2)]">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/FAQ.png"
                  alt="Копи"
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
              </motion.div>
            </div>
          </div>
        )}

        {children}
      </motion.div>
    </motion.div>
  );
}

export function KopiTourStepBadge({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f9bc60]">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

export function KopiTourProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-3xl bg-white/10">
      <motion.div
        className="h-full bg-[#f9bc60]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </div>
  );
}
