// app/admin/components/ApplicationsListError.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationsListErrorProps {
  error: string;
}

export default function ApplicationsListError({
  error,
}: ApplicationsListErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 text-center"
    >
      <div className="text-6xl mb-4">❌</div>
      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Ошибка загрузки
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{error}</p>
    </motion.div>
  );
}


