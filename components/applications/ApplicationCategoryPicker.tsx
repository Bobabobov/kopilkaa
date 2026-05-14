"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bus,
  Gift,
  HeartHandshake,
  Package,
  Utensils,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { ApplicationCategory } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import {
  APPLICATION_CATEGORY_ORDER,
  getApplicationCategoryConfig,
  type ApplicationPickerCategory,
} from "@/lib/applications/categories";

const CATEGORY_ICON: Record<ApplicationPickerCategory, LucideIcon> = {
  FOOD_DRINKS: Utensils,
  HOUSEHOLD_ESSENTIALS: Package,
  TRANSPORT_COMMS: Bus,
  SMALL_GIFT: Gift,
  EVERYDAY_SUPPORT: HeartHandshake,
};

/** Цветовые акценты для иконок (палитра проекта + контраст) */
const CATEGORY_ICON_SHELL: Record<
  ApplicationPickerCategory,
  { ring: string; glow: string; fg: string }
> = {
  FOOD_DRINKS: {
    ring: "ring-amber-400/35",
    glow: "shadow-[0_0_24px_rgba(251,191,36,0.18)]",
    fg: "text-amber-200",
  },
  HOUSEHOLD_ESSENTIALS: {
    ring: "ring-cyan-400/30",
    glow: "shadow-[0_0_22px_rgba(34,211,238,0.14)]",
    fg: "text-cyan-100",
  },
  TRANSPORT_COMMS: {
    ring: "ring-sky-400/35",
    glow: "shadow-[0_0_22px_rgba(56,189,248,0.16)]",
    fg: "text-sky-100",
  },
  SMALL_GIFT: {
    ring: "ring-rose-400/35",
    glow: "shadow-[0_0_22px_rgba(251,113,133,0.14)]",
    fg: "text-rose-100",
  },
  EVERYDAY_SUPPORT: {
    ring: "ring-emerald-400/30",
    glow: "shadow-[0_0_22px_rgba(52,211,153,0.14)]",
    fg: "text-emerald-100",
  },
};

const listContainer: import("framer-motion").Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const listItem: import("framer-motion").Variants = {
  hidden: { opacity: 1, y: 12, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

export type ApplicationCategoryPickerProps = {
  category: ApplicationCategory | "";
  setCategory: (v: ApplicationCategory) => void;
  error?: string;
  /** Корневой id для скролла к ошибке */
  fieldId?: string;
};

export function ApplicationCategoryPicker({
  category,
  setCategory,
  error,
  fieldId = "application-field-category",
}: ApplicationCategoryPickerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div id={fieldId} className="relative">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 overflow-hidden rounded-[28px] opacity-90 sm:-inset-6"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="absolute -left-1/4 top-0 h-64 w-[55%] rounded-full bg-[#f9bc60]/[0.07] blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-56 w-[50%] rounded-full bg-[#38bdf8]/[0.06] blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#a78bfa]/[0.05] blur-2xl" />
      </motion.div>

      <Card
        variant="darkGlass"
        padding="none"
        className={cn(
          "relative overflow-hidden border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-colors duration-300",
          error && "border-[#e16162]/45 ring-1 ring-[#e16162]/25",
        )}
      >
        {/* Сетка как в shadcn: верхняя полоса-орнамент */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <CardContent className="relative z-10 space-y-5 p-4 sm:p-6 lg:p-7">
          <motion.div
            className="space-y-3"
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="font-semibold tracking-wide">
                Шаг 1
              </Badge>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#94a1b2]">
                Категория
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[#fffffe] sm:text-2xl lg:text-[1.65rem]">
                <span className="bg-gradient-to-r from-[#fff7e8] via-[#f9bc60] to-[#d4a05a] bg-clip-text text-transparent">
                  Выберите категорию помощи
                </span>
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#abd1c6]/95 sm:text-[0.9375rem]">
                Выберите то, что ближе к вашей ситуации. До следующего шага
                категорию можно изменить.
              </p>
            </div>
          </motion.div>

          <LayoutGroup id="application-category-picker">
            <motion.div
              role="radiogroup"
              aria-label="Категория помощи"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 sm:items-stretch"
              variants={listContainer}
              initial="hidden"
              animate="show"
            >
              {APPLICATION_CATEGORY_ORDER.map((id) => {
                const cfg = getApplicationCategoryConfig(id);
                const Icon = CATEGORY_ICON[id];
                const shell = CATEGORY_ICON_SHELL[id];
                const selected = category === id;

                return (
                  <motion.div key={id} variants={listItem} className="h-full min-h-0 min-w-0">
                    <motion.button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setCategory(id)}
                      layout
                      whileHover={
                        reducedMotion
                          ? undefined
                          : { y: -3, scale: 1.012, transition: { duration: 0.18 } }
                      }
                      whileTap={
                        reducedMotion ? undefined : { scale: 0.985 }
                      }
                      transition={{ layout: { type: "spring", stiffness: 420, damping: 32 } }}
                      className={cn(
                        "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border text-left outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-[#f9bc60]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]",
                        selected
                          ? "border-[#f9bc60]/55 bg-[#f9bc60]/[0.14]"
                          : "border-white/[0.1] bg-white/[0.04] hover:border-white/[0.2] hover:bg-white/[0.06]",
                      )}
                    >
                      {selected && (
                        <motion.div
                          layoutId="application-category-highlight"
                          className="pointer-events-none absolute inset-0 rounded-[inherit]"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(249,188,96,0.2) 0%, rgba(249,188,96,0.04) 42%, transparent 72%)",
                            boxShadow:
                              "inset 0 0 0 1px rgba(249,188,96,0.35), 0 12px 36px rgba(249,188,96,0.12)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      <div className="relative flex flex-1 items-start gap-3 p-3.5 sm:gap-3.5 sm:p-4 sm:pr-5">
                        <motion.div
                          className={cn(
                            "flex h-12 w-12 shrink-0 self-start items-center justify-center rounded-2xl ring-2 ring-inset backdrop-blur-sm transition-transform",
                            shell.ring,
                            shell.glow,
                            "bg-[#001e1d]/50",
                          )}
                          animate={
                            reducedMotion
                              ? undefined
                              : selected
                                ? { rotate: [0, -4, 0] }
                                : { rotate: 0 }
                          }
                          transition={{ duration: 0.55, ease: "easeOut" }}
                        >
                          <Icon className={cn("h-6 w-6", shell.fg)} aria-hidden />
                        </motion.div>

                        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold leading-snug text-[#fffffe] sm:text-[0.95rem]">
                              {cfg.title}
                            </span>
                            <AnimatePresence mode="popLayout" initial={false}>
                              {selected && (
                                <motion.span
                                  key="check"
                                  initial={{ opacity: 0, scale: 0.75, x: 6 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.85, x: 4 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                  className="inline-flex shrink-0"
                                >
                                  <LucideIcons.CheckCircle2
                                    size="sm"
                                    className="text-[#f9bc60]"
                                  />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <p
                            className={cn(
                              "mt-2 border-t border-white/[0.06] pt-2 text-[0.8125rem] font-normal leading-[1.55] text-[#abd1c6] antialiased sm:text-sm",
                              selected && "text-[#c4e9df]",
                            )}
                          >
                            {cfg.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          </LayoutGroup>

          <AnimatePresence initial={false}>
            {error ? (
              <motion.p
                id={`${fieldId}-error`}
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm font-medium text-[#e16162]"
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
