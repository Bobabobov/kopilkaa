"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { RARITY_NAMES, AchievementRarity } from "@/lib/achievements/types";

type FriendsTab = "friends" | "sent" | "received" | "search";

interface Notification {
  id: string;
  type: "like" | "achievement" | "system" | "application_status" | "friend_request";
  title: string;
  message: string;
  avatar?: string | null;
  timestamp: string;
  createdAt: string;
  isRead: boolean;
  rarity?: string;
  applicationId?: string;
  status?: "APPROVED" | "REJECTED";
  friendshipId?: string;
  requesterId?: string;
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchInProgressRef = useRef(false);
  const hasFetchedOnOpenRef = useRef(false);

  // Загружаем timestamp последнего просмотра из localStorage
  useEffect(() => {
    try {
      const savedTimestamp = localStorage.getItem('notifications_last_viewed');
      if (savedTimestamp) {
        setLastViewedTimestamp(savedTimestamp);
      }
    } catch (error) {
      // localStorage может быть недоступен
      console.warn('localStorage недоступен:', error);
    }
  }, []);

  // Проверка монтирования для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Вычисляем позицию меню для мобильных с debounce
  const updateMenuPosition = useCallback(() => {
    if (buttonRef.current && typeof window !== 'undefined') {
      const rect = buttonRef.current.getBoundingClientRect();
      // Используем getBoundingClientRect для получения позиции относительно viewport
      // Это работает с fixed позиционированием
      setMenuPosition({
        top: rect.bottom + 8, // Позиция относительно viewport (не документа)
        right: 8,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
      
      // Обновляем позицию при изменении размера окна
      const handleResize = () => {
        updateMenuPosition();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, updateMenuPosition]);

  const dispatchFriendRequestEventRef = useRef((count: number) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("friend-requests-updated", {
          detail: { count },
        }),
      );
    }
  });

  const fetchNotifications = useCallback(async (silent = false) => {
    // Предотвращаем параллельные запросы
    if (fetchInProgressRef.current) {
      return;
    }
    
    fetchInProgressRef.current = true;
    
    try {
      if (!silent) {
        setLoading(true);
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Таймаут 2 секунды
      
      const response = await fetch("/api/notifications", {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newNotifications = data.notifications || [];
          setNotifications(newNotifications);

          const friendRequestCount = newNotifications.filter(
            (notification: Notification) => notification.type === "friend_request",
          ).length;
          dispatchFriendRequestEventRef.current(friendRequestCount);
          
          // Счетчик будет обновлен через отдельный useEffect
        }
      }
    } catch (error) {
      // Игнорируем ошибки (таймауты, отмены и т.д.)
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Error fetching notifications:", error);
      }
    } finally {
      fetchInProgressRef.current = false;
      if (!silent) {
        setLoading(false);
      }
    }
  }, []); // Нет зависимостей, чтобы функция не пересоздавалась

  // Первичная загрузка, чтобы показывать индикатор (только один раз)
  useEffect(() => {
    fetchNotifications(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Загружаем только при монтировании

  // Загружаем уведомления только при открытии меню (один раз)
  useEffect(() => {
    if (isOpen && !hasFetchedOnOpenRef.current && !fetchInProgressRef.current) {
      hasFetchedOnOpenRef.current = true;
      fetchNotifications();
    }
    
    // Сбрасываем флаг при закрытии меню
    if (!isOpen) {
      hasFetchedOnOpenRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Только isOpen, чтобы избежать циклов

  // Обновляем счетчик при изменении timestamp или уведомлений
  useEffect(() => {
    if (notifications.length === 0) {
      setUnreadCount(0);
      return;
    }

    // Используем только timestamp для определения непрочитанных
    // API не возвращает isRead, поэтому полагаемся только на timestamp
    if (lastViewedTimestamp) {
      const viewedDate = new Date(lastViewedTimestamp).getTime();
      const unreadCount = notifications.filter((notification: Notification) => {
        const notificationDate = new Date(notification.createdAt).getTime();
        // Уведомление непрочитано, если оно создано после последнего просмотра
        return notificationDate > viewedDate;
      }).length;
      
      setUnreadCount(unreadCount);
    } else {
      // Если нет timestamp, все уведомления считаются непрочитанными
      setUnreadCount(notifications.length);
    }
  }, [lastViewedTimestamp, notifications]);

  // Сохраняем timestamp при открытии меню и обнуляем счетчик
  const hasMarkedAsViewed = useRef(false);
  
  useEffect(() => {
    if (isOpen && !hasMarkedAsViewed.current) {
      // Сохраняем timestamp сразу при открытии
      try {
        const currentTimestamp = new Date().toISOString();
        localStorage.setItem('notifications_last_viewed', currentTimestamp);
        setLastViewedTimestamp(currentTimestamp);
        
        // Сразу обнуляем счетчик - если пользователь открыл меню, значит просмотрел все
        setUnreadCount(0);
        
        hasMarkedAsViewed.current = true;
      } catch (error) {
        console.warn('Не удалось сохранить timestamp:', error);
      }
    }
    
    // Сбрасываем флаг при закрытии меню
    if (!isOpen) {
      hasMarkedAsViewed.current = false;
    }
  }, [isOpen]);

  const getRarityLabel = (rarity?: string) => {
    if (!rarity) return "";
    return RARITY_NAMES[rarity as AchievementRarity] || rarity;
  };

  useEffect(() => {
    const handleFriendsUpdated = () => {
      if (!fetchInProgressRef.current) {
        fetchNotifications(true);
      }
    };

    window.addEventListener("friends-updated", handleFriendsUpdated);
    return () => {
      window.removeEventListener("friends-updated", handleFriendsUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только при монтировании

  const getNotificationIcon = (type: string, rarity?: string, status?: string) => {
    switch (type) {
      case "like":
        return <LucideIcons.Heart className="text-red-500" size="sm" />;
      case "achievement":
        return <LucideIcons.Star className="text-yellow-500" size="sm" />;
      case "friend_request":
        return <LucideIcons.UserPlus className="text-[#f9bc60]" size="sm" />;
      case "application_status":
        if (status === "APPROVED") {
          return <LucideIcons.CheckCircle className="text-[#10B981]" size="sm" />;
        } else if (status === "REJECTED") {
          return <LucideIcons.XCircle className="text-red-500" size="sm" />;
        }
        return <LucideIcons.FileText className="text-blue-500" size="sm" />;
      default:
        return <LucideIcons.Info className="text-blue-500" size="sm" />;
    }
  };

  const openFriendsModal = useCallback((tab: FriendsTab) => {
    router.push(`/friends?tab=${tab}`);
  }, [router]);

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

  // Закрытие по клику вне области и по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notification-dropdown') && !target.closest('[data-notification-menu]')) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative notification-dropdown">
      {/* Кнопка колокольчика */}
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 sm:p-2.5 rounded-xl text-[#fffffe] hover:bg-[#abd1c6]/10 transition-all duration-200 border ${
          isOpen ? 'border-[#f9bc60]/50 bg-[#abd1c6]/10' : 'border-[#abd1c6]/20 hover:border-[#abd1c6]/40'
        }`}
        aria-label={`Уведомления${unreadCount > 0 ? ` (${unreadCount} новых)` : ''}`}
      >
        <LucideIcons.Bell size="md" className={isOpen ? 'text-[#f9bc60]' : ''} />
        
        {/* Индикатор непрочитанных уведомлений */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 sm:min-w-[22px] sm:h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg border-2 border-[#004643]"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Выпадающее меню уведомлений */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Мобильная версия через Portal */}
            {mounted && createPortal(
              <motion.div
                data-notification-menu
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed sm:hidden z-[99999] left-2 right-2 bg-gradient-to-br from-[#004643] via-[#003d3a] to-[#001e1d] rounded-2xl shadow-2xl border border-[#abd1c6]/30 overflow-hidden backdrop-blur-xl"
                style={{
                  top: `${menuPosition.top}px`,
                  maxHeight: typeof window !== 'undefined' 
                    ? `${Math.min(window.innerHeight - menuPosition.top - 16, window.innerHeight - 16)}px`
                    : 'calc(100vh - 5rem)',
                  position: 'fixed',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {renderMenuContent()}
              </motion.div>,
              document.body
            )}
            {/* Планшетная и десктопная версия */}
            <motion.div
              data-notification-menu
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-[320px] sm:w-80 md:w-96 max-h-[85vh] sm:max-h-[500px] bg-gradient-to-br from-[#004643] via-[#003d3a] to-[#001e1d] rounded-2xl shadow-2xl border border-[#abd1c6]/30 overflow-hidden z-50 hidden sm:flex sm:flex-col backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {renderMenuContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  function renderMenuContent() {
    return (
      <>
            {/* Заголовок */}
            <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-[#abd1c6]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#f9bc60]/20 flex items-center justify-center border border-[#f9bc60]/30">
                    <LucideIcons.Bell className="text-[#f9bc60] w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#fffffe] leading-tight">Уведомления</h3>
                    {notifications.length > 0 && (
                      <p className="text-[10px] sm:text-[11px] text-[#abd1c6]/60 mt-0.5">
                        {notifications.length} {notifications.length === 1 ? 'уведомление' : notifications.length < 5 ? 'уведомления' : 'уведомлений'}
                      </p>
                    )}
                  </div>
                </div>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="min-w-[18px] h-5 sm:min-w-[20px] sm:h-5 bg-red-500 text-white text-[10px] sm:text-[11px] font-semibold rounded-full flex items-center justify-center px-1.5 shadow-sm"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Список уведомлений */}
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain touch-pan-y min-h-0" 
              style={{ 
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
              }}
            >
              {loading ? (
                <div className="p-4 sm:p-6 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <LucideIcons.Loader2 className="text-[#f9bc60] mx-auto mb-2" size="sm" />
                  </motion.div>
                  <p className="text-xs sm:text-sm text-[#abd1c6]">Загрузка...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-full bg-[#abd1c6]/10 flex items-center justify-center border border-[#abd1c6]/20">
                    <LucideIcons.Bell className="text-[#abd1c6]/60 w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#fffffe] mb-1">Нет уведомлений</p>
                  <p className="text-[10px] sm:text-xs text-[#abd1c6]/60">Здесь будут появляться новые уведомления</p>
                </div>
              ) : (
                <div className="divide-y divide-[#abd1c6]/10">
                  {notifications.map((notification, index) => {
                    // Определяем непрочитанное уведомление
                    const isUnread = (() => {
                      // Если есть флаг isRead, используем его
                      if (notification.isRead === false) return true;
                      if (notification.isRead === true) return false;
                      // Если isRead не определен, используем timestamp
                      if (lastViewedTimestamp) {
                        return new Date(notification.createdAt) > new Date(lastViewedTimestamp);
                      }
                      // Если нет timestamp, считаем непрочитанным
                      return true;
                    })();
                    
                    return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.01, 0.2) }}
                      className={`relative px-2.5 py-2 sm:px-3 sm:py-2.5 hover:bg-[#abd1c6]/5 active:bg-[#abd1c6]/8 transition-colors duration-150 cursor-pointer ${
                        isUnread ? 'bg-[#abd1c6]/3 border-l-2 border-l-[#f9bc60]' : ''
                      }`}
                      onClick={() => {
                        if (notification.type === "application_status" && notification.applicationId) {
                          // Для одобренных заявок переходим на страницу истории
                          if (notification.status === "APPROVED") {
                            router.push(`/stories/${notification.applicationId}`);
                          } else {
                            // Для отклоненных переходим на страницу заявок
                            router.push("/applications");
                          }
                          setIsOpen(false);
                        } else if (notification.type === "like" && notification.applicationId) {
                          // Для лайков переходим на страницу истории
                          router.push(`/stories/${notification.applicationId}`);
                          setIsOpen(false);
                        } else if (notification.type === "friend_request") {
                          openFriendsModal("received");
                          setIsOpen(false);
                        }
                      }}
                    >
                      {/* Индикатор непрочитанного */}
                      {isUnread && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1.5 sm:w-1.5 sm:h-2 rounded-full bg-[#f9bc60]" />
                      )}
                      
                      <div className="flex items-start gap-2 sm:gap-2.5">
                        {/* Аватар или иконка */}
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-[#004643] flex items-center justify-center flex-shrink-0 border border-[#abd1c6]/20">
                          {notification.avatar ? (
                            <img
                              src={notification.avatar}
                              alt="Аватар"
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== '/default-avatar.png') {
                                  target.src = "/default-avatar.png";
                                }
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${
                              notification.type === "application_status" && notification.status === "APPROVED"
                                ? "bg-[#10B981]/20"
                                : notification.type === "application_status" && notification.status === "REJECTED"
                                ? "bg-red-500/20"
                                : notification.type === "achievement"
                                ? "bg-[#f9bc60]/20"
                                : "bg-[#abd1c6]/20"
                            }`}>
                              <div className="w-4 h-4 sm:w-4.5 sm:h-4.5">
                                {getNotificationIcon(notification.type, notification.rarity, notification.status)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Контент */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1.5 mb-0.5">
                            <h4 className={`font-medium text-[#fffffe] text-xs sm:text-sm break-words leading-tight ${
                              isUnread ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-[9px] sm:text-[10px] text-[#abd1c6]/50 flex-shrink-0 ml-1.5 whitespace-nowrap">
                              {notification.timestamp}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-[#abd1c6]/80 line-clamp-2 break-words leading-snug">
                            {notification.message}
                          </p>
                          
                          {/* Индикатор достижения */}
                          {notification.type === "achievement" && notification.rarity && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium"
                              style={{
                                backgroundColor: getRarityColor(notification.rarity) + '15',
                                color: getRarityColor(notification.rarity),
                              }}
                            >
                              <LucideIcons.Star className="w-2.5 h-2.5" />
                              {getRarityLabel(notification.rarity)}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                  })}
                </div>
              )}
            </div>

            {/* Футер */}
            {notifications.length > 0 && (
              <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 border-t border-[#abd1c6]/20 bg-[#001e1d]/30">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/notifications');
                    setIsOpen(false);
                  }}
                  className="w-full text-[10px] sm:text-xs text-[#abd1c6] hover:text-[#fffffe] font-medium transition-colors text-center py-1.5 sm:py-2 rounded hover:bg-[#abd1c6]/8 active:bg-[#abd1c6]/12"
                >
                  Показать все уведомления
                </motion.button>
              </div>
            )}
      </>
    );
  }
}
