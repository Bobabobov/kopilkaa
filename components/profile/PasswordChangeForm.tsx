// components/profile/PasswordChangeForm.tsx
"use client";

interface PasswordChangeFormProps {
  isChangingPassword: boolean;
  passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  passwordError: string;
  onPasswordDataChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onStartChange: () => void;
}

export default function PasswordChangeForm({
  isChangingPassword,
  passwordData,
  passwordError,
  onPasswordDataChange,
  onSubmit,
  onCancel,
  onStartChange,
}: PasswordChangeFormProps) {
  if (!isChangingPassword) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
          ••••••••
        </div>
        <button
          onClick={onStartChange}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Изменить
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Текущий пароль
        </label>
        <input
          type="password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            onPasswordDataChange({
              ...passwordData,
              oldPassword: e.target.value,
            })
          }
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="Введите текущий пароль"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Новый пароль
        </label>
        <input
          type="password"
          value={passwordData.newPassword}
          onChange={(e) =>
            onPasswordDataChange({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="Введите новый пароль"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Подтвердите пароль
        </label>
        <input
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            onPasswordDataChange({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="Подтвердите новый пароль"
        />
      </div>

      {passwordError && (
        <div className="text-red-500 text-sm">{passwordError}</div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          Сохранить
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
