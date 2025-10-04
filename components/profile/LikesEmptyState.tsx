"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

export default function LikesEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-16 text-center border border-white/30 dark:border-gray-700/30 shadow-2xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
        className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 flex items-center justify-center"
      >
        <LucideIcons.Heart size="xl" className="text-pink-500" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Пока нет лайков
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Когда люди будут лайкать ваши истории, они появятся здесь. 
        Поделитесь своими историями, чтобы получить первые лайки!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <LucideIcons.BookOpen size="sm" />
          Читать истории
        </Link>
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <LucideIcons.Plus size="sm" />
          Создать историю
        </Link>
      </div>
    </motion.div>
  );
}
