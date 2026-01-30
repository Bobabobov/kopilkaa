"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

type PaginationVariant = "applications" | "stories" | "admin";

interface PaginationProps {
  variant: PaginationVariant;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  variant,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  if (variant === "applications") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xs sm:text-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <LucideIcons.ChevronLeft size="xs" />
          <span className="hidden sm:inline">Назад</span>
        </motion.button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            const pageNum =
              Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
            if (pageNum > totalPages) return null;

            return (
              <motion.button
                key={pageNum}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
                  pageNum === currentPage
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-md"
                }`}
              >
                {pageNum}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xs sm:text-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden sm:inline">Вперёд</span>
          <LucideIcons.ChevronRight size="xs" />
        </motion.button>
      </motion.div>
    );
  }

  if (variant === "stories") {
    const getVisiblePages = () => {
      const delta = 2;
      const range: number[] = [];
      const rangeWithDots: (number | string)[] = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center gap-2 mt-12"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{ borderColor: "#abd1c6/30" }}
        >
          <LucideIcons.ChevronLeft size="sm" />
          <span className="hidden sm:inline">Предыдущая</span>
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2" style={{ color: "#2d5a4e" }}>
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === page
                      ? "text-white shadow-lg"
                      : "bg-white/90 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                  }`}
                  style={
                    currentPage === page
                      ? {
                          background:
                            "linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)",
                          borderColor: "#f9bc60",
                        }
                      : {
                          borderColor: "#abd1c6/30",
                        }
                  }
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{ borderColor: "#abd1c6/30" }}
        >
          <span className="hidden sm:inline">Следующая</span>
          <LucideIcons.ChevronRight size="sm" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center mt-12"
    >
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад
        </button>

        <div className="flex items-center gap-2 px-4 py-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg scale-110"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                }`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="text-gray-400">...</span>
              <button
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-blue-500 text-white shadow-lg scale-110"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                }`}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Вперёд
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
