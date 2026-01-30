"use client";

import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <LoadingSpinner label="Загрузка профиля..." />
      </motion.div>
    </div>
  );
}
