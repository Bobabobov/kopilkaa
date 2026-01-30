"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

export function TrustLevelsInfo() {
  return (
    <section className="space-y-5">
      <div className="space-y-1 text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe] tracking-tight">
          Уровни доверия в Копилке
        </h2>
        <p className="text-sm text-[#dceee6] font-medium">
          Ориентиры по поддержке зависят от подтверждённого участия в проекте
        </p>
        <p className="text-xs text-[#b5cfc5]">
          Уровень доверия формируется автоматически и может пересматриваться.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#2c4f45]/60 bg-gradient-to-br from-[#0b2a24]/95 via-[#0b2a24]/75 to-[#0f3b30]/70 backdrop-blur-sm p-5 sm:p-6 shadow-[0_16px_36px_-24px_rgba(0,0,0,0.55)]">
        <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-[#f9bc60]/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-[#abd1c6]/15 blur-2xl" />

        <div className="flex items-center gap-2 text-sm text-[#e8f4ef] font-semibold">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f9bc60]/20 text-[#f9bc60] shadow-[0_0_12px_rgba(249,188,96,0.25)]">
            <LucideIcons.Info size="xs" />
          </span>
          Как работает доверие
        </div>
        <div className="mt-4 grid gap-3 text-sm text-[#d7e9e1] leading-relaxed">
          <div className="rounded-xl border border-[#f9bc60]/25 bg-[#0a2b24]/80 px-3.5 py-2.5 shadow-[0_8px_16px_-16px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#f9bc60]/60 hover:shadow-[0_12px_24px_-16px_rgba(249,188,96,0.4)]">
            <span className="font-semibold text-[#f9bc60]">Важно:</span> нет
            автоматических выплат и гарантированных сумм.
          </div>
          <div className="rounded-xl border border-[#abd1c6]/20 bg-[#0a2b24]/70 px-3.5 py-2.5 shadow-[0_8px_16px_-16px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#abd1c6]/50">
            <span className="font-semibold text-[#abd1c6]">Уровень доверия</span>{" "}
            — ориентир, а не обещание одобрения.
          </div>
          <div className="rounded-xl border border-[#8bd3dd]/20 bg-[#0a2b24]/70 px-3.5 py-2.5 shadow-[0_8px_16px_-16px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#8bd3dd]/50">
            Формируется на основе <span className="text-[#f9bc60] font-semibold">
            подтверждённого участия
            </span> и качества заявок.
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-3 py-0.5 text-[11px] text-[#f9bc60] font-semibold">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#f9bc60]" />
          Каждая заявка рассматривается индивидуально и может быть отклонена.
        </div>
      </div>
    </section>
  );
}

export default TrustLevelsInfo;
