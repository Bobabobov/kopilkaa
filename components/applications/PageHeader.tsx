"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { cardEntranceSpring } from "@/components/applications/applicationWizardMotion";

export default function PageHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10"
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0.01 } : cardEntranceSpring}
    >
      <div className="mb-10">
        <Card variant="darkGlass" padding="lg" className="relative overflow-hidden text-center">
          <motion.div
            className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#f9bc60]/10 blur-3xl pointer-events-none"
            aria-hidden
            animate={
              reducedMotion
                ? undefined
                : { scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="hidden sm:block absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#abd1c6]/8 blur-3xl pointer-events-none"
            aria-hidden
            animate={
              reducedMotion
                ? undefined
                : { scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }
            }
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <CardContent className="relative py-8 sm:py-10 px-5 sm:px-8">
            <motion.div
              className="mx-auto mb-4 inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness: 380, damping: 24, delay: 0.06 }
              }
            >
              <motion.span
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f9bc60]/25 text-[#001e1d]"
                animate={
                  reducedMotion
                    ? undefined
                    : { rotate: [0, -6, 6, 0] }
                }
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatDelay: 4,
                }}
              >
                <LucideIcons.FileText size="sm" />
              </motion.span>
              Подача заявки
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#f9bc60] bg-clip-text text-transparent"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness: 200, damping: 22, delay: 0.1 }
              }
            >
              Расскажите свою историю
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-[#abd1c6]"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.18, duration: 0.35 }}
            >
              Заполните шаги ниже — чем яснее история, тем проще рассмотрение.
            </motion.p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
