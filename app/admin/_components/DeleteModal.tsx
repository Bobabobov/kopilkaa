"use client";

interface DeleteModalProps {
  id: string;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  id,
  title,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!id) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 my-auto">
        <div className="text-center">
          <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">🗑️</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Удалить заявку?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">
            Вы уверены, что хотите удалить заявку
          </p>
          <p className="text-sm text-red-500 font-medium mb-6 sm:mb-8 break-words">"{title}"?</p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={onClose}
              className="min-h-[44px] px-6 py-3 bg-white/90 backdrop-blur-xl hover:bg-gray-50 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl touch-manipulation"
              style={{
                borderColor: "#abd1c6/30",
                color: "#2d5a4e",
              }}
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              className="min-h-[44px] px-6 py-3 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl touch-manipulation"
              style={{
                background: "linear-gradient(135deg, #e16162 0%, #d63384 100%)",
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
