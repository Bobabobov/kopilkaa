"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  getApplicationSubmitButtonLabel,
  type ApplicationEligibility,
} from "@/lib/applications/applicationEconomy";
import { formatCooldownRemaining, INSUFFICIENT_BONUSES_ERROR } from "@/lib/level-config";
import { formatAmount } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SubmitSectionProps {
  submitting: boolean;
  uploading: boolean;
  left: number | null;
  err: string | null;
  eligibility?: ApplicationEligibility | null;
  isAdmin?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmitSection({
  submitting,
  uploading,
  left,
  err,
  eligibility = null,
  isAdmin = false,
  onSubmit,
}: SubmitSectionProps) {
  const submitLabel = getApplicationSubmitButtonLabel({
    submitCost: eligibility?.submitCost ?? 0,
    isAdmin,
  });

  const cooldownBlocked =
    eligibility != null &&
    eligibility.cooldownRemainingMs != null &&
    eligibility.cooldownRemainingMs > 0;

  const insufficientBonuses =
    eligibility != null &&
    !isAdmin &&
    eligibility.submitCost > 0 &&
    eligibility.submitCost > eligibility.availableBonuses;

  const disabled =
    submitting || uploading || cooldownBlocked || insufficientBonuses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      {insufficientBonuses && eligibility != null && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          role="alert"
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 border-[#e16162]/70",
            "bg-gradient-to-br from-[#e16162]/25 via-[#e16162]/12 to-[#001e1d]/40",
            "p-4 sm:p-5 shadow-[0_0_28px_rgba(225,97,98,0.22)]",
          )}
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#e16162]/20 blur-2xl" />
          <div className="relative flex gap-3 sm:gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e16162]/50 bg-[#e16162]/20 text-[#ffb4b4]"
              aria-hidden
            >
              <LucideIcons.Alert size="md" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-base font-bold leading-snug text-[#ffb4b4] sm:text-lg">
                {INSUFFICIENT_BONUSES_ERROR}
              </p>
              <p className="text-sm leading-relaxed text-[#fffffe]/90">
                Нужно{' '}
                <span className="font-semibold text-[#f9bc60]">
                  {formatAmount(eligibility.submitCost)} бонусов
                </span>
                , на балансе сейчас{' '}
                <span className="font-semibold text-[#fffffe]">
                  {formatAmount(eligibility.availableBonuses)}
                </span>
                .
              </p>
              <p className="text-xs sm:text-sm text-[#abd1c6]">
                Бонусы можно копить или обменивать на опыт. Получите ежедневный
                бонус и выполняйте добрые дела.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f9bc60] underline-offset-2 hover:underline"
              >
                Перейти в профиль
                <LucideIcons.ArrowRight size="xs" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <motion.button
        whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className={cn(
          "relative w-full px-8 py-4 text-[#001e1d] font-bold rounded-xl transition-all overflow-hidden group",
          "hover:opacity-90",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "disabled:from-[#8b969f] disabled:via-[#9aa3ab] disabled:to-[#8b969f] disabled:text-[#0f1f1c]",
        )}
        style={{
          background:
            submitting || uploading
              ? "linear-gradient(135deg, #8b969f 0%, #9aa3ab 100%)"
              : "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
          boxShadow:
            submitting || uploading
              ? "none"
              : "0 8px 24px rgba(249, 188, 96, 0.25)",
        }}
      >
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent block"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative z-10 inline-flex items-center justify-center gap-3">
          {submitting ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Refresh size="sm" />
              </motion.span>
              <span>Отправка истории...</span>
            </>
          ) : uploading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Upload size="sm" />
              </motion.span>
              <span>Загрузка фото...</span>
            </>
          ) : (
            <>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <LucideIcons.Send size="sm" />
              </motion.span>
              <span>{submitLabel}</span>
            </>
          )}
        </span>
      </motion.button>

      {(uploading || submitting) && (
        <p className="text-center text-sm text-[#abd1c6]/90">
          В браузере Telegram и на мобильном интернете это может занять 1–2
          минуты. Не закрывайте страницу.
        </p>
      )}

      {eligibility != null &&
        !isAdmin &&
        eligibility.submitCost > 0 && (
          <p className="text-center text-xs text-[#94a1b2]">
            При отправке спишется {eligibility.submitCost} бонусов. Если материал
            отклонят, бонусы не возвращаются.
          </p>
        )}

      {cooldownBlocked && eligibility.cooldownRemainingMs != null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-[#f9bc60]">
            <LucideIcons.Clock size="sm" />
            <span>
              Следующую историю можно опубликовать через:{' '}
              {formatCooldownRemaining(eligibility.cooldownRemainingMs)}
            </span>
          </div>
        </motion.div>
      )}

      {left !== null && !cooldownBlocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              left > 0
                ? "text-lime-700 dark:text-lime-300"
                : "text-green-700 dark:text-green-300"
            }`}
          >
            <LucideIcons.Clock size="sm" />
            <span>
              {left > 0
                ? `Следующую историю можно опубликовать через: ${formatCooldownRemaining(left)}`
                : "Можете отправить историю"}
            </span>
          </div>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 border border-[#e16162]/50 rounded-xl bg-[#e16162]/10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 text-[#e16162]">
            <LucideIcons.Alert size="sm" />
            <span>{err}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
