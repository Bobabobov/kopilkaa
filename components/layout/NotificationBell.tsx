"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Notification {
  id: string;
  type: "like" | "achievement" | "system";
  title: string;
  message: string;
  avatar?: string | null;
  timestamp: string;
  isRead: boolean;
  rarity?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState<string | null>(null);

  // Загружаем timestamp последнего просмотра из localStorage
  useEffect(() => {
    const savedTimestamp = localStorage.getItem('notifications_last_viewed');
    setLastViewedTimestamp(savedTimestamp);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newNotifications = data.notifications || [];
          setNotifications(newNotifications);
          
          // Считаем только уведомления новее последнего просмотра
          if (lastViewedTimestamp) {
            const newCount = newNotifications.filter(
              notification => new Date(notification.createdAt) > new Date(lastViewedTimestamp)
            ).length;
            setUnreadCount(newCount);
          } else {
            // Если еще никогда не просматривал, показываем все непрочитанные
            setUnreadCount(data.unreadCount || 0);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [lastViewedTimestamp]);

  useEffect(() => {
    // Загружаем уведомления после получения timestamp (включая null для первого раза)
    fetchNotifications();
    
    // Обновляем уведомления каждые 30 секунд
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Сохраняем timestamp при открытии меню
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      const currentTimestamp = new Date().toISOString();
      localStorage.setItem('notifications_last_viewed', currentTimestamp);
      setLastViewedTimestamp(currentTimestamp);
      setUnreadCount(0);
    }
  }, [isOpen, notifications.length]);

  const getNotificationIcon = (type: string, rarity?: string) => {
    switch (type) {
      case "like":
        return <LucideIcons.Heart className="text-red-500" size="sm" />;
      case "achievement":
        return <LucideIcons.Star className="text-yellow-500" size="sm" />;
      default:
        return <LucideIcons.Info className="text-blue-500" size="sm" />;
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'COMMON': return '#94a1b2';
      case 'RARE': return '#abd1c6';
      case 'EPIC': return '#e16162';
      case 'LEGENDARY': return '#f9bc60';
      case 'EXCLUSIVE': return '#ff6b6b';
      default: return '#abd1c6';
    }
  };

  // Закрытие по клику вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.notification-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative notification-dropdown">
      {/* Кнопка колокольчика */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#fffffe] hover:bg-[#abd1c6]/10 transition-all duration-200 border border-[#abd1c6]/20 hover:border-[#abd1c6]/40"
      >
        <LucideIcons.Bell size="md" />
        
        {/* Индикатор непрочитанных уведомлений */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-lg border border-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Выпадающее меню уведомлений */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-gradient-to-br from-[#004643] to-[#001e1d] rounded-2xl shadow-2xl border border-[#abd1c6]/20 overflow-hidden z-50"
          >
            {/* Заголовок */}
            <div className="p-4 border-b border-[#abd1c6]/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#fffffe]">Уведомления</h3>
                {notifications.length > 0 && (
                  <span className="text-xs text-[#abd1c6]/60">
                    {notifications.length} всего
                  </span>
                )}
              </div>
            </div>

            {/* Список уведомлений */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <LucideIcons.Loader2 className="text-[#abd1c6] animate-spin mx-auto mb-2" size="lg" />
                  <p className="text-sm text-[#abd1c6]">Загрузка...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <LucideIcons.Bell className="text-[#abd1c6]/60 mx-auto mb-2" size="lg" />
                  <p className="text-sm text-[#abd1c6]">Нет уведомлений</p>
                </div>
              ) : (
                <div className="divide-y divide-[#abd1c6]/10">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-[#abd1c6]/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {/* Аватар или иконка */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#004643] flex items-center justify-center flex-shrink-0 border border-[#abd1c6]/20">
                          {notification.avatar ? (
                            <img
                              src={notification.avatar}
                              alt="Аватар"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#abd1c6]/20">
                              {getNotificationIcon(notification.type, notification.rarity)}
                            </div>
                          )}
                        </div>

                        {/* Контент */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-[#fffffe] text-sm">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-[#abd1c6]/60 flex-shrink-0">
                              {notification.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-[#abd1c6] line-clamp-2">
                            {notification.message}
                          </p>
                          
                          {/* Индикатор достижения */}
                          {notification.type === "achievement" && notification.rarity && (
                            <div 
                              className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: getRarityColor(notification.rarity) + '20',
                                color: getRarityColor(notification.rarity)
                              }}
                            >
                              {notification.rarity}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Футер */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#abd1c6]/20 bg-[#001e1d]/50">
                <button className="w-full text-xs text-[#abd1c6] hover:text-[#fffffe] transition-colors text-center py-1">
                  Показать все уведомления
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
