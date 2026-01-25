"use client";

import { motion } from "framer-motion";

export default function AdminLoading() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Заголовок */}
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: "#fffffe" }}
              >
                🔧 Админ Панель
              </h1>
              <p className="text-lg" style={{ color: "#abd1c6" }}>
                Управление заявками и статистика платформы
              </p>
            </div>
          </div>

          {/* Загрузка статистики */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-gray-600/10"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Загрузка панели управления */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3 animate-pulse"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Загрузка списка заявок */}
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                  </div>

                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Центральный индикатор загрузки */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  Загрузка админ-панели...
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
