"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SecuritySectionProps {
  lastSeen: string;
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export default function SecuritySection({ lastSeen, onPasswordChange }: SecuritySectionProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    // Валидация
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Все поля обязательны");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Новый пароль должен содержать минимум 6 символов");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError("Новый пароль должен отличаться от старого");
      return;
    }

    try {
      const success = await onPasswordChange(oldPassword, newPassword);
      if (success) {
        setPasswordSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
        setPasswordError("Неверный текущий пароль");
      }
    } catch (error) {
      setPasswordError("Ошибка при смене пароля");
    }
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Безопасность</h2>
        
        <div className="space-y-6">
          {/* Последний вход */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Последний вход
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400">
              {new Date(lastSeen).toLocaleString('ru-RU')}
            </div>
          </div>

          {/* Смена пароля */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Пароль
            </label>
            
            {!isChangingPassword ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400">
                  ••••••••
                </div>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Изменить
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Подтвердите новый пароль"
                  />
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}

                {passwordSuccess && (
                  <div className="text-green-500 text-sm">✓ Пароль успешно изменен</div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={cancelPasswordChange}
                    className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
