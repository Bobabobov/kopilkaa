"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import AnimatedNumber from "@/components/home/AnimatedNumber";
import GlareHover from "@/components/ui/glare-hover";
import type { HeroStats } from "./hero-section/types";

const TRUST_ITEMS = [
  {
    text: "Рассматриваем вручную (до 2 дней)",
    icon: "Clock" as const,
  },
  {
    text: "Суммы небольшие (50–5000 ₽)",
    icon: "Coins" as const,
  },
  {
    text: "Это не займ — возвращать ничего не нужно",
    icon: "CheckCircle2" as const,
  },
];

interface HomeTrustAndStatsProps {
  stats: HeroStats;
  loading: boolean;
}

export default function HomeTrustAndStats({ stats, loading }: HomeTrustAndStatsProps) {
  return (
    <section className="relative py-16 px-4 sm:py-20 md:py-24" id="trust">
      <div className="pointer-events-none absolute right-8 top-8 h-48 w-48 rounded-full bg-[#f9bc60]/10 blur-[90px]" />
      <div className="w-full lg:pl-10 xl:pl-16">
        <motion.h2
          className="max-w-2xl text-left text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Почему нам можно доверять
        </motion.h2>
        <motion.p
          className="mt-3 max-w-xl text-left text-base text-[#abd1c6] sm:text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Без скрытых условий и обязательств
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:pr-16">
          {TRUST_ITEMS.map((item, i) => {
            const Icon =
              item.icon === "Clock"
                ? LucideIcons.Clock
                : item.icon === "Coins"
                  ? LucideIcons.Coins
                  : LucideIcons.CheckCircle2;
            const isFirst = i === 0;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Card
                  variant="glass"
                  padding="lg"
                  hoverable
                  className={`h-full text-left transition-all duration-300 ${
                    isFirst
                      ? "border-[#f9bc60]/40 bg-gradient-to-b from-[#f9bc60]/10 to-transparent shadow-lg shadow-[#f9bc60]/5"
                      : "border-[#abd1c6]/25 hover:border-[#f9bc60]/30 hover:shadow-xl hover:shadow-[#f9bc60]/5"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col items-start gap-4 py-2">
                      <div
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${
                          isFirst ? "bg-[#f9bc60]/25 ring-2 ring-[#f9bc60]/40" : "bg-[#f9bc60]/15"
                        }`}
                      >
                        {Icon && <Icon className="text-[#f9bc60]" size="md" />}
                      </div>
                      <p className="text-base font-semibold leading-snug text-[#fffffe] sm:text-lg">
                        {item.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-14 ml-auto lg:max-w-4xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GlareHover
            className="rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/60 px-6 py-8 backdrop-blur-sm sm:px-10"
            borderRadius="16px"
            borderColor="rgba(249, 188, 96, 0.25)"
            glareOpacity={0.2}
          >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
              <div className="text-left">
                <div className="text-xl font-semibold text-[#f9bc60] sm:text-2xl">
                  {loading ? "—" : (
                    <>
                      <AnimatedNumber value={stats.collected} /> ₽
                    </>
                  )}
                </div>
                <div className="mt-1 text-sm text-[#abd1c6]">В копилке</div>
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
                  {loading ? "—" : <AnimatedNumber value={stats.requests} />}
                </div>
                <div className="mt-1 text-sm text-[#abd1c6]">Историй</div>
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
                  {loading ? "—" : <AnimatedNumber value={stats.approved} />}
                </div>
                <div className="mt-1 text-sm text-[#abd1c6]">Выплачено</div>
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
                  {loading ? "—" : <AnimatedNumber value={stats.people} />}
                </div>
                <div className="mt-1 text-sm text-[#abd1c6]">Участников</div>
              </div>
            </div>
          </GlareHover>
        </motion.div>

        <div className="mt-8 flex justify-start lg:ml-auto lg:max-w-xs">
          <a
            href="#recent-applications"
            className="inline-flex items-center text-sm text-[#abd1c6] transition-colors hover:text-[#f9bc60]"
          >
            Смотреть истории дальше →
          </a>
        </div>
      </div>
    </section>
  );
}
