// app/admin/applications/[id]/components/ApplicationMetaInfo.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationMetaInfoProps {
  amount: number;
  userEmail: string;
  summary: string;
  onCopyEmail: (email: string) => void;
  filledMs?: number | null;
  /** Локализованное название категории помощи */
  categoryLabel?: string | null;
}

export default function ApplicationMetaInfo({
  amount,
  userEmail,
  summary,
  onCopyEmail,
  filledMs,
  categoryLabel,
}: ApplicationMetaInfoProps) {
  const formattedTime = (() => {
    if (typeof filledMs !== "number" || !Number.isFinite(filledMs)) return null;
    const totalSec = Math.max(0, Math.round(filledMs / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min === 0) return `${sec} c`;
    return `${min} мин ${sec.toString().padStart(2, "0")} c`;
  })();

  return (
    <>
      {/* Сумма, автор и краткое описание */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        {/* Сумма запроса */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-[#f9bc60]/40 bg-[#f9bc60]/10 backdrop-blur-sm min-w-0 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
          <span className="font-bold text-xl sm:text-2xl text-[#f9bc60]">
            ₽{amount.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#abd1c6]">
            Сумма запроса
          </span>
        </div>

        {/* Автор */}
        <div className="flex items-center gap-2 text-sm rounded-2xl p-2.5 sm:p-4 border border-[#abd1c6]/35 bg-[#001e1d]/40 backdrop-blur-sm min-w-0 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "#abd1c6" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-medium text-[#abd1c6]">Автор:</span>
          <button
            onClick={() => onCopyEmail(userEmail)}
            className="group relative flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#f9bc60]/40 hover:bg-white/10 transition-all duration-200"
            title="Нажмите чтобы скопировать email"
          >
            <span className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none text-[#f9bc60]">
              {userEmail.replace(/(.{2}).*(@.*)/, "$1***$2")}
            </span>
            <svg
              className="w-3 h-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-[#f9bc60]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>

        {/* Время заполнения */}
        {formattedTime && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-[#abd1c6]/35 bg-[#004643]/50 backdrop-blur-sm min-w-0 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
            <span className="font-semibold text-lg sm:text-xl text-[#abd1c6]">
              {formattedTime}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#94a1b2]">
              Время заполнения формы
            </span>
          </div>
        )}
      </motion.div>

      {/* Категория помощи */}
      {categoryLabel ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mb-4"
        >
          <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-[#abd1c6]/35 bg-[#001e1d]/45 px-3 py-2 sm:px-4 sm:py-2.5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
              Категория
            </span>
            <span className="text-sm font-semibold text-[#f9bc60]">
              {categoryLabel}
            </span>
          </div>
        </motion.div>
      ) : null}

      {/* Краткое описание */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6"
      >
        <div className="text-sm sm:text-base lg:text-lg break-words leading-relaxed rounded-2xl border border-[#abd1c6]/30 bg-[#004643]/60 backdrop-blur-sm p-3 sm:p-5 lg:p-6 min-w-0 text-[#e8f2ef] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          {summary}
        </div>
      </motion.div>
    </>
  );
}
