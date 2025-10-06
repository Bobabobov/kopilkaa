"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface LikesPageHeaderProps {
  likesCount: number;
}

export default function LikesPageHeader({ likesCount }: LikesPageHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Навигация */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <LucideIcons.ArrowLeft
            size="sm"
            className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
          />
          <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-medium">
            Назад к профилю
          </span>
        </Link>
      </motion.div>

      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg"
          >
            <LucideIcons.Heart size="lg" className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              Лайки ваших историй
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Люди, которые оценили ваши истории
            </p>
          </div>
        </div>

        {likesCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.6,
              type: "spring",
              stiffness: 200,
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl border border-pink-200 dark:border-pink-700/30"
          >
            <LucideIcons.Heart size="sm" className="text-pink-500" />
            <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">
              {likesCount}{" "}
              {likesCount === 1 ? "лайк" : likesCount < 5 ? "лайка" : "лайков"}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
