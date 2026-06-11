"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassModal } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  DAILY_BONUS_RISK_WIN_AMOUNT,
  DAILY_BONUS_RISK_WIN_ODDS,
} from "@/lib/dailyBonus/constants";
import { cn } from "@/lib/utils";

const formatBonuses = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value);

export type DailyBonusRiskModalPhase = "confirm" | "loading" | "result";

export type DailyBonusRiskResult = {
  won: boolean;
  totalGranted: number;
  lostBonuses: number;
};

type Props = {
  isOpen: boolean;
  phase: DailyBonusRiskModalPhase;
  result: DailyBonusRiskResult | null;
  onCancel: () => void;
  onResultClose: () => void;
  onConfirm: () => void;
};

export function DailyBonusRiskConfirmModal({
  isOpen,
  phase,
  result,
  onCancel,
  onResultClose,
  onConfirm,
}: Props) {
  const reducedMotion = useReducedMotion();
  const busy = phase === "loading";
  const isResult = phase === "result" && result !== null;

  const footer = isResult ? (
    <div className="flex justify-end">
      <motion.button
        type="button"
        onClick={onResultClose}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        className={cn(
          "min-h-[46px] w-full rounded-xl px-6 text-sm font-bold sm:w-auto",
          result.won
            ? "bg-[#f9bc60] text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.28)] hover:bg-[#e8a545]"
            : "border border-[#abd1c6]/35 bg-transparent text-[#abd1c6] hover:bg-white/[0.06]",
        )}
      >
        Понятно
      </motion.button>
    </div>
  ) : (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
      <motion.button
        type="button"
        disabled={busy}
        onClick={onCancel}
        whileHover={reducedMotion || busy ? undefined : { scale: 1.01 }}
        whileTap={reducedMotion || busy ? undefined : { scale: 0.99 }}
        className={cn(
          "min-h-[46px] w-full rounded-xl px-5 text-sm font-semibold transition-colors sm:min-w-[120px] sm:w-auto",
          "border border-[#abd1c6]/35 bg-transparent text-[#abd1c6] hover:bg-white/[0.06]",
          busy && "pointer-events-none opacity-40",
        )}
      >
        Отмена
      </motion.button>
      <motion.button
        type="button"
        disabled={busy}
        onClick={onConfirm}
        whileHover={reducedMotion || busy ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion || busy ? undefined : { scale: 0.98 }}
        className={cn(
          "min-h-[46px] w-full rounded-xl px-6 text-sm font-bold text-white sm:w-auto",
          "border border-[#e16162]/50 bg-[#e16162] shadow-[0_8px_24px_rgba(225,97,98,0.28)] hover:bg-[#c95556]",
          busy && "opacity-65",
        )}
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
            Рискуем...
          </span>
        ) : (
          "Рискнуть"
        )}
      </motion.button>
    </div>
  );

  return (
    <GlassModal
      open={isOpen}
      onClose={isResult ? onResultClose : busy ? () => {} : onCancel}
      size="md"
      zIndex={1000}
      hideHeader
      showCloseButton={false}
      closeOnBackdropClick={isResult || !busy}
      bodyClassName="p-0"
      ariaLabelledBy="daily-bonus-risk-title"
      ariaDescribedBy="daily-bonus-risk-desc"
      footer={footer}
    >
      {isResult ? (
        <div className="px-5 pb-5 pt-6 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl border shadow-[0_12px_32px_rgba(0,0,0,0.25)]",
                result.won
                  ? "border-[#f9bc60]/40 bg-gradient-to-br from-[#f9bc60]/25 to-[#f9bc60]/10 text-[#f9bc60]"
                  : "border-[#e16162]/40 bg-gradient-to-br from-[#e16162]/25 to-[#e16162]/10 text-[#e16162]",
              )}
            >
              {result.won ? (
                <LucideIcons.Trophy className="h-8 w-8" />
              ) : (
                <LucideIcons.XCircle className="h-8 w-8" />
              )}
            </div>

            <p
              className={cn(
                "mt-4 text-[11px] font-semibold uppercase tracking-[0.16em]",
                result.won ? "text-[#f9bc60]" : "text-[#e16162]",
              )}
            >
              {result.won ? "Выигрыш" : "Проигрыш"}
            </p>
            <h2
              id="daily-bonus-risk-title"
              className="mt-1 text-xl font-bold tracking-tight text-[#fffffe] sm:text-2xl"
            >
              {result.won ? "Повезло!" : "Не повезло"}
            </h2>
            <p
              id="daily-bonus-risk-desc"
              className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#abd1c6]"
            >
              {result.won ? (
                <>
                  На баланс зачислено{" "}
                  <span className="font-semibold text-[#f9bc60]">
                    +{formatBonuses(result.totalGranted)}
                  </span>{" "}
                  бонусов.
                </>
              ) : result.lostBonuses > 0 ? (
                <>
                  С баланса списано{" "}
                  <span className="font-semibold text-[#e16162]">
                    {formatBonuses(result.lostBonuses)}
                  </span>{" "}
                  бонусов.
                </>
              ) : (
                <>На балансе не было бонусов для списания.</>
              )}
            </p>
          </div>

          <div
            className={cn(
              "mt-5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed",
              result.won
                ? "border-[#f9bc60]/25 bg-[#f9bc60]/8 text-[#abd1c6]"
                : "border-[#e16162]/25 bg-[#e16162]/8 text-[#abd1c6]",
            )}
          >
            Серия посещений сброшена — завтра начнётся с нуля.
          </div>
        </div>
      ) : phase === "loading" ? (
        <div className="flex flex-col items-center px-5 py-10 sm:px-6">
          <LucideIcons.Loader2 className="h-10 w-10 animate-spin text-[#e16162]" />
          <p className="mt-4 text-base font-semibold text-[#fffffe]">
            Крутим удачу...
          </p>
          <p className="mt-2 text-sm text-[#abd1c6]">
            Шанс 1 из {formatBonuses(DAILY_BONUS_RISK_WIN_ODDS)}
          </p>
        </div>
      ) : (
        <div className="border-b border-[#abd1c6]/15 px-5 pb-5 pt-6 sm:px-6">
          <div className="flex gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e16162]/30 bg-[#e16162]/15 text-[#e16162]"
              aria-hidden
            >
              <LucideIcons.Zap size="md" className="shrink-0 opacity-95" />
            </div>
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#abd1c6]/85">
                Ежедневный бонус
              </p>
              <h2
                id="daily-bonus-risk-title"
                className="text-lg font-semibold leading-snug tracking-tight text-[#fffffe] sm:text-xl"
              >
                Рискнуть всем балансом?
              </h2>
              <p
                id="daily-bonus-risk-desc"
                className="text-[15px] leading-relaxed text-[#abd1c6]"
              >
                Шанс выиграть{" "}
                <span className="font-semibold text-[#f9bc60]">
                  +{formatBonuses(DAILY_BONUS_RISK_WIN_AMOUNT)}
                </span>{" "}
                бонусов —{" "}
                <span className="font-semibold text-[#fffffe]">
                  1 из {formatBonuses(DAILY_BONUS_RISK_WIN_ODDS)}
                </span>
                . При проигрыше спишутся все доступные бонусы.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#e16162]/25 bg-[#e16162]/8 px-3.5 py-3">
            <div className="flex items-start gap-2.5">
              <LucideIcons.AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#e16162]" />
              <p className="text-sm leading-relaxed text-[#abd1c6]">
                Риск сбрасывает серию посещений. При проигрыше спишутся все
                доступные бонусы. Сегодня второй раз забрать бонус не получится.
              </p>
            </div>
          </div>
        </div>
      )}
    </GlassModal>
  );
}
