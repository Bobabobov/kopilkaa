"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { msToHuman } from "@/lib/time";
import { cn } from "@/lib/utils";

interface SubmitSectionProps {
  submitting: boolean;
  uploading: boolean;
  rewardedLoading: boolean;
  rewardedPassed: boolean;
  rewardedUnavailable: boolean;
  left: number | null;
  err: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onFallbackSubmit: (e: React.FormEvent) => void;
}

export default function SubmitSection({
  submitting,
  uploading,
  rewardedLoading,
  rewardedPassed,
  rewardedUnavailable,
  left,
  err,
  onSubmit,
  onFallbackSubmit,
}: SubmitSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        disabled={submitting || uploading || rewardedLoading}
        onClick={onSubmit}
        className={cn(
          "relative w-full px-8 py-4 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60]",
          "hover:from-[#e8a545] hover:via-[#f9bc60] hover:to-[#e8a545]",
          "text-[#001e1d] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#f9bc60]/40 overflow-hidden group",
          "disabled:cursor-not-allowed disabled:opacity-90",
          "disabled:bg-gradient-to-r disabled:from-[#8b969f] disabled:via-[#9aa3ab] disabled:to-[#8b969f]",
          "disabled:text-[#0f1f1c] disabled:shadow-[0_0_0_1px_rgba(249,188,96,0.28)] disabled:border disabled:border-[#f9bc60]/30",
        )}
      >
        {/* Анимированный фон */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent block"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        ></motion.span>
        <span className="relative z-10 inline-flex items-center justify-center gap-3">
          {submitting ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Refresh size="sm" />
              </motion.span>
              <span>Отправка заявки...</span>
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
          ) : rewardedLoading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Refresh size="sm" />
              </motion.span>
              <span>Готовим рекламу...</span>
            </>
          ) : (
            <>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <LucideIcons.Send size="sm" />
              </motion.span>
              <span>
                {rewardedPassed ? "Отправить заявку" : "Посмотреть рекламу и отправить заявку"}
              </span>
            </>
          )}
        </span>
      </motion.button>

      {!rewardedPassed && (
        <p className="text-center text-xs text-[#94a1b2] leading-relaxed">
          В режиме инкогнито или с блокировщиками реклама может не загрузиться. Если не появляется —
          отключите блокировку или используйте кнопку отправки без рекламы.
        </p>
      )}

      {rewardedUnavailable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-center text-sm text-[#e16162]">
            Реклама сейчас недоступна. Вы можете отправить заявку без просмотра.
          </p>
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            disabled={submitting || uploading || rewardedLoading}
            onClick={onFallbackSubmit}
            className={cn(
              "w-full px-6 py-3 rounded-xl border border-[#f9bc60]/40 text-[#f9bc60] font-semibold",
              "bg-[#001e1d]/40 hover:bg-[#001e1d]/60 transition-all duration-200",
              "disabled:opacity-70 disabled:cursor-not-allowed",
            )}
          >
            Отправить заявку без рекламы
          </motion.button>
        </motion.div>
      )}
      {left !== null && (
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
                ? `Лимит: 1 заявка в 24 часа (осталось ${msToHuman(left)})`
                : "Можете отправить заявку"}
            </span>
          </div>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 border-2 border-[#e16162]/50 rounded-xl bg-gradient-to-br from-[#e16162]/10 to-[#d14d4e]/5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 text-[#e16162]">
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <LucideIcons.Alert size="sm" />
            </motion.span>
            <span className="font-semibold">{err}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
