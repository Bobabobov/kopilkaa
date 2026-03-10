"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";

export default function PageHeader() {
  return (
    <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
      <div className="mb-10">
        <Card variant="darkGlass" padding="lg" className="relative overflow-hidden text-center">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#f9bc60]/10 blur-3xl pointer-events-none" aria-hidden />
          <div className="hidden sm:block absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#abd1c6]/8 blur-3xl pointer-events-none" aria-hidden />
          <CardContent className="relative py-8 sm:py-10 px-5 sm:px-8">
            <div
              className="mx-auto mb-4 inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f9bc60]/25 text-[#001e1d]">
                <LucideIcons.FileText size="sm" />
              </span>
              Подача заявки
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#f9bc60] bg-clip-text text-transparent">
              Расскажите свою историю
            </h1>

            <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-[#abd1c6]">
              Платформа рассмотрит заявку и примет решение о финансовой поддержке.
              <br />
              <span className="text-[#f9bc60] font-semibold">
                Чем понятнее и честнее вы опишете ситуацию, тем проще принять
                решение.
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
