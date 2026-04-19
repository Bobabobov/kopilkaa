"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  submitting: boolean;
  uploading: boolean;
};

export default function ApplicationSubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  submitting,
  uploading,
}: Props) {
  const isBrowser = typeof window !== "undefined";
  const reducedMotion = useReducedMotion();
  const busy = submitting || uploading;

  useEffect(() => {
    if (!isOpen || !isBrowser) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose, isBrowser]);

  if (!isBrowser) return null;

  const backdropTransition = reducedMotion
    ? { duration: 0.01 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  const panelTransition = reducedMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 380, damping: 32 };

  const modal = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-submit-confirm-title"
          aria-describedby="application-submit-confirm-desc"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={backdropTransition}
            className="absolute inset-0 bg-[#001e1d]/55 backdrop-blur-[4px]"
            onClick={() => !busy && onClose()}
            aria-hidden
          />

          <motion.div
            initial={
              reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.99 }}
            transition={panelTransition}
            className={cn(
              "relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border shadow-xl",
              "border-[#abd1c6]/25 bg-[#004643]/92 backdrop-blur-md",
              "ring-1 ring-white/[0.06]",
            )}
          >
            <div className="border-b border-[#abd1c6]/15 px-5 pb-5 pt-6 sm:px-6">
              <div className="flex gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/18 text-[#f9bc60]"
                  aria-hidden
                >
                  <LucideIcons.Send size="md" className="shrink-0 opacity-95" />
                </div>
                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#abd1c6]/85">
                    Подача заявки
                  </p>
                  <h2
                    id="application-submit-confirm-title"
                    className="text-lg font-semibold leading-snug tracking-tight text-[#fffffe] sm:text-xl"
                  >
                    Отправить заявку?
                  </h2>
                  <p
                    id="application-submit-confirm-desc"
                    className="text-[15px] leading-relaxed text-[#abd1c6]"
                  >
                    Проверьте, что категория и файлы совпадают со шагом «Фото» —
                    так рассмотрение пройдёт без лишних вопросов.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#abd1c6]/15 bg-[#003732]/55 px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-5 sm:py-4">
              <motion.button
                type="button"
                disabled={busy}
                onClick={onClose}
                whileHover={
                  reducedMotion || busy ? undefined : { scale: 1.01 }
                }
                whileTap={reducedMotion || busy ? undefined : { scale: 0.99 }}
                className={cn(
                  "min-h-[46px] w-full rounded-xl px-5 text-sm font-semibold transition-colors sm:min-w-[140px] sm:w-auto",
                  "border border-[#abd1c6]/35 bg-transparent text-[#abd1c6] hover:bg-white/[0.06]",
                  busy && "pointer-events-none opacity-40",
                )}
              >
                Перепроверить
              </motion.button>
              <motion.button
                type="button"
                disabled={busy}
                onClick={() => void onConfirm()}
                whileHover={
                  reducedMotion || busy ? undefined : { scale: 1.02 }
                }
                whileTap={reducedMotion || busy ? undefined : { scale: 0.98 }}
                className={cn(
                  "min-h-[46px] w-full rounded-xl px-6 text-sm font-bold text-[#001e1d] sm:w-auto",
                  "bg-[#f9bc60] shadow-[0_8px_24px_rgba(249,188,96,0.22)] hover:brightness-[1.03]",
                  busy && "opacity-65",
                )}
              >
                {busy ? "Отправка…" : "Отправить"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
