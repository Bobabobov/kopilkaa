"use client";

import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Unlock,
} from "lucide-react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { getDifficultyTaskExamples } from "@/lib/goodDeeds";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/ui/useScrollLock";
import type { GoodDeedDifficulty, GoodDeedsResponse } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  initialStep?: number;
  categoryStats: GoodDeedsResponse["categoryStats"];
  selectedDifficulty: GoodDeedDifficulty;
  difficultyLocked: boolean;
  onApply: (difficulty: GoodDeedDifficulty) => void;
};

const ORDER: GoodDeedDifficulty[] = ["EASY", "MEDIUM", "HARD"];

const UNLOCKED_STEP_COUNT = 3;
const UNLOCKED_TITLES = [
  "Неделя и задания",
  "Когда можно сменить сложность",
  "Выберите сложность",
] as const;

const STEP_ICONS = [CalendarDays, Shield, Layers] as const;

/** Выше TopBanner (60), Header (50) — рендер через portal на `body`, иначе fixed может проигрывать баннеру в stacking context */
const MODAL_LAYER =
  "fixed inset-0 z-[150] flex min-h-[100dvh] items-end justify-center px-0 sm:min-h-0 sm:items-center sm:px-4";

const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

const optionContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.065, delayChildren: 0.06 },
  },
};

const optionItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 30 },
  },
};

