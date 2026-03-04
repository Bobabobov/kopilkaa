// components/heroes/HeroesHero.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";

export default function HeroesHero() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 md:pt-14 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto">
        <Card variant="darkGlass" padding="none" className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-[#f9bc60]/8 blur-3xl" aria-hidden />
            <div className="absolute -right-20 top-10 w-80 h-80 rounded-full bg-[#abd1c6]/8 blur-3xl" aria-hidden />
            <div className="absolute right-0 bottom-0 w-[520px] h-[520px] opacity-20">
              <Image src="/hero.png" alt="" fill sizes="(max-width: 768px) 50vw, 520px" className="object-contain object-right-bottom" priority={false} />
            </div>
          </div>

          <CardContent className="relative z-10 p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center">
              <div className="text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(249,188,96,0.15)", color: "#f9bc60" }}>
                  Сообщество и благодарность
                </span>

                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffffe] leading-tight">
                  Герои проекта
                  <span className="block text-[#f9bc60]">публичная витрина поддержки</span>
                </h1>

                <p className="mt-4 text-base sm:text-lg md:text-xl leading-relaxed text-[#abd1c6] max-w-2xl">
                  Здесь отображаются пользователи, которые <strong className="text-[#fffffe]">добровольно поддержали</strong> развитие платформы. Это форма благодарности и признания участия в проекте.
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 px-4 py-3 text-xs sm:text-sm text-[#abd1c6] leading-relaxed max-w-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  Участие в разделе «Герои проекта» — знак благодарности со стороны платформы. Поддержка не является финансовой услугой и не предполагает получения вознаграждения или иной выгоды.
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all hover:opacity-90"
                    style={{
                      background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                      color: "#001e1d",
                      boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                    }}
                  >
                    Поддержать проект
                  </Link>
                  <a
                    href="#heroes-list"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-xl border border-white/15 text-[#fffffe] hover:bg-white/10 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    Посмотреть героев
                  </a>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <Card variant="darkGlass" padding="md" className="relative">
                  <div className="text-sm text-[#94a1b2]">Быстрый переход</div>
                  <div className="mt-2 text-xl font-semibold text-[#fffffe]">
                    Поддержка → профиль → «Герои проекта»
                  </div>
                  <div className="mt-3 text-sm text-[#abd1c6] leading-relaxed">
                    Хотите, чтобы в карточке были соцсети? Добавьте их в профиле — они будут видны в разделе «Герои».
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Link href="/support" className="px-4 py-2 rounded-xl border border-white/10 text-[#abd1c6] hover:border-[#f9bc60]/30 hover:text-[#f9bc60] transition-colors text-sm font-semibold" style={{ background: "rgba(255,255,255,0.05)" }}>
                      Поддержать
                    </Link>
                    <Link href="/" className="px-4 py-2 rounded-xl border border-white/10 text-[#abd1c6] hover:bg-white/10 transition-colors text-sm font-semibold" style={{ background: "rgba(255,255,255,0.05)" }}>
                      На главную
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
