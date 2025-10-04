// app/admin/components/StatusModal.tsx
import { motion } from "framer-motion";
import { StatusModal as StatusModalType, ApplicationStatus } from "../types";

interface StatusModalProps {
  modal: StatusModalType;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onCommentChange: (comment: string) => void;
  onSave: () => Promise<void>;
}

export default function StatusModal({
  modal,
  onClose,
  onStatusChange,
  onCommentChange,
  onSave
}: StatusModalProps) {
  if (!modal.id) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Сменить статус заявки</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Новый статус
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              value={modal.status}
              onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
            >
              <option value="PENDING">⏳ В обработке</option>
              <option value="APPROVED">✅ Одобрено</option>
              <option value="REJECTED">❌ Отказано</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Комментарий администратора
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white min-h-[120px] resize-none"
              value={modal.comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Причина решения / уточнения для автора..."
            />
          </div>

          <div className="flex items-center gap-4 justify-end pt-4">
            <button
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl transition-all duration-300 hover:scale-105 font-medium"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
              onClick={onSave}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

























