// app/admin/components/ApplicationsListEmpty.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationsListEmptyProps {
  hasFilters: boolean;
}

export default function ApplicationsListEmpty({
  hasFilters,
}: ApplicationsListEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-12 text-center"
    >
      <div className="text-8xl mb-6">📝</div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Заявки не найдены
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {hasFilters
          ? "Попробуйте изменить поисковый запрос или фильтры"
          : "Пока нет заявок для модерации"}
      </p>
    </motion.div>
  );
}


