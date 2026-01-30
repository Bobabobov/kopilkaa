// app/admin/applications/[id]/components/ApplicationMetaInfo.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationMetaInfoProps {
  amount: number;
  userEmail: string;
  summary: string;
  onCopyEmail: (email: string) => void;
  filledMs?: number | null;
}

export default function ApplicationMetaInfo({
  amount,
  userEmail,
  summary,
  onCopyEmail,
  filledMs,
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
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        {/* Сумма запроса */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 rounded-xl border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]"
          style={{
            backgroundColor: "#0b1615",
            borderColor: "rgba(249,188,96,0.25)",
          }}
        >
          <span
            className="font-bold text-xl sm:text-2xl"
            style={{ color: "#f9bc60" }}
          >
            ₽{amount.toLocaleString()}
          </span>
          <span
            className="text-xs sm:text-sm font-medium"
            style={{ color: "#abd1c6" }}
          >
            Сумма запроса
          </span>
        </div>

        {/* Автор */}
        <div
          className="flex items-center gap-2 text-sm rounded-xl p-3 sm:p-4 border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]"
          style={{
            backgroundColor: "#0b1615",
            borderColor: "rgba(171,209,198,0.2)",
          }}
        >
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
          <span className="font-medium" style={{ color: "#abd1c6" }}>
            Автор:
          </span>
          <button
            onClick={() => onCopyEmail(userEmail)}
            className="group relative flex items-center gap-1 px-2 py-1 rounded-lg bg-[#004643]/60 border border-[#abd1c6]/20 hover:border-[#f9bc60] hover:bg-[#004643] transition-all duration-200"
            title="Нажмите чтобы скопировать email"
          >
            <span
              className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
              style={{ color: "#f9bc60" }}
            >
              {userEmail.replace(/(.{2}).*(@.*)/, "$1***$2")}
            </span>
            <svg
              className="w-3 h-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "#f9bc60" }}
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
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 rounded-xl border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]"
            style={{
              backgroundColor: "#0b1615",
              borderColor: "rgba(171,209,198,0.2)",
            }}
          >
            <span
              className="font-semibold text-lg sm:text-xl"
              style={{ color: "#abd1c6" }}
            >
              {formattedTime}
            </span>
            <span
              className="text-xs sm:text-sm font-medium"
              style={{ color: "#94a1b2" }}
            >
              Время заполнения формы
            </span>
          </div>
        )}
      </motion.div>

      {/* Краткое описание */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6"
      >
        <div
          className="text-base sm:text-lg break-words leading-relaxed rounded-xl p-4 sm:p-6 border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]"
          style={{
            backgroundColor: "#0b1615",
            borderColor: "rgba(171,209,198,0.2)",
            color: "#e8f2ef",
          }}
        >
          {summary}
        </div>
      </motion.div>
    </>
  );
}
