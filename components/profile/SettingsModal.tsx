"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import SettingsHeader from "@/components/profile/settings/SettingsHeader";
import AvatarUpload from "@/components/profile/AvatarUpload";
import AvatarFrameCustomization from "@/components/profile/AvatarFrameCustomization";
import NameEditor from "@/components/profile/settings/NameEditor";
import EmailEditor from "@/components/profile/settings/EmailEditor";
import EmailVisibilityToggle from "@/components/profile/settings/EmailVisibilityToggle";
import { SettingsLoading, SettingsUnauthorized } from "@/components/profile/settings/LoadingStates";
import { LucideIcons } from "@/components/ui/LucideIcons";

type User = { 
  id: string; 
  email: string; 
  role: "USER" | "ADMIN"; 
  name?: string | null; 
  createdAt: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  lastSeen?: string;
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isFrameModalOpen, setIsFrameModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const { showToast, ToastComponent } = useBeautifulToast();
  
  // Локальные уведомления
  const [localNotification, setLocalNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Горячие клавиши и блокировка прокрутки
  useEffect(() => {
    if (!isOpen) return;

    // Блокируем прокрутку фона более надежно
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    
    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;
    
    // Блокируем прокрутку
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Восстанавливаем прокрутку плавно
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      
      // Плавно восстанавливаем позицию прокрутки
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'instant'
        });
      });
    };
  }, [isOpen, onClose]);

  // Функция для показа локального уведомления
  const showLocalNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setLocalNotification({ show: true, type, title, message });
    setTimeout(() => {
      setLocalNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };


  // Загрузка данных пользователя
  useEffect(() => {
    if (!isOpen) return;
    
    const loadUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error loading profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [isOpen]);

  const handleNameChange = async (newName: string) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const response = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      });

      if (response.ok) {
        setUser({ ...user, name: newName });
        showLocalNotification('success', 'Успех', 'Имя обновлено');
      } else {
        const data = await response.json();
        showLocalNotification('error', 'Ошибка', data.error || "Не удалось обновить имя");
      }
    } catch (error) {
      console.error("Error updating name:", error);
      showLocalNotification('error', 'Ошибка', "Не удалось обновить имя");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async (newEmail: string) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const response = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail })
      });

      if (response.ok) {
        setUser({ ...user, email: newEmail });
        showLocalNotification('success', 'Успех', 'Email обновлен');
      } else {
        const data = await response.json();
        showLocalNotification('error', 'Ошибка', data.error || "Не удалось обновить email");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      showLocalNotification('error', 'Ошибка', "Не удалось обновить email");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailVisibilityChange = async (hideEmail: boolean) => {
    if (!user) return;
    
    try {
      const response = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hideEmail })
      });

      if (response.ok) {
        setUser({ ...user, hideEmail });
        showLocalNotification('success', 'Успех', hideEmail ? 'Email скрыт' : 'Email виден');
      } else {
        const data = await response.json();
        showLocalNotification('error', 'Ошибка', data.error || "Не удалось обновить настройки видимости email");
      }
    } catch (error) {
      console.error("Error updating email visibility:", error);
      showLocalNotification('error', 'Ошибка', "Не удалось обновить настройки видимости email");
    }
  };

  const handleAvatarChange = (avatarUrl: string | null) => {
    if (!user) return;
    setUser({ ...user, avatar: avatarUrl });
  };

  const handleFrameChange = (frame: string) => {
    if (!user) return;
    setUser({ ...user, avatarFrame: frame });
  };

  const handlePasswordChange = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (response.ok) {
        showLocalNotification('success', 'Успех', 'Пароль изменен');
        return true;
      } else {
        const data = await response.json();
        showLocalNotification('error', 'Ошибка', data.error || "Не удалось изменить пароль");
        return false;
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showLocalNotification('error', 'Ошибка', "Не удалось изменить пароль");
      return false;
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    
    // Валидация
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Все поля обязательны");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Новый пароль должен содержать минимум 6 символов");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError("Новый пароль должен отличаться от старого");
      return;
    }

    try {
      const success = await handlePasswordChange(passwordData.oldPassword, passwordData.newPassword);
      if (success) {
        setIsChangingPassword(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      setPasswordError("Ошибка при смене пароля");
    }
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/profile/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kopilka-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showLocalNotification('success', 'Успех', 'Данные экспортированы');
      } else {
        showLocalNotification('error', 'Ошибка', 'Не удалось экспортировать данные');
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      showLocalNotification('error', 'Ошибка', 'Не удалось экспортировать данные');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE"
      });

      if (response.ok) {
        showLocalNotification('success', 'Успех', 'Аккаунт удален');
        // Перенаправляем на главную страницу
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showLocalNotification('error', 'Ошибка', 'Не удалось удалить аккаунт');
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showLocalNotification('error', 'Ошибка', 'Не удалось удалить аккаунт');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="settings-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="settings-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок модалки */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <LucideIcons.Settings size="lg" className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Настройки профиля</h2>
                  <p className="text-gray-200">Управление вашим аккаунтом</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-6 mb-4 p-4 rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(to right, #abd1c6/20, #f9bc60/20)', borderColor: '#abd1c6' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f9bc60' }}>
                    <span className="text-white text-sm">
                      {localNotification.type === 'success' ? '✓' : 
                       localNotification.type === 'error' ? '✗' : 'ℹ'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#001e1d' }}>{localNotification.title}</div>
                    <div className="text-sm" style={{ color: '#abd1c6' }}>{localNotification.message}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {loading ? (
              <SettingsLoading />
            ) : !user ? (
              <SettingsUnauthorized />
            ) : (
              <div className="space-y-8">
                {/* Аватарка */}
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <AvatarUpload
                      currentAvatar={user.avatar}
                      userName={user.name || user.email}
                      avatarFrame={user.avatarFrame}
                      onAvatarChange={handleAvatarChange}
                      onFrameChange={() => setIsFrameModalOpen(true)}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Аватарка</h3>
                    <p className="text-gray-600 dark:text-gray-400">Загрузите изображение для вашего профиля</p>
                  </div>
                </div>

                {/* Имя */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя
                  </label>
                  <NameEditor
                    currentName={user.name || ""}
                    onSave={handleNameChange}
                    disabled={false}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <EmailEditor
                    currentEmail={user.email}
                    onSave={handleEmailChange}
                    disabled={false}
                  />
                </div>

                {/* Видимость email */}
                <EmailVisibilityToggle
                  hideEmail={user.hideEmail ?? true}
                  onToggle={handleEmailVisibilityChange}
                  disabled={saving}
                />

                {/* Дата регистрации */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Дата регистрации
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </div>
                </div>

                {/* Последний вход */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Последний вход
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(user.lastSeen || user.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>

                {/* Пароль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Пароль
                  </label>
                  
                  {!isChangingPassword ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        ••••••••
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
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
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
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
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          placeholder="Подтвердите новый пароль"
                        />
                      </div>

                      {passwordError && (
                        <div className="text-red-500 text-sm">{passwordError}</div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={handlePasswordSubmit}
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

                {/* Экспорт данных */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Управление данными</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Экспорт данных</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Скачайте все ваши данные в формате JSON</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Экспорт
                    </button>
                  </div>
                </div>

                {/* Удаление аккаунта */}
                <div className="border-t border-red-200 dark:border-red-800 pt-6">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-400">Удаление аккаунта</h4>
                      <p className="text-sm text-red-700 dark:text-red-300">Это действие необратимо. Все данные будут удалены навсегда.</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Toast уведомления */}
      <ToastComponent key="toast-component" />


      {/* Модальное окно выбора рамки аватарки */}
      {user && (
        <AvatarFrameCustomization
          key="avatar-frame-modal"
          user={user}
          onFrameChange={handleFrameChange}
          isOpen={isFrameModalOpen}
          onClose={() => setIsFrameModalOpen(false)}
        />
      )}
    </AnimatePresence>
  );
}
