'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useKopiTourState } from '@/components/kopi/KopiTourContext';
import {
  hasCookieConsent,
  setCookieConsentAccepted,
} from '@/lib/cookieConsent';
import {
  hasCompletedTour,
  KOPI_TOUR_FINISHED_EVENT,
  shouldDeferCookieBannerForGuest,
} from '@/lib/kopi/tourStorage';
import { usePathname } from 'next/navigation';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { authLoading: kopiAuthLoading, isTourActive, showInviteModal } =
    useKopiTourState();

  const [needsConsent, setNeedsConsent] = useState(() => !hasCookieConsent());
  const [tourResolved, setTourResolved] = useState(() => hasCompletedTour());

  useEffect(() => {
    const onTourFinished = () => setTourResolved(true);
    window.addEventListener(KOPI_TOUR_FINISHED_EVENT, onTourFinished);
    return () =>
      window.removeEventListener(KOPI_TOUR_FINISHED_EVENT, onTourFinished);
  }, []);

  const handleAccept = useCallback(() => {
    setCookieConsentAccepted();
    setNeedsConsent(false);
  }, []);

  const authReady = !authLoading && !kopiAuthLoading;
  const blockedByTourUi = isTourActive || showInviteModal;
  const canShowAfterTour =
    isAuthenticated ||
    tourResolved ||
    !shouldDeferCookieBannerForGuest(pathname);

  const isVisible =
    needsConsent && authReady && !blockedByTourUi && canShowAfterTour;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cookie-consent"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed top-3 right-3 z-[110] w-[min(calc(100vw-1.5rem),21rem)] sm:top-5 sm:right-5 sm:w-[23rem]"
        >
          <div className="overflow-hidden rounded-2xl border border-[#f9bc60]/20 bg-[linear-gradient(165deg,rgba(0,78,67,0.96)_0%,rgba(0,30,29,0.98)_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-2xl" />

            <div className="relative p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/30 bg-[#004643]/70 text-[#f9bc60]">
                  <Cookie className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    id="cookie-consent-title"
                    className="text-sm font-bold leading-snug text-[#fffffe]"
                  >
                    Мы используем cookie
                  </p>
                  <p
                    id="cookie-consent-desc"
                    className="mt-1.5 text-xs leading-relaxed text-[#abd1c6]"
                  >
                    Они помогают сайту работать стабильно и понимать, что
                    улучшить. Без них было бы хуже.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-xl bg-[#f9bc60] px-4 text-sm font-bold text-[#001e1d] transition-opacity hover:opacity-95"
                >
                  Хорошо, понятно
                </button>
                <Link
                  href="/cookies"
                  className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-xl border border-[#abd1c6]/25 bg-white/5 px-4 text-sm font-semibold text-[#abd1c6] transition-colors hover:bg-white/10"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
