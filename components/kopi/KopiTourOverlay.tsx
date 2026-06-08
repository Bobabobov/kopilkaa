'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  Home,
  Star,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useKopiTourActions, useKopiTourState } from '@/components/kopi/KopiTourContext';
import { KopiTourProgressBar } from '@/components/kopi/KopiTourCenterShell';
import {
  KOPI_TOUR_STEP_COUNT,
  KOPI_TOUR_STEPS,
  getTourStepHeadline,
  getTourStepHighlight,
} from '@/lib/kopi/tourSteps';
import { shouldShowMobileBottomNav } from '@/lib/navigation/mobileBottomNav';
import { useTourPanelPeekThrough } from '@/hooks/kopi/useTourPanelPeekThrough';
import { usePathname } from 'next/navigation';

const HIGHLIGHT_PATTERN = /(\*\*[^*]+\*\*)/g;

const STEP_ICONS = {
  welcome: Home,
  stories: BookOpen,
  applications: ClipboardList,
  reviews: Star,
  profile: User,
} as const;

function renderHighlight(text: string) {
  return text.split(HIGHLIGHT_PATTERN).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong
          key={`accent-${index}`}
          className="font-semibold text-[#f9bc60]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={`text-${index}`}>{part}</Fragment>;
  });
}

export default function KopiTourOverlay() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const hasBottomNav = shouldShowMobileBottomNav(pathname);
  const { isTourActive, tourStepIndex, tourProgress, isGuest } =
    useKopiTourState();
  const { nextTourStep, prevTourStep, skipTour, finishTour } =
    useKopiTourActions();

  const step = KOPI_TOUR_STEPS[tourStepIndex];
  const atFirst = tourStepIndex === 0;
  const atLast = tourStepIndex >= KOPI_TOUR_STEP_COUNT - 1;
  const StepIcon = step ? STEP_ICONS[step.id as keyof typeof STEP_ICONS] ?? Home : Home;
  const headline = step ? getTourStepHeadline(step, isGuest) : '';
  const { isPeekMode, panelInteractionProps } = useTourPanelPeekThrough(
    isTourActive,
    step?.id,
  );

  return (
    <AnimatePresence>
      {isTourActive && step && (
        <div
          className={cn(
            'pointer-events-none fixed inset-x-0 z-[115] flex justify-center px-3 sm:px-4',
            hasBottomNav ? 'bottom-[var(--bottom-nav-offset)]' : 'bottom-0',
            'pb-3 sm:pb-5',
          )}
          aria-live="polite"
        >
          <motion.div
            key="kopi-tour-dock"
            role="dialog"
            aria-modal="false"
            aria-labelledby="kopi-tour-headline"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{
              opacity: reducedMotion ? 1 : isPeekMode ? 0.14 : 1,
              y: 0,
            }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={
              reducedMotion
                ? { duration: 0.18 }
                : {
                    opacity: { duration: 0.22, ease: 'easeOut' },
                    y: { type: 'spring', stiffness: 360, damping: 34 },
                  }
            }
            {...panelInteractionProps}
            className={cn(
              'relative w-full max-w-3xl overflow-hidden rounded-3xl border shadow-[0_20px_56px_rgba(0,0,0,0.32)] transition-[backdrop-filter,background-color,border-color,box-shadow] duration-200 lg:max-w-4xl',
              isPeekMode
                ? 'pointer-events-none border-[#f9bc60]/10 bg-[linear-gradient(160deg,rgba(0,78,67,0.28)_0%,rgba(0,30,29,0.32)_100%)] shadow-none backdrop-blur-[2px]'
                : 'pointer-events-auto border-[#f9bc60]/25 bg-[linear-gradient(160deg,rgba(0,78,67,0.94)_0%,rgba(0,30,29,0.96)_100%)] backdrop-blur-xl',
            )}
          >
            <KopiTourProgressBar progress={tourProgress} />

            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#f9bc60]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-[#abd1c6]/10 blur-3xl" />

            <div className="relative flex items-center justify-between gap-3 px-5 pb-2 pt-4 sm:px-7 sm:pt-5">
              <p className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#f9bc60] sm:block">
                Шаг {tourStepIndex + 1} из {KOPI_TOUR_STEP_COUNT} · {step.headerTitle}
              </p>
              <span className="sm:hidden" aria-hidden />
              <button
                type="button"
                onClick={skipTour}
                className="-mr-1 shrink-0 rounded-lg p-2 text-[#abd1c6]/80 transition-colors hover:bg-white/10 hover:text-[#fffffe]"
                aria-label="Пропустить экскурсию"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-col gap-5 px-5 pb-5 sm:flex-row sm:items-center sm:gap-7 sm:px-7 sm:pb-7">
              <div className="flex items-center gap-4 sm:shrink-0">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#f9bc60]/35 bg-[#004643]/70 shadow-[0_0_24px_rgba(249,188,96,0.12)] sm:h-20 sm:w-20 sm:rounded-3xl">
                  <Image
                    src="/FAQ.png"
                    alt=""
                    width={64}
                    height={64}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#f9bc60]/40 bg-[#001e1d] text-[#f9bc60]">
                    <StepIcon className="h-4 w-4" />
                  </span>
                </div>

                <div className="min-w-0 sm:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f9bc60]">
                    Шаг {tourStepIndex + 1} из {KOPI_TOUR_STEP_COUNT}
                  </p>
                  <p className="truncate pr-2 text-base font-semibold text-[#fffffe]">
                    {step.headerTitle}
                  </p>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step.id}
                    initial={reducedMotion ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2
                      id="kopi-tour-headline"
                      className="text-balance text-lg font-bold leading-snug text-[#fffffe] sm:text-xl"
                    >
                      {headline}
                    </h2>
                    <p className="mt-2 text-pretty text-[15px] leading-relaxed text-[#abd1c6] sm:text-base">
                      {renderHighlight(getTourStepHighlight(step, isGuest))}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex shrink-0 gap-2.5 sm:gap-3">
                <motion.button
                  type="button"
                  onClick={prevTourStep}
                  disabled={atFirst}
                  whileTap={atFirst || reducedMotion ? undefined : { scale: 0.98 }}
                  className={cn(
                    'inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#abd1c6]/25 px-4 text-sm font-semibold text-[#abd1c6] transition-colors hover:bg-white/5 sm:min-w-[124px] sm:flex-none sm:min-h-[48px] sm:px-5',
                    atFirst && 'pointer-events-none opacity-35',
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </motion.button>

                {atLast ? (
                  <motion.button
                    type="button"
                    onClick={finishTour}
                    whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#f9bc60] px-4 text-sm font-bold text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.28)] transition-opacity hover:opacity-95 sm:min-w-[148px] sm:flex-none sm:min-h-[48px] sm:px-5"
                  >
                    <Check className="h-4 w-4" />
                    Завершить
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={nextTourStep}
                    whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#f9bc60] px-4 text-sm font-bold text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.28)] transition-opacity hover:opacity-95 sm:min-w-[136px] sm:flex-none sm:min-h-[48px] sm:px-5"
                  >
                    Далее
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
