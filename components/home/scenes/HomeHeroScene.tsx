"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DonateButton from "@/components/donate/DonateButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import GlareHover from "@/components/ui/glare-hover";
import AnimatedNumber from "@/components/home/AnimatedNumber";
import type { HeroStats } from "@/components/home/hero-section/types";

interface HomeHeroSceneProps {
  stats: HeroStats;
  loading: boolean;
}

export default function HomeHeroScene({ stats, loading }: HomeHeroSceneProps) {
  return (
    <section
      className="relative min-h-[90vh] overflow-hidden px-4 pt-20 pb-16 sm:pt-24 sm:pb-20"
      aria-label="Главный экран"
    >
      <BackgroundBeams className="opacity-45" />
      <Spotlight fill="#f9bc60" className="opacity-90" />
      <div className="pointer-events-none absolute -left-32 top-6 h-80 w-80 rounded-full bg-[#f9bc60]/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-[#abd1c6]/10 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f9bc60]/10 to-transparent blur-[80px]" />
      <motion.div
        className="pointer-events-none absolute left-8 top-36 h-16 w-16 rounded-2xl border border-[#f9bc60]/30 bg-[#f9bc60]/10 backdrop-blur-sm"
        animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-20 top-40 h-12 w-12 rounded-full border border-[#abd1c6]/30 bg-[#abd1c6]/10 backdrop-blur-sm"
        animate={{ y: [0, 14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-10 bottom-16 h-20 w-20 rounded-3xl border border-[#f9bc60]/20 bg-[#f9bc60]/10 blur-[1px]"
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 55% 35%, transparent 35%, rgba(0, 30, 29, 0.35) 100%),
            linear-gradient(to bottom, rgba(0, 70, 67, 0.1) 0%, rgba(0, 70, 67, 0.55) 80%, #004643 100%)
          `,
        }}
      />

      <div className="relative z-10 grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(320px,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:pl-10 xl:pl-20"
        >
          <Badge className="bg-[#f9bc60]/15 text-[#f9bc60]">Новая сцена</Badge>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
            Платформа взаимной помощи
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#fffffe] sm:text-5xl lg:text-6xl">
            Расскажи свою историю —{" "}
            <span className="text-[#f9bc60]">получи шанс на поддержку</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[#abd1c6] sm:text-xl">
            «Копилка» — независимая платформа: мы читаем истории и принимаем
            решения самостоятельно.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="w-full rounded-2xl border-0 px-8 py-6 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                color: "#001e1d",
                boxShadow: "0 16px 48px rgba(249, 188, 96, 0.35)",
              }}
            >
              <Link href="/applications">Рассказать историю</Link>
            </Button>
            <DonateButton variant="secondary" className="w-full sm:w-auto" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="rounded-xl px-4 py-2 text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
            >
              <Link href="/stories">Смотреть истории</Link>
            </Button>
            <span
              className="hidden h-1 w-1 rounded-full bg-[#abd1c6]/50 sm:inline-block"
              aria-hidden
            />
            <Button
              variant="ghost"
              asChild
              className="rounded-xl px-4 py-2 text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
            >
              <a href="#how-it-works">Как это работает</a>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-[#abd1c6] sm:grid-cols-3 sm:max-w-xl">
            <div className="flex items-center gap-2 rounded-full border border-[#f9bc60]/20 bg-[#001e1d]/50 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9bc60]" />
              Рассматриваем вручную
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#f9bc60]/20 bg-[#001e1d]/50 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9bc60]" />
              Суммы 50–5000 ₽
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#f9bc60]/20 bg-[#001e1d]/50 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9bc60]" />
              Без возврата
            </div>
          </div>

          <p className="mt-6 max-w-lg rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94a1b2] md:text-base">
            Решение не гарантировано. Помогаем честно и по возможности.
          </p>
        </motion.div>

        <div className="relative lg:pr-10 xl:pr-16 lg:translate-y-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <GlareHover
              className="w-full rounded-3xl border border-[#abd1c6]/25 bg-[#001e1d]/70 p-8 text-left shadow-xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              borderRadius="24px"
              borderColor="rgba(249, 188, 96, 0.35)"
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
                    Статус копилки
                  </p>
                  <Badge className="mt-3 bg-[#f9bc60]/20 text-[#f9bc60]">В реальном времени</Badge>
                  <div className="mt-2 text-3xl font-bold text-[#f9bc60] sm:text-4xl">
                    {loading ? "—" : (
                      <>
                        <AnimatedNumber value={stats.collected} /> ₽
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#abd1c6]">
                    доступно для помощи
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-[#fffffe]">
                      {loading ? "—" : <AnimatedNumber value={stats.requests} />}
                    </div>
                    <div className="text-xs text-[#abd1c6]">историй</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#fffffe]">
                      {loading ? "—" : <AnimatedNumber value={stats.approved} />}
                    </div>
                    <div className="text-xs text-[#abd1c6]">выплачено</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#fffffe]">
                      {loading ? "—" : <AnimatedNumber value={stats.people} />}
                    </div>
                    <div className="text-xs text-[#abd1c6]">участников</div>
                  </div>
                </div>
              </div>
            </GlareHover>
          </motion.div>

          <motion.div
            className="absolute -left-10 -bottom-10 hidden w-[85%] rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/60 p-5 text-left shadow-lg backdrop-blur-sm lg:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
              Быстрое резюме
            </p>
            <p className="mt-2 text-sm text-[#abd1c6]">
              Подача истории занимает несколько минут. Ответ — в течение 2 дней.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
