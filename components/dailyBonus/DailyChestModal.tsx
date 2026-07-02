"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GlassModal } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Progress } from "@/components/ui/progress";
import { DailyChestAmbient } from "@/components/dailyBonus/DailyChestAmbient";
import { CoinFrameAnimation } from "@/components/dailyBonus/CoinFrameAnimation";
import { DailyChestRewardCounter } from "@/components/dailyBonus/DailyChestRewardCounter";
import {
  DailyChestVisual,
  type DailyChestVisualState,
} from "@/components/dailyBonus/DailyChestVisual";
import {
  DAILY_CHEST_INVITE_TIPS,
  getDailyChestOpeningStatus,
} from "@/components/dailyBonus/dailyChestModalCopy";
import { DAILY_CHEST_MAX, DAILY_CHEST_MIN } from "@/lib/dailyChest/constants";
import { cn } from "@/lib/utils";

const formatBonuses = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value);

export type DailyChestModalPhase = "invite" | "opening" | "result";

export type DailyChestClaimResult = {
  amount: number;
};

type Props = {
  open: boolean;
  phase: DailyChestModalPhase;
  result: DailyChestClaimResult | null;
  error?: string | null;
  openingProgress?: number;
  onOpenChest: () => void;
  onClose: () => void;
};

const STAGE_STEPS = [
  { id: "invite", label: "Сундук" },
  { id: "opening", label: "Открытие" },
  { id: "result", label: "Награда" },
] as const;

function getChestVisualState(phase: DailyChestModalPhase): DailyChestVisualState {
  if (phase === "result") return "open";
  if (phase === "opening") return "opening";
  return "closed";
}

function getAmbientMode(
  phase: DailyChestModalPhase,
  hasReward: boolean,
): "idle" | "opening" | "reward" | "empty" {
  if (phase === "opening") return "opening";
  if (phase === "result") return hasReward ? "reward" : "empty";
  return "idle";
}

function getActiveStageIndex(phase: DailyChestModalPhase): number {
  if (phase === "result") return 2;
  if (phase === "opening") return 1;
  return 0;
}

