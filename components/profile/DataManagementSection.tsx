// components/profile/DataManagementSection.tsx
"use client";

interface DataManagementSectionProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export default function DataManagementSection({
  onExportData,
  onDeleteAccount,
}: DataManagementSectionProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Управление данными
      </h3>

      {/* Экспорт данных */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            Экспорт данных
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Скачайте все ваши данные в формате JSON
          </p>
        </div>
        <button
          onClick={onExportData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Экспорт
        </button>
      </div>

      {/* Удаление аккаунта */}
      <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div>
          <h4 className="font-medium text-red-900 dark:text-red-200">
            Удаление аккаунта
          </h4>
          <p className="text-sm text-red-600 dark:text-red-400">
            Это действие нельзя отменить. Все ваши данные будут удалены
            навсегда.
          </p>
        </div>
        <button
          onClick={() => {
            const confirmed = window.confirm(
              "Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить и все ваши данные будут удалены навсегда.",
            );
            if (confirmed) {
              onDeleteAccount();
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
}
