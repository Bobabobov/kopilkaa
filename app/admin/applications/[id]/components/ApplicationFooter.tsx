// app/admin/applications/[id]/components/ApplicationFooter.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationFooterProps {
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicationId: string;
  onDelete: () => void;
}

export default function ApplicationFooter({
  createdAt,
  status,
  applicationId,
  onDelete,
}: ApplicationFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t"
      style={{ borderColor: "rgba(171,209,198,0.2)" }}
    >
      <div
        className="flex items-center gap-2 text-xs sm:text-sm"
        style={{ color: "#abd1c6" }}
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Отправлено: {new Date(createdAt).toLocaleString()}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
        {/* Кнопка "Посмотреть историю" - только для одобренных заявок */}
        {status === "APPROVED" && (
          <a
            href={`/stories/${applicationId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
            style={{ color: "#001e1d" }}
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
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
            <span className="hidden sm:inline">Посмотреть историю</span>
            <span className="sm:hidden">История</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 hidden sm:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}

        {/* Кнопка удаления */}
        <button
          onClick={() => {
            if (
              confirm(
                "Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.",
              )
            ) {
              onDelete();
            }
          }}
          className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Удалить</span>
        </button>
      </div>
    </motion.div>
  );
}
