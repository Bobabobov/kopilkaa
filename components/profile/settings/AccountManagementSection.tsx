"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AccountManagementSectionProps {
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export default function AccountManagementSection({ 
  onExportData, 
  onDeleteAccount 
}: AccountManagementSectionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await onExportData();
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "УДАЛИТЬ") {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-1"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Управление аккаунтом</h2>
        
        <div className="space-y-4">
          {/* Экспорт данных */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Экспорт данных</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Скачайте все ваши данные в формате JSON
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
              >
                {isExporting ? "Экспорт..." : "Экспорт"}
              </button>
            </div>
          </div>

          {/* Удаление аккаунта */}
          <div className="border border-red-200 dark:border-red-700 rounded-xl p-4 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Удаление аккаунта</h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Это действие необратимо. Все данные будут удалены навсегда.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
              >
                {isDeleting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>

        {/* Модальное окно подтверждения удаления */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Подтверждение удаления
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Это действие необратимо. Все ваши данные будут удалены навсегда.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Введите <strong>УДАЛИТЬ</strong> для подтверждения:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
                placeholder="УДАЛИТЬ"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "УДАЛИТЬ" || isDeleting}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
                >
                  {isDeleting ? "Удаление..." : "Удалить навсегда"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
