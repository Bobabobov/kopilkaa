"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function LikesPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center"
        >
          <LucideIcons.Heart size="lg" className="text-white" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Загружаем лайки...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Получаем информацию о лайках ваших историй
        </p>
      </motion.div>
    </div>
  );
}
