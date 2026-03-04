"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";

export function TrustLevelsInfo() {
  return (
    <section className="space-y-5">
      <div className="space-y-1 text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe] tracking-tight">
          Уровни доверия в Копилке
        </h2>
        <p className="text-sm text-[#abd1c6] font-medium">
          Ориентиры по поддержке зависят от подтверждённого участия в проекте
        </p>
        <p className="text-xs text-[#94a1b2]">
          Уровень доверия формируется автоматически и может пересматриваться.
        </p>
      </div>

      <Card variant="darkGlass" padding="md" className="relative overflow-hidden">
        <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-2xl pointer-events-none" aria-hidden />
        <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-[#abd1c6]/10 blur-2xl pointer-events-none" aria-hidden />
        <CardContent className="relative">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#fffffe]">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "rgba(249, 188, 96, 0.2)" }}
            >
              <LucideIcons.Info size="xs" className="text-[#f9bc60]" />
            </span>
            Как работает доверие
          </div>
          <div className="mt-4 grid gap-3 text-sm text-[#abd1c6] leading-relaxed">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition-all hover:border-[#f9bc60]/30">
              <span className="font-semibold text-[#f9bc60]">Важно:</span> нет
              автоматических выплат и гарантированных сумм.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition-all hover:border-white/15">
              <span className="font-semibold text-[#abd1c6]">Уровень доверия</span>{" "}
              — ориентир, а не обещание одобрения.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition-all hover:border-white/15">
              Формируется на основе <span className="text-[#f9bc60] font-semibold">
              подтверждённого участия
              </span> и качества заявок.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold"
          style={{ background: "rgba(249, 188, 96, 0.12)", color: "#f9bc60" }}
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#f9bc60]" />
          Каждая заявка рассматривается индивидуально и может быть отклонена.
        </div>
      </div>
    </section>
  );
}

export default TrustLevelsInfo;
