'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useKopiTourState } from '@/components/kopi/KopiTourContext';
import { useTourSpotlight } from '@/hooks/kopi/useTourSpotlight';

const SPOTLIGHT_PADDING = 12;

function SpotlightCorners() {
  const cornerClass =
    'absolute h-4 w-4 border-[#f9bc60] sm:h-5 sm:w-5';

  return (
    <>
      <span className={cn(cornerClass, 'left-0 top-0 border-l-2 border-t-2 rounded-tl-lg')} />
      <span className={cn(cornerClass, 'right-0 top-0 border-r-2 border-t-2 rounded-tr-lg')} />
      <span className={cn(cornerClass, 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg')} />
      <span className={cn(cornerClass, 'right-0 bottom-0 border-b-2 border-r-2 rounded-br-lg')} />
    </>
  );
}

export default function KopiTourSpotlight() {
  const reducedMotion = useReducedMotion();
  const { isTourActive, tourActiveView } = useKopiTourState();
  const { rect, isTargetFound } = useTourSpotlight(
    isTourActive,
    tourActiveView?.target,
    tourActiveView?.segmentId,
    SPOTLIGHT_PADDING,
  );

  return (
    <AnimatePresence>
      {isTourActive && (
        <motion.div
          key="kopi-tour-spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.28 }}
          className="pointer-events-none fixed inset-0 z-[110]"
          aria-hidden
        >
          {!isTargetFound && (
            <div className="absolute inset-0 bg-[#001e1d]/55 backdrop-blur-[2px]" />
          )}

          <AnimatePresence mode="wait">
            {rect && isTargetFound && (
              <motion.div
                key={tourActiveView?.segmentId ?? 'tour-spotlight'}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.98 }
                }
                transition={
                  reducedMotion
                    ? { duration: 0.15 }
                    : { type: 'spring', stiffness: 320, damping: 30 }
                }
                className="absolute"
                style={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                }}
              >
                {/* Затемнение вокруг «окна» */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-[#f9bc60]/90 bg-transparent sm:rounded-3xl"
                  style={{
                    boxShadow:
                      '0 0 0 9999px rgba(0, 30, 29, 0.72), 0 0 32px rgba(249, 188, 96, 0.22), inset 0 0 24px rgba(249, 188, 96, 0.06)',
                  }}
                />

                {/* Пульсирующее кольцо */}
                {!reducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-[#f9bc60]/45 sm:rounded-3xl"
                    animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.015, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                <SpotlightCorners />

                {tourActiveView?.badge && (
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.12 }}
                    className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-[#f9bc60]/40 bg-[#001e1d]/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#f9bc60] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:text-[13px]"
                  >
                    {tourActiveView.badge}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
