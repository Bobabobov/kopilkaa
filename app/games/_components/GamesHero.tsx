"use client";

import { motion } from "framer-motion";
import { Gamepad2, Trophy, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const TITLE = "Игры";

export function GamesHero() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto">
        <Card variant="darkGlass" padding="lg" className="relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,400px)] h-48 rounded-full blur-3xl pointer-events-none opacity-60" style={{ background: "rgba(249,188,96,0.12)" }} aria-hidden />
          <CardContent className="relative py-8 sm:py-10 px-4 sm:px-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#f9bc60" }}
            >
              <motion.span className="text-base inline-block" aria-hidden animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.span>
              Игровая зона
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#fffffe] tracking-tight flex flex-wrap justify-center gap-1 sm:gap-2">
              {TITLE.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05, type: "spring", stiffness: 150 }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.35 }} className="mt-5 flex justify-center">
              <span className="h-px w-16 rounded-full bg-white/20" aria-hidden />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="mt-5 text-lg text-[#abd1c6] max-w-xl mx-auto"
            >
              Играйте, соревнуйтесь и попадайте в еженедельный топ
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: "rgba(249,188,96,0.12)", color: "#f9bc60" }}>
                <Trophy className="w-4 h-4 flex-shrink-0" aria-hidden /> Топ недели
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[#94a1b2]" style={{ background: "rgba(255,255,255,0.06)" }}>
                <Timer className="w-4 h-4 flex-shrink-0" aria-hidden /> 1 зачётная попытка в неделю
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
