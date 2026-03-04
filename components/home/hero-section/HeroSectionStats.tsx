"use client";

import { motion } from "framer-motion";
import { BookOpen, Banknote, Users, PiggyBank } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";
import type { HeroStats } from "./types";

interface HeroSectionStatsProps {
  stats: HeroStats;
  loading: boolean;
}

const subStats = [
  {
    key: "requests" as const,
    label: "Историй",
    icon: BookOpen,
    description: "подано заявок",
  },
  {
    key: "approved" as const,
    label: "Выплачено",
    icon: Banknote,
    description: "одобрено заявок",
  },
  {
    key: "people" as const,
    label: "Участников",
    icon: Users,
    description: "в проекте",
  },
];

export function HeroSectionStats({ stats, loading }: HeroSectionStatsProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#fffffe] tracking-tight mb-6 text-center">
            Статистика
          </h2>

          <motion.div
            className="mb-6 pb-6 border-b border-white/10"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <PiggyBank className="w-5 h-5 text-[#f9bc60]" aria-hidden />
                <span
                  className="text-3xl sm:text-4xl font-bold tabular-nums"
                  style={{ color: "#f9bc60" }}
                >
                  {loading ? (
                    "0 ₽"
                  ) : (
                    <>
                      <AnimatedNumber value={stats.collected} /> ₽
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#abd1c6" }}>
                Всего в копилке · эти средства идут на помощь
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {subStats.map((item, index) => (
              <motion.div
                key={item.key}
                className="group text-center rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2.5 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <item.icon className="w-5 h-5" />
                </span>
                <div
                  className="text-xl font-bold tabular-nums mb-0.5"
                  style={{ color: "#fffffe" }}
                >
                  {loading ? "0" : <AnimatedNumber value={stats[item.key]} />}
                </div>
                <div className="text-sm font-medium" style={{ color: "#abd1c6" }}>
                  {item.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#94a1b2" }}>
                  {item.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