function StageStepper({ phase }: { phase: DailyChestModalPhase }) {
  const activeIndex = getActiveStageIndex(phase);

  return (
    <div className="flex shrink-0 items-center justify-center gap-1 px-4 pb-1 pt-3 pr-12 sm:gap-1.5 sm:px-6 sm:pb-0 sm:pt-3">
      {STAGE_STEPS.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;

        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center gap-1 sm:gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold transition-colors sm:h-7 sm:w-7 sm:text-[11px]",
                  isDone
                    ? "border-[#f9bc60]/50 bg-[#f9bc60]/20 text-[#f9bc60]"
                    : isActive
                      ? "border-[#f9bc60] bg-[#f9bc60] text-[#001e1d] shadow-[0_0_16px_rgba(249,188,96,0.35)]"
                      : "border-white/15 bg-white/[0.04] text-[#abd1c6]/70",
                )}
              >
                {isDone ? (
                  <LucideIcons.Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] font-medium uppercase tracking-wide sm:block",
                  isActive || isDone ? "text-[#f9bc60]" : "text-[#abd1c6]/60",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STAGE_STEPS.length - 1 ? (
              <div
                className={cn(
                  "mb-0 h-px w-4 sm:mb-4 sm:w-10",
                  index < activeIndex ? "bg-[#f9bc60]/50" : "bg-white/10",
                )}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function RewardBreakdownCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-2xl border px-3.5 py-3",
        accent
          ? "border-[#f9bc60]/25 bg-gradient-to-br from-[#f9bc60]/14 via-[#f9bc60]/6 to-transparent"
          : "border-white/10 bg-white/[0.04]",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl border",
          accent
            ? "h-11 w-11 border-[#f9bc60]/25 bg-[#f9bc60]/12 shadow-[0_0_20px_rgba(249,188,96,0.12)]"
            : "h-9 w-9 border-white/10 bg-white/5 text-[#abd1c6]",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 text-left">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#abd1c6]/90">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 text-sm font-bold",
            accent ? "text-[#f9bc60]" : "text-[#fffffe]",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ContentFade({
  children,
  contentKey,
}: {
  children: ReactNode;
  contentKey: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={contentKey}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function DailyChestModal({
  open,
  phase,
  result,
  error = null,
  openingProgress = 0,
  onOpenChest,
  onClose,
}: Props) {
  const reducedMotion = useReducedMotion();
  const busy = phase === "opening";
  const isResult = phase === "result" && result !== null;
  const hasReward = isResult && result.amount > 0;
  const isEmptyChest = isResult && result.amount === 0;
  const chestState = getChestVisualState(phase);
  const ambientMode = getAmbientMode(phase, hasReward);
  const progressPercent = Math.round(openingProgress * 100);
  const openingStatus = getDailyChestOpeningStatus(openingProgress);

  useEffect(() => {
    if (!open || busy || isResult) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      onOpenChest();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, isResult, onOpenChest, open]);

  const footer = isResult ? (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
      <motion.button
        type="button"
        onClick={onClose}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        className={cn(
          "min-h-[46px] w-full rounded-xl px-6 text-sm font-bold sm:w-auto",
          hasReward
            ? "bg-[#f9bc60] text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.28)] hover:bg-[#e8a545]"
            : "border border-[#abd1c6]/35 bg-transparent text-[#abd1c6] hover:bg-white/[0.06]",
        )}
      >
        {hasReward ? "Забрать награду" : "Понятно"}
      </motion.button>
    </div>
  ) : (
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        disabled={busy}
        onClick={onClose}
        className={cn(
        "relative min-h-[44px] rounded-xl px-4 text-sm font-medium text-[#abd1c6] transition-colors hover:bg-white/[0.06] hover:text-[#fffffe] sm:min-h-[44px]",
          busy && "pointer-events-none opacity-40",
        )}
      >
        Позже
      </button>
      <motion.button
        type="button"
        disabled={busy}
        onClick={onOpenChest}
        whileHover={reducedMotion || busy ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion || busy ? undefined : { scale: 0.98 }}
        className={cn(
          "relative min-h-[44px] w-full overflow-hidden rounded-xl px-5 text-sm font-bold text-[#001e1d] sm:min-h-[46px] sm:min-w-[200px] sm:w-auto sm:px-6",
          "bg-[#f9bc60] shadow-[0_8px_24px_rgba(249,188,96,0.28)] hover:bg-[#e8a545]",
          busy && "opacity-65",
        )}
      >
        {!busy && !reducedMotion ? (
          <motion.span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            animate={{ x: ["-120%", "120%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            aria-hidden
          />
        ) : null}
        <span className="relative inline-flex items-center justify-center gap-2">
          {busy ? (
            <>
              <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
              Открываем...
            </>
          ) : (
            <>
              <LucideIcons.Gift className="h-4 w-4" />
              Открыть сундук
            </>
          )}
        </span>
      </motion.button>
    </div>
  );

  return (
    <GlassModal
      open={open}
      onClose={busy ? () => {} : onClose}
      size="md"
      zIndex={85}
      maxHeight="min(94dvh, 520px)"
      hideHeader
      showCloseButton={!busy && !isResult}
      closeOnBackdropClick={!busy && !isResult}
      bodyClassName="relative min-h-0 p-0"
      panelClassName="mx-auto w-[calc(100%-0.5rem)] max-w-md overflow-hidden border-[#f9bc60]/10 sm:w-full"
      footerClassName="border-t border-white/[0.06] bg-black/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
      ariaLabelledBy="daily-chest-title"
      ariaDescribedBy="daily-chest-desc"
      footer={footer}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#f9bc60]/80 to-transparent"
        aria-hidden
      />

      <DailyChestAmbient mode={ambientMode} />
      <StageStepper phase={phase} />

      <ContentFade contentKey={phase}>
        {isResult ? (
          <div className="relative px-4 pb-3 pt-2 sm:px-6 sm:pb-4 sm:pt-3">
            {hasReward ? (
              <div className="mb-3 flex items-center justify-center gap-2 rounded-2xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 px-3 py-2 text-xs font-medium text-[#f9bc60] sm:mb-2">
                <LucideIcons.CheckCircle className="h-4 w-4 shrink-0" />
                Бонусы зачислены на баланс
              </div>
            ) : null}

            <div className="flex flex-col items-center text-center sm:grid sm:grid-cols-[minmax(0,8.5rem)_1fr] sm:items-center sm:gap-x-5 sm:text-left">
              <div className="relative sm:justify-self-center">
                <div
                  className="pointer-events-none absolute inset-0 rounded-full bg-[#f9bc60]/10 blur-2xl"
                  aria-hidden
                />
                <DailyChestVisual
                  state={chestState}
                  openingProgress={openingProgress}
                  glow={hasReward}
                />
              </div>

              <div className="mt-3 min-w-0 sm:col-start-2 sm:mt-0">
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px]",
                  hasReward ? "text-[#f9bc60]" : "text-[#abd1c6]",
                )}
              >
                {hasReward ? "Награда" : isEmptyChest ? "Пусто" : "Сундук открыт"}
              </p>
              <h2
                id="daily-chest-title"
                className="mt-1 text-lg font-bold tracking-tight text-[#fffffe] sm:text-xl md:text-[1.35rem]"
              >
                {hasReward ? (
                  <>
                    <DailyChestRewardCounter
                      value={result.amount}
                      className="text-[#f9bc60]"
                    />{" "}
                    бонусов
                  </>
                ) : (
                  "Сегодня без бонусов"
                )}
              </h2>
              <p
                id="daily-chest-desc"
                className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#abd1c6] sm:mt-2 sm:text-[15px] md:text-sm"
              >
                {hasReward
                  ? "Удача сегодня на вашей стороне — можно тратить бонусы в профиле."
                  : "Не расстраивайтесь — завтра сундук снова будет ждать вас."}
              </p>
              </div>
            </div>

            {hasReward ? (
              <div className="mt-3 sm:mt-2.5">
                <RewardBreakdownCard
                  icon={<CoinFrameAnimation className="h-9 w-9" />}
                  label="Из сундука"
                  value={`+${formatBonuses(result.amount)}`}
                  accent
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="relative px-4 pb-3 pt-2 sm:px-6 sm:pb-4 sm:pt-3">
            <div className="flex flex-col items-center text-center sm:grid sm:grid-cols-[minmax(0,8.5rem)_1fr] sm:items-start sm:gap-x-5 sm:gap-y-2 sm:text-left">
              <div className="relative sm:justify-self-center sm:pt-1">
                <div
                  className="pointer-events-none absolute -inset-4 rounded-full border border-[#f9bc60]/10"
                  aria-hidden
                />
                <DailyChestVisual
                  state={chestState}
                  openingProgress={openingProgress}
                />
              </div>

              <div className="min-w-0 sm:col-start-2">
              <div className="mt-3 inline-flex items-center rounded-full border border-[#f9bc60]/25 bg-[#f9bc60]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f9bc60] sm:mt-0 sm:px-3 sm:py-1.5 sm:text-[11px]">
                Ежедневный сундук
              </div>
              <h2
                id="daily-chest-title"
                className="mt-1.5 text-lg font-bold tracking-tight text-[#fffffe] sm:mt-1.5 sm:text-xl md:text-[1.35rem]"
              >
                {busy ? "Открываем сундук" : "Ваш подарок за сегодня"}
              </h2>
              <p
                id="daily-chest-desc"
                className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#abd1c6] sm:mt-2 sm:text-[15px] md:text-sm"
              >
                {busy
                  ? openingStatus
                  : "Нажмите кнопку ниже — внутри от 0 до 15 бонусов. Раз в сутки."}
              </p>
              </div>

              {!busy ? (
                <>
                  <div className="mt-2.5 w-full rounded-2xl border border-white/10 bg-gradient-to-br from-black/25 via-black/15 to-[#f9bc60]/5 p-3 backdrop-blur-sm sm:col-span-2 sm:mt-1 sm:p-3.5">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/12 shadow-[0_0_20px_rgba(249,188,96,0.12)] sm:h-11 sm:w-11">
                        <CoinFrameAnimation className="h-8 w-8 sm:h-9 sm:w-9" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#abd1c6]/85 sm:text-[11px]">
                          Возможная награда
                        </p>
                        <p className="mt-0.5 text-base font-bold leading-snug text-[#fffffe] sm:text-lg">
                          {formatBonuses(DAILY_CHEST_MIN)}
                          <span className="mx-1 text-[#abd1c6] sm:mx-1.5">—</span>
                          <span className="text-[#f9bc60]">
                            {formatBonuses(DAILY_CHEST_MAX)}
                          </span>
                          <span className="ml-1 text-xs font-medium text-[#abd1c6] sm:ml-1.5 sm:text-sm">
                            бонусов
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-2 hidden w-full flex-col gap-1.5 sm:col-span-2 sm:mt-2 sm:flex sm:flex-row sm:gap-2">
                    {DAILY_CHEST_INVITE_TIPS.map((tip) => (
                      <li
                        key={tip}
                        className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-left text-xs text-[#abd1c6] sm:justify-center sm:py-2 sm:text-center"
                      >
                        <LucideIcons.Check className="h-3.5 w-3.5 shrink-0 text-[#f9bc60]" />
                        {tip}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-1.5 hidden text-[11px] text-[#667a73] sm:col-span-2 sm:mt-1 sm:block">
                    Enter — открыть сундук
                  </p>
                </>
              ) : null}
            </div>

            {busy ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-2xl border border-[#f9bc60]/25 bg-gradient-to-br from-[#f9bc60]/10 to-transparent px-4 py-3 sm:mt-2"
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-[#abd1c6]">
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin text-[#f9bc60]" />
                    {openingStatus}
                  </span>
                  <span className="font-bold tabular-nums text-[#f9bc60]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="mt-3">
                  <Progress
                    value={progressPercent}
                    className="h-2 bg-black/30 [&>div]:bg-gradient-to-r [&>div]:from-[#f9bc60] [&>div]:via-[#ffd27d] [&>div]:to-[#e8a545] [&>div]:duration-75 [&>div]:ease-linear"
                  />
                </div>
              </motion.div>
            ) : null}

            {error ? (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#e16162]/30 bg-[#e16162]/10 px-3.5 py-3 text-sm text-[#e16162]">
                <LucideIcons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>{error}</p>
                  <p className="mt-1 text-xs text-[#e16162]/80">
                    Попробуйте снова или зайдите завтра.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </ContentFade>
    </GlassModal>
  );
}
