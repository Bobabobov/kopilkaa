"use client";

import { BookOpen, Banknote, Users, PiggyBank } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import AnimatedNumber from "../AnimatedNumber";
import type { HeroStats } from "./types";

interface HeroSectionStatsProps {
  stats: HeroStats;
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

const contentEase = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: contentEase },
  },
};

const gridVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: contentEase,
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

const miniCardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: contentEase },
  },
};

export function HeroSectionStats({ stats }: HeroSectionStatsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="max-w-3xl mx-auto">
      <Card
        variant="darkGlass"
        padding="none"
        className="relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
      >
        {/* Декор: мягкие «блобы» (анимация отключается при prefers-reduced-motion) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute -top-16 -right-20 h-56 w-56 rounded-full bg-[#f9bc60]/[0.12] blur-xl md:blur-3xl sm:h-72 sm:w-72"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.12, 1],
                    opacity: [0.35, 0.5, 0.35],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 9, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.div
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#abd1c6]/[0.08] blur-xl md:blur-3xl sm:h-80 sm:w-80"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1.08, 1, 1.08],
                    x: [0, 12, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 11, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,188,96,0.08),transparent)]" />
        </div>

        <motion.div
          className="relative z-10 p-6 sm:p-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-xl font-bold text-[#fffffe] tracking-tight mb-6 text-center"
          >
            Статистика
          </motion.h2>

          <motion.div variants={itemVariants} className="mb-6 space-y-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5 mb-1">
                <motion.span
                  aria-hidden
                  animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 3.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  <PiggyBank className="w-6 h-6 text-[#f9bc60] drop-shadow-[0_0_12px_rgba(249,188,96,0.35)]" />
                </motion.span>
                <span className="text-3xl sm:text-4xl font-bold tabular-nums text-[#f9bc60] drop-shadow-[0_0_24px_rgba(249,188,96,0.15)]">
                  <AnimatedNumber value={stats.collected} /> ₽
                </span>
              </div>
              <p className="text-sm text-[#abd1c6] text-center max-w-sm">
                Всего в копилке · эти средства идут на помощь
              </p>
            </div>
            <Separator className="bg-white/10" />
          </motion.div>

          <motion.div
            variants={gridVariants}
            className="grid grid-cols-3 gap-3 sm:gap-4"
          >
            {subStats.map((item) => (
              <motion.div
                key={item.key}
                variants={miniCardVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.2 } }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={cn(
                  "group text-center rounded-2xl p-4 sm:p-5",
                  "bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                  "transition-shadow duration-300",
                  "md:hover:shadow-[0_8px_28px_rgba(0,0,0,0.25),0_0_0_1px_rgba(249,188,96,0.22)]",
                )}
              >
                <motion.span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2.5 text-[#abd1c6] bg-white/[0.06] ring-1 ring-white/[0.06] md:group-hover:text-[#f9bc60] md:group-hover:ring-[#f9bc60]/25 transition-colors duration-300"
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.span>
                <div className="text-xl font-bold tabular-nums mb-0.5 text-[#fffffe]">
                  <AnimatedNumber value={stats[item.key]} />
                </div>
                <div className="text-sm font-medium text-[#abd1c6]">
                  {item.label}
                </div>
                <div className="text-xs mt-0.5 text-[#94a1b2]">
                  {item.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Card>
    </div>
  );
}
