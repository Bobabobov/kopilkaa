'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, Gift, X } from 'lucide-react';
import { useDailyBonusStatus } from '@/hooks/profile/useDailyBonusStatus';
import { DAILY_BONUS_CLAIMED_EVENT } from '@/lib/dailyBonus/events';
import { cn } from '@/lib/utils';

const DISMISS_STORAGE_PREFIX = 'daily-bonus-reminder-dismissed';

function getDismissStorageKey(): string {
  const dayKey = new Date().toISOString().slice(0, 10);
  return `${DISMISS_STORAGE_PREFIX}-${dayKey}`;
}

function isReminderDismissedToday(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(getDismissStorageKey()) === '1';
}

function dismissReminderForToday(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getDismissStorageKey(), '1');
}

const formatBonuses = (value: number): string =>
  new Intl.NumberFormat('ru-RU').format(value);

export function ProfileDailyBonusReminder() {
  const { data, loading } = useDailyBonusStatus();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(isReminderDismissedToday());
  }, []);

  useEffect(() => {
    const hide = () => setDismissed(true);
    window.addEventListener(DAILY_BONUS_CLAIMED_EVENT, hide);
    return () => window.removeEventListener(DAILY_BONUS_CLAIMED_EVENT, hide);
  }, []);

  const scrollToBonus = useCallback(() => {
    document.getElementById('profile-daily-bonus')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const handleDismiss = () => {
    dismissReminderForToday();
    setDismissed(true);
  };

  const isAvailable = Boolean(data?.canClaim && !data.claimedToday);
  const visible = !loading && !dismissed && isAvailable;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative overflow-hidden rounded-2xl border border-[#f9bc60]/35',
            'bg-gradient-to-r from-[#f9bc60]/14 via-[#004643]/50 to-emerald-950/40',
            'px-3.5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.28)] sm:px-4 sm:py-3.5',
          )}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-2xl"
            aria-hidden
          />

          <div className="relative flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60] shadow-[0_0_20px_rgba(249,188,96,0.15)]"
              aria-hidden
            >
              <Gift className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#fffffe]">
                Ежедневный бонус доступен
              </p>
              <p className="mt-0.5 text-xs leading-snug text-[#abd1c6]/80">
                Заберите +{formatBonuses(data?.dailyBonus ?? 0)} бонусов сегодня
                {data && data.currentStreak > 0
                  ? ` · серия ${formatBonuses(data.currentStreak)} дн.`
                  : ''}
              </p>

              <button
                type="button"
                onClick={scrollToBonus}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#f9bc60]/35 bg-[#f9bc60]/12 px-3 py-1.5 text-xs font-semibold text-[#f9bc60] transition-colors hover:border-[#f9bc60]/55 hover:bg-[#f9bc60]/20"
              >
                Перейти к бонусу
                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="shrink-0 rounded-lg p-1.5 text-[#abd1c6]/50 transition-colors hover:bg-white/5 hover:text-[#abd1c6]"
              aria-label="Скрыть напоминание на сегодня"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
