'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcons } from '@/components/ui/LucideIcons';

interface AppErrorViewProps {
  title?: string;
  description: string;
  onRetry: () => void;
  retryLabel?: string;
  secondaryHref: string;
  secondaryLabel: string;
  secondaryIcon?: ReactNode;
  detailsContent?: ReactNode;
  detailsToggleLabel?: string;
}

export default function AppErrorView({
  title = 'Что-то пошло не так',
  description,
  onRetry,
  retryLabel = 'Попробовать снова',
  secondaryHref,
  secondaryLabel,
  secondaryIcon,
  detailsContent,
  detailsToggleLabel = 'Технические подробности (для поддержки)',
}: AppErrorViewProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative z-10 flex min-h-[min(70vh,640px)] w-full items-center justify-center px-4 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        <Card
          variant="darkGlass"
          padding="lg"
          className="border-amber-400/15 text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
        >
          <CardContent className="space-y-6">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-amber-400/25"
              aria-hidden
            >
              <LucideIcons.AlertCircle className="text-[#f9bc60]" size="xl" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#fffffe] sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm leading-relaxed text-[#abd1c6] sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:opacity-90 hover:shadow-lg sm:text-base"
                style={{
                  background:
                    'linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)',
                  color: '#001e1d',
                  boxShadow: '0 8px 24px rgba(249, 188, 96, 0.3)',
                }}
              >
                <LucideIcons.RefreshCw size="sm" />
                {retryLabel}
              </button>

              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#001e1d]/50 px-6 py-3.5 text-sm font-semibold text-[#fffffe] backdrop-blur-sm transition-all duration-300 hover:border-[#f9bc60]/40 hover:bg-[#001e1d]/70 sm:text-base"
              >
                {secondaryIcon}
                {secondaryLabel}
              </Link>
            </div>

            {detailsContent && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  className="text-xs text-[#94a1b2] underline decoration-[#94a1b2]/40 underline-offset-4 transition-colors hover:text-[#abd1c6]"
                >
                  {showDetails ? 'Скрыть подробности' : detailsToggleLabel}
                </button>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-black/25 p-3 text-left font-mono text-xs text-[#abd1c6]/90 break-all"
                  >
                    {detailsContent}
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
