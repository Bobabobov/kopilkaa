// components/notifications/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import { Notification } from "../types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState<string | null>(null);

  // Загружаем timestamp последнего просмотра
  useEffect(() => {
    try {
      const savedTimestamp = localStorage.getItem('notifications_last_viewed');
      if (savedTimestamp) {
        setLastViewedTimestamp(savedTimestamp);
      }
    } catch (error) {
      console.warn('localStorage недоступен:', error);
    }
  }, []);

  // Загружаем уведомления
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotifications(data.notifications || []);
          } else {
            setError("Не удалось загрузить уведомления");
          }
        } else {
          setError("Ошибка загрузки уведомлений");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Ошибка подключения к серверу");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsViewed = () => {
    try {
      const currentTimestamp = new Date().toISOString();
      localStorage.setItem('notifications_last_viewed', currentTimestamp);
      setLastViewedTimestamp(currentTimestamp);
    } catch (error) {
      console.warn('Не удалось сохранить timestamp:', error);
    }
  };

  return {
    notifications,
    loading,
    error,
    lastViewedTimestamp,
    markAsViewed,
    refetch: async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotifications(data.notifications || []);
          }
        }
      } catch (error) {
        console.error("Error refetching notifications:", error);
      } finally {
        setLoading(false);
      }
    },
  };
}


