"use client";

import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <LoadingSpinner label="Загрузка профиля..." />
      </motion.div>
    </div>
  );
}
