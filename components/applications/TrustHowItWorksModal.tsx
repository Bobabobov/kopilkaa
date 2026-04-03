"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TrustHowItWorksModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-how-it-works-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#001e1d]/80 backdrop-blur-md"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={cn(
          "relative w-full max-w-lg max-h-[88vh] sm:max-h-[85vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px]",
          "border border-white/10 bg-gradient-to-br from-[#0b2a24] via-[#062320] to-[#001e1d]",
          "shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-5 sm:p-6",
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2
            id="trust-how-it-works-title"
            className="text-lg sm:text-xl font-semibold text-[#fffffe] pr-2"
          >
            Как работает доверие
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-[#abd1c6] hover:bg-white/10 hover:text-[#fffffe] transition-colors"
            aria-label="Закрыть"
          >
            <LucideIcons.X size="sm" />
          </button>
        </div>

        <p className="text-sm text-[#abd1c6] mb-4">
          Ориентиры по поддержке зависят от подтверждённого участия в проекте.
        </p>

        <Card variant="darkGlass" padding="md" className="relative overflow-hidden mb-4">
          <div
            className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-2xl pointer-events-none"
            aria-hidden
          />
          <CardContent className="relative p-0">
            <div className="grid gap-3 text-sm text-[#abd1c6] leading-relaxed">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                <span className="font-semibold text-[#f9bc60]">Важно:</span> нет
                автоматических выплат и гарантированных сумм.
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                <span className="font-semibold text-[#abd1c6]">Уровень доверия</span>{" "}
                — ориентир, а не обещание одобрения.
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                Формируется на основе{" "}
                <span className="text-[#f9bc60] font-semibold">
                  подтверждённого участия
                </span>{" "}
                и качества заявок.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-center"
            style={{ background: "rgba(249, 188, 96, 0.12)", color: "#f9bc60" }}
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#f9bc60] shrink-0" />
            Каждая заявка рассматривается индивидуально и может быть отклонена.
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-[#001e1d] transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            boxShadow: "0 8px 24px rgba(249, 188, 96, 0.2)",
          }}
        >
          Понятно
        </button>
      </motion.div>
    </motion.div>
  );
}

export default TrustHowItWorksModal;
