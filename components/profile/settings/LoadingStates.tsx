"use client";

import { motion } from "framer-motion";

export function SettingsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Загрузка настроек...</p>
      </motion.div>
    </div>
  );
}

export function SettingsUnauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/20"
      >
        <div className="text-8xl mb-6">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Доступ ограничен
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Войдите в аккаунт, чтобы изменить настройки
        </p>
        <a
          href="/login"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Войти в аккаунт
        </a>
      </motion.div>
    </div>
  );
}



