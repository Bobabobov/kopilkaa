"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "../AnimatedNumber";
import type { HeroStats } from "./types";

interface HeroSectionStatsProps {
  stats: HeroStats;
  loading: boolean;
}

export function HeroSectionStats({ stats, loading }: HeroSectionStatsProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#fffffe]">
          Статистика
        </h2>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: "#f9bc60" }}
          >
            {loading ? (
              "₽ 0"
            ) : (
              <>
                ₽ <AnimatedNumber value={stats.collected} />
              </>
            )}
          </div>
          <p className="text-lg" style={{ color: "#abd1c6" }}>
            Всего в копилке
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#fffffe" }}
            >
              {loading ? "0" : <AnimatedNumber value={stats.requests} />}
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              Историй
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#fffffe" }}
            >
              {loading ? "0" : <AnimatedNumber value={stats.approved} />}
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              Выплачено
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#fffffe" }}
            >
              {loading ? "0" : <AnimatedNumber value={stats.people} />}
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              Участников
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
