"use client";
import { motion } from "framer-motion";

export default function SuccessScreen() {
  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-md text-center"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Аккаунт создан!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Перенаправляем вас в профиль...
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full animate-pulse"
            style={{ width: "100%" }}
          ></div>
        </div>
      </motion.div>
    </div>
  );
}






