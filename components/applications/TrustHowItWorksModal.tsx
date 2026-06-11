"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { GlassModal } from "@/components/ui/GlassModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TrustHowItWorksModal({ open, onClose }: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      size="lg"
      zIndex={55}
      maxHeight="min(88dvh, 760px)"
      title="Как работает доверие"
      titleId="trust-how-it-works-title"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl py-3.5 text-sm font-semibold text-[#001e1d] transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            boxShadow: "0 8px 24px rgba(249, 188, 96, 0.2)",
          }}
        >
          Понятно
        </button>
      }
    >
      <p className="mb-4 text-sm text-[#abd1c6]">
        Ориентиры по поддержке зависят от подтверждённого участия в проекте.
      </p>

      <Card
        variant="darkGlass"
        padding="md"
        className="relative mb-4 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -right-6 -top-10 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-2xl"
          aria-hidden
        />
        <CardContent className="relative p-0">
          <div className="grid gap-3 text-sm leading-relaxed text-[#abd1c6]">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
              <span className="font-semibold text-[#f9bc60]">Важно:</span> нет
              автоматических выплат и гарантированных сумм.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
              <span className="font-semibold text-[#abd1c6]">
                Уровень доверия
              </span>{" "}
              — ориентир, а не обещание одобрения.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
              Формируется на основе{" "}
              <span className="font-semibold text-[#f9bc60]">
                подтверждённого участия
              </span>{" "}
              и качества заявок.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-center text-[11px] font-semibold"
          style={{ background: "rgba(249, 188, 96, 0.12)", color: "#f9bc60" }}
        >
          <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#f9bc60]" />
          Каждая заявка рассматривается индивидуально и может быть отклонена.
        </div>
      </div>
    </GlassModal>
  );
}

export default TrustHowItWorksModal;
