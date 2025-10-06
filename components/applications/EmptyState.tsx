"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface EmptyStateProps {
  search: string;
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
}

export function EmptyState({ search, filter }: EmptyStateProps) {
  const hasFilters = search || filter !== "ALL";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700/50 shadow-lg"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center"
      >
        <LucideIcons.FileText size="xl" className="text-emerald-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {hasFilters ? "Заявки не найдены" : "Пока нет заявок"}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {hasFilters
          ? "Попробуйте изменить фильтры или поисковый запрос"
          : "Станьте первым, кто поделится своей историей помощи!"}
      </p>

      {!hasFilters && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <a
            href="/applications"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30"
          >
            <LucideIcons.Plus size="md" />
            Создать заявку
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