function StepRail({ step }: { step: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="px-2 pb-1 pt-2">
      <div className="flex items-center justify-between gap-1">
        {Array.from({ length: UNLOCKED_STEP_COUNT }).map((_, i) => {
          const done = step > i;
          const active = step === i;
          const Icon = STEP_ICONS[i];
          return (
            <Fragment key={i}>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: active && !reducedMotion ? 1.06 : 1,
                    boxShadow:
                      active && !reducedMotion
                        ? "0 0 24px rgba(249,188,96,0.35)"
                        : "0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 text-[#fffffe]",
                    done &&
                      "border-emerald-400/70 bg-emerald-500/15 text-emerald-200",
                    active &&
                      !done &&
                      "border-[#f9bc60] bg-[#f9bc60]/20 shadow-lg shadow-[#f9bc60]/15",
                    !active &&
                      !done &&
                      "border-white/12 bg-[#001e1d]/80 text-[#94a1b2]",
                  )}
                >
                  {done ? (
                    <Check
                      className="h-5 w-5 text-emerald-300"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Icon className="h-5 w-5" aria-hidden />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "hidden max-w-[5.5rem] text-center text-[10px] font-semibold uppercase leading-tight tracking-wide sm:block",
                    active ? "text-[#f9bc60]" : "text-[#94a1b2]",
                  )}
                >
                  {["Обзор", "Условие", "Уровень"][i]}
                </span>
              </div>
              {i < UNLOCKED_STEP_COUNT - 1 && (
                <div className="relative mb-7 h-[3px] min-w-[1.25rem] flex-1 overflow-hidden rounded-full bg-white/10 sm:mb-8">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f9bc60] via-[#f9bc60] to-[#e8a545]"
                    initial={false}
                    animate={{
                      width: step > i ? "100%" : step === i ? "55%" : "0%",
                      opacity: step >= i ? 1 : 0.35,
                    }}
                    transition={{
                      duration: reducedMotion ? 0.12 : 0.35,
                      ease: "easeOut",
                    }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function GoodDeedsDifficultyModal({
  open,
  onClose,
  initialStep = 0,
  categoryStats,
  selectedDifficulty,
  difficultyLocked,
  onApply,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  /** Явный выбор на шаге 3 — без предустановки «как на сервере» */
  const [draft, setDraft] = useState<GoodDeedDifficulty | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    if (!difficultyLocked) {
      setDraft(null);
      setStep(Math.max(0, Math.min(UNLOCKED_STEP_COUNT - 1, initialStep)));
    }
  }, [open, difficultyLocked, initialStep]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const handleApply = () => {
    if (!difficultyLocked) {
      if (draft === null) return;
      onApply(draft);
    }
    onClose();
  };

  const lockedStat = categoryStats[selectedDifficulty];

  const shellMotion = {
    overlay: reducedMotion
      ? { duration: 0.15 }
      : { duration: 0.22, ease: "easeOut" },
    panel: reducedMotion
      ? { duration: 0.18 }
      : { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.88 },
  };

  if (difficultyLocked) {
    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={shellMotion.overlay}
        className={MODAL_LAYER}
        role="dialog"
        aria-modal="true"
        aria-labelledby="good-deeds-diff-locked-title"
      >
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#001e1d]/88 backdrop-blur-md"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <motion.div
          role="document"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={shellMotion.panel}
          className={cn(
            "relative flex w-full max-w-lg flex-col overflow-hidden bg-gradient-to-b from-[#0f2e29] via-[#0a2522] to-[#001e1d]",
            "border border-white/[0.12] shadow-[0_-16px_56px_rgba(0,0,0,0.55)] sm:shadow-[0_28px_72px_rgba(0,0,0,0.55)]",
            "rounded-t-[26px] sm:rounded-[26px]",
            "ring-1 ring-white/[0.06]",
            "max-h-[min(92dvh,900px)] sm:max-h-[min(88vh,860px)]",
          )}
        >
          <div
            className="mx-auto mt-3 h-1 w-11 shrink-0 rounded-full bg-white/25 sm:hidden"
            aria-hidden
          />

          <div className="relative overflow-hidden px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
            <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#f9bc60]/12 blur-3xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-500/15 text-amber-100 shadow-inner shadow-black/20">
                  <Lock className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <Badge variant="muted" className="mb-2 border-white/10">
                    На эту неделю
                  </Badge>
                  <h2
                    id="good-deeds-diff-locked-title"
                    className="text-lg font-semibold tracking-tight text-[#fffffe] sm:text-xl"
                  >
                    Уровень закреплён
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#abd1c6]">
                    Уже есть принятый отчёт — до{" "}
                    <span className="font-semibold text-[#fffffe]">
                      конца недели
                    </span>{" "}
                    сложность не меняется.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl p-2 text-[#abd1c6] transition-colors hover:bg-white/10 hover:text-[#fffffe]"
                aria-label="Закрыть"
              >
                <LucideIcons.X size="sm" />
              </button>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
            <Card
              variant="darkGlass"
              padding="md"
              className="border-[#f9bc60]/25 bg-[linear-gradient(145deg,rgba(249,188,96,0.08)_0%,rgba(0,30,29,0.65)_100%)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-[#fffffe]">
                    {lockedStat.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#abd1c6]">
                    {lockedStat.description}
                  </p>
                </div>
                <Badge variant="default" className="shrink-0 tabular-nums">
                  +{lockedStat.completionBonus} за 3/3
                </Badge>
              </div>
            </Card>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#001e1d]/98 px-5 pt-3 backdrop-blur-md pb-[max(14px,env(safe-area-inset-bottom))] sm:rounded-b-[26px] sm:px-6">
            <motion.button
              type="button"
              onClick={handleApply}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-[#001e1d]"
              style={{
                background:
                  "linear-gradient(135deg, #e8a545 0%, #f9bc60 45%, #e8a545 100%)",
                boxShadow:
                  "0 10px 28px rgba(249, 188, 96, 0.28), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              Понятно
              <ChevronRight className="h-4 w-4 opacity-90" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>,
      document.body,
    );
  }

  const atFirst = step === 0;
  const atLast = step === UNLOCKED_STEP_COUNT - 1;

  const goNext = () => setStep((s) => Math.min(UNLOCKED_STEP_COUNT - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={shellMotion.overlay}
      className={MODAL_LAYER}
      role="dialog"
      aria-modal="true"
      aria-labelledby="good-deeds-diff-step-title"
    >
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#001e1d]/88 backdrop-blur-md"
        aria-label="Закрыть"
        onClick={onClose}
      />

      <motion.div
        role="document"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
        transition={shellMotion.panel}
        className={cn(
          "relative flex max-h-[min(92dvh,900px)] w-full max-w-lg flex-col overflow-hidden sm:max-h-[min(88vh,860px)]",
          "bg-gradient-to-b from-[#0f2e29] via-[#062620] to-[#001e1d]",
          "border border-white/[0.12] shadow-[0_-16px_56px_rgba(0,0,0,0.55)] sm:shadow-[0_28px_72px_rgba(0,0,0,0.55)]",
          "rounded-t-[26px] sm:rounded-[26px]",
          "ring-1 ring-white/[0.06]",
        )}
      >
        <div
          className="mx-auto mt-3 h-1 w-11 shrink-0 rounded-full bg-white/25 sm:hidden"
          aria-hidden
        />

        <div className="relative px-5 pb-2 pt-4 sm:px-6 sm:pt-5">
          <div className="pointer-events-none absolute -left-24 top-0 h-40 w-40 rounded-full bg-[#abd1c6]/08 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-[#f9bc60]/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-[#f9bc60]/35 text-[#ffd89a]"
                >
                  <Sparkles className="mr-1 h-3 w-3" aria-hidden />
                  Добрые дела
                </Badge>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a1b2]">
                  Шаг {step + 1} / {UNLOCKED_STEP_COUNT}
                </span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={step}
                  id="good-deeds-diff-step-title"
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mt-2 text-xl font-semibold tracking-tight text-[#fffffe] sm:text-[1.35rem]"
                >
                  {UNLOCKED_TITLES[step]}
                </motion.h2>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl p-2.5 text-[#abd1c6] ring-1 ring-transparent transition-colors hover:bg-white/10 hover:text-[#fffffe] hover:ring-white/10"
              aria-label="Закрыть"
            >
              <LucideIcons.X size="sm" />
            </button>
          </div>

          <StepRail step={step} />
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <p className="text-base leading-relaxed text-[#abd1c6]">
                    <span className="font-semibold text-[#fffffe]">
                      Одна линейка на неделю:
                    </span>{" "}
                    лёгкая, средняя или тяжёлая. Ниже появятся{" "}
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-medium text-[#fffffe]">
                      три задания
                    </span>
                    .
                  </p>
                  <motion.ul
                    variants={listContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4 ring-1 ring-white/[0.04]"
                  >
                    {[
                      "Отчёт с фото или видео → проверка → бонусы на баланс.",
                      "За все три задания подряд сверху ещё плюс — сумма у выбранного уровня.",
                    ].map((line) => (
                      <motion.li
                        key={line}
                        variants={listItem}
                        className="flex gap-3 text-sm leading-relaxed text-[#abd1c6]"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f9bc60]/15 text-[#f9bc60] ring-1 ring-[#f9bc60]/30">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <span>{line}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/[0.1] bg-white/[0.035] px-4 py-3">
                    <p className="text-[13px] leading-relaxed text-[#abd1c6]">
                      Простое правило на эту неделю: как только появился хотя бы
                      один статус{" "}
                      <span className="rounded-md bg-[#f9bc60]/15 px-1.5 py-0.5 font-medium text-[#ffd89a]">
                        «Принято»
                      </span>
                      , сложность уже не меняется.
                    </p>
                  </div>

                  <motion.div
                    variants={listContainer}
                    initial="hidden"
                    animate="show"
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <motion.div variants={listItem}>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-500/45 bg-gradient-to-b from-emerald-950/55 to-[#001e1d]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-emerald-500/15">
                        <div
                          className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-emerald-400/70"
                          aria-hidden
                        />
                        <div className="flex items-center gap-2 pl-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                            <Unlock className="h-5 w-5" aria-hidden />
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wide text-emerald-300/95">
                            Можно сменить
                          </span>
                        </div>
                        <p className="mt-3 pl-2 text-[15px] font-semibold leading-snug text-[#fffffe]">
                          Ещё нет статуса «Принято»
                        </p>
                        <p className="mt-2 flex-1 pl-2 text-sm leading-relaxed text-[#abd1c6]">
                          Можно выбрать другой уровень в любой момент.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div variants={listItem}>
                      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-600/40 bg-gradient-to-b from-amber-950/40 to-[#001e1d]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-amber-600/15">
                        <div
                          className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-amber-400/65"
                          aria-hidden
                        />
                        <div className="flex items-center gap-2 pl-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/35">
                            <Lock className="h-5 w-5" aria-hidden />
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wide text-amber-200/95">
                            Нельзя сменить
                          </span>
                        </div>
                        <p className="mt-3 pl-2 text-[15px] font-semibold leading-snug text-[#fffffe]">
                          Уже есть «Принято»
                        </p>
                        <p className="mt-2 flex-1 pl-2 text-sm leading-relaxed text-[#abd1c6]">
                          Теперь ждём новую неделю. Тогда снова можно выбрать.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <p className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2 text-center text-[11px] leading-relaxed text-[#94a1b2]">
                    «Принято» = отчёт одобрен.
                  </p>
                </div>
              )}

              {step === 2 && (
                <motion.div
                  variants={optionContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  <p className="text-sm text-[#94a1b2]">
                    Выберите уровень сами — на карточке откроются примеры
                    заданий, справа бонус за три из трёх; после этого можно
                    нажать «Готово».
                  </p>
                  {ORDER.map((key) => {
                    const stat = categoryStats[key];
                    const active = draft === key;
                    const examples = getDifficultyTaskExamples(key);
                    return (
                      <motion.div key={key} variants={optionItem}>
                        <button
                          type="button"
                          onClick={() => setDraft(key)}
                          className={cn(
                            "group relative w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                            active
                              ? "border-[#f9bc60]/70 bg-[#f9bc60]/12 shadow-[0_0_0_1px_rgba(249,188,96,0.35),0_12px_40px_rgba(0,0,0,0.35)] ring-2 ring-[#f9bc60]/40"
                              : "border-white/[0.1] bg-[#001e1d]/50 hover:border-[#abd1c6]/35 hover:bg-[#002f2c]/80",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                active
                                  ? "border-[#f9bc60] bg-[#f9bc60] text-[#001e1d]"
                                  : "border-white/25 bg-transparent text-transparent group-hover:border-[#abd1c6]/50",
                              )}
                              aria-hidden
                            >
                              {active && (
                                <Check
                                  className="h-3.5 w-3.5"
                                  strokeWidth={3}
                                />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <span className="text-base font-semibold text-[#fffffe]">
                                  {stat.label}
                                </span>
                                <Badge
                                  variant="default"
                                  className="shrink-0 tabular-nums shadow-sm"
                                >
                                  +{stat.completionBonus} за 3/3
                                </Badge>
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-[#abd1c6]">
                                {stat.description}
                              </p>
                              <AnimatePresence initial={false}>
                                {active && (
                                  <motion.div
                                    key="examples"
                                    initial={
                                      reducedMotion
                                        ? false
                                        : { opacity: 0, y: 6 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={
                                      reducedMotion
                                        ? { opacity: 0 }
                                        : { opacity: 0, y: 4 }
                                    }
                                    transition={{
                                      duration: reducedMotion ? 0.12 : 0.22,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                  >
                                    <div className="mt-4 border-t border-white/[0.1] pt-3">
                                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94a1b2]">
                                        Примеры из линейки
                                      </p>
                                      <p className="mt-1 text-xs leading-snug text-[#abd1c6]/90">
                                        На неделю даётся три задания — такого
                                        типа темы (конкретный набор зависит от
                                        недели):
                                      </p>
                                      <p className="mt-1 text-xs leading-snug text-[#94a1b2]">
                                        Важно: обязательных денежных трат в
                                        заданиях нет, главный вклад — время и
                                        участие.
                                      </p>
                                      <ul className="mt-3 space-y-2.5 text-left">
                                        {examples.map((ex) => (
                                          <li
                                            key={ex.title}
                                            className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2"
                                          >
                                            <span className="text-sm font-medium text-[#fffffe]">
                                              {ex.title}
                                            </span>
                                            <span className="mt-1 block text-[13px] leading-relaxed text-[#abd1c6]">
                                              {ex.blurb}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "shrink-0 border-t border-white/10 bg-[#001e1d]/98 px-5 pt-3 backdrop-blur-md",
            "pb-[max(14px,env(safe-area-inset-bottom))] sm:rounded-b-[26px] sm:px-6",
          )}
        >
          {!atLast ? (
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={goBack}
                disabled={atFirst}
                whileHover={
                  atFirst || reducedMotion ? undefined : { scale: 1.02 }
                }
                whileTap={
                  atFirst || reducedMotion ? undefined : { scale: 0.97 }
                }
                className={cn(
                  "min-h-[50px] flex-1 rounded-xl border border-[#abd1c6]/35 bg-[#001e1d]/60 py-3 text-sm font-semibold text-[#abd1c6] shadow-sm transition-colors hover:border-[#abd1c6]/55 hover:text-[#fffffe]",
                  atFirst ? "pointer-events-none opacity-40" : "",
                )}
              >
                Назад
              </motion.button>
              <motion.button
                type="button"
                onClick={goNext}
                whileHover={reducedMotion ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className="relative min-h-[50px] flex-[1.25] overflow-hidden rounded-xl py-3 text-sm font-semibold text-[#001e1d] shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #e8a545 0%, #f9bc60 45%, #e8a545 100%)",
                  boxShadow:
                    "0 12px 32px rgba(249, 188, 96, 0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  Далее
                  <ChevronRight className="h-4 w-4 opacity-90" />
                </span>
              </motion.button>
            </div>
          ) : (
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={goBack}
                whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className="min-h-[50px] flex-1 rounded-xl border border-[#abd1c6]/35 bg-[#001e1d]/60 py-3 text-sm font-semibold text-[#abd1c6] hover:border-[#abd1c6]/55 hover:text-[#fffffe]"
              >
                Назад
              </motion.button>
              <motion.button
                type="button"
                onClick={handleApply}
                disabled={draft === null}
                whileHover={
                  draft === null || reducedMotion
                    ? undefined
                    : { scale: 1.02, y: -1 }
                }
                whileTap={
                  draft === null || reducedMotion ? undefined : { scale: 0.98 }
                }
                className={cn(
                  "relative min-h-[50px] flex-[1.25] rounded-xl py-3 text-sm font-semibold shadow-lg transition-opacity",
                  draft === null
                    ? "cursor-not-allowed bg-[#f9bc60]/35 text-[#001e1d]/45"
                    : "text-[#001e1d]",
                )}
                style={
                  draft === null
                    ? undefined
                    : {
                        background:
                          "linear-gradient(135deg, #e8a545 0%, #f9bc60 45%, #e8a545 100%)",
                        boxShadow:
                          "0 12px 32px rgba(249, 188, 96, 0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                      }
                }
              >
                <span className="flex items-center justify-center gap-1.5">
                  Готово
                  <Check className="h-4 w-4 opacity-90" strokeWidth={2.5} />
                </span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
