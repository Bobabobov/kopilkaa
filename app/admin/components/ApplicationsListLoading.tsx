// app/admin/components/ApplicationsListLoading.tsx
"use client";
import { motion } from "framer-motion";

export default function ApplicationsListLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card p-12 text-center"
    >
      <div className="text-6xl mb-4">⏳</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Загружаем заявки...
      </h3>
      <p className="text-gray-600 dark:text-gray-400">Пожалуйста, подождите</p>
    </motion.div>
  );
}
