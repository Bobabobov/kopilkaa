"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

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
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <LucideIcons.ChevronLeft size="xs" />
        <span className="hidden sm:inline">Назад</span>
      </motion.button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(3, pages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(pages - 2, page - 1)) + i;
          if (pageNum > pages) return null;

          return (
            <motion.button
              key={pageNum}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
                pageNum === page
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
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="hidden sm:inline">Вперёд</span>
        <LucideIcons.ChevronRight size="xs" />
      </motion.button>
    </motion.div>
  );
}






