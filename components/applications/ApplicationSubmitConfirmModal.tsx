"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { GlassModal } from "@/components/ui/GlassModal";
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
  const reducedMotion = useReducedMotion();
  const busy = submitting || uploading;

  return (
    <GlassModal
      open={isOpen}
      onClose={onClose}
      size="md"
      align="end"
      zIndex={70}
      hideHeader
      showCloseButton={false}
      closeOnBackdropClick={!busy}
      bodyClassName="p-0"
      ariaLabelledBy="application-submit-confirm-title"
      ariaDescribedBy="application-submit-confirm-desc"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <motion.button
            type="button"
            disabled={busy}
            onClick={onClose}
            whileHover={reducedMotion || busy ? undefined : { scale: 1.01 }}
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
            whileHover={reducedMotion || busy ? undefined : { scale: 1.02 }}
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
      }
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
              Проверьте, что категория и файлы совпадают со шагом «Фото» — так
              рассмотрение пройдёт без лишних вопросов.
            </p>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}
