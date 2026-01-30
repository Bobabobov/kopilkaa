// components/notifications/hooks/useNotificationBell.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Notification } from "../types";

export function useNotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState<string | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fetchInProgressRef = useRef(false);
  const hasFetchedOnOpenRef = useRef(false);
  const hasMarkedAsViewed = useRef(false);

  // Загружаем timestamp последнего просмотра из localStorage
  useEffect(() => {
    try {
      const savedTimestamp = localStorage.getItem("notifications_last_viewed");
      if (savedTimestamp) {
        setLastViewedTimestamp(savedTimestamp);
      }
    } catch (error) {
      console.warn("localStorage недоступен:", error);
    }
  }, []);

  // Проверка монтирования для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Вычисляем позицию меню для мобильных
  const updateMenuPosition = useCallback(() => {
    if (buttonRef.current && typeof window !== "undefined") {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: 8,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
      const handleResize = () => updateMenuPosition();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
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
    if (fetchInProgressRef.current) return;

    fetchInProgressRef.current = true;

    try {
      if (!silent) setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

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
            (notification: Notification) =>
              notification.type === "friend_request",
          ).length;
          dispatchFriendRequestEventRef.current(friendRequestCount);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching notifications:", error);
      }
    } finally {
      fetchInProgressRef.current = false;
      if (!silent) setLoading(false);
    }
  }, []);

  // Первичная загрузка
  useEffect(() => {
    fetchNotifications(true);
  }, []);

  // Загружаем уведомления при открытии меню
  useEffect(() => {
    if (isOpen && !hasFetchedOnOpenRef.current && !fetchInProgressRef.current) {
      hasFetchedOnOpenRef.current = true;
      fetchNotifications();
    }

    if (!isOpen) {
      hasFetchedOnOpenRef.current = false;
    }
  }, [isOpen]);

  // Обновляем счетчик
  useEffect(() => {
    if (notifications.length === 0) {
      setUnreadCount(0);
      return;
    }

    if (lastViewedTimestamp) {
      const viewedDate = new Date(lastViewedTimestamp).getTime();
      const unreadCount = notifications.filter((notification: Notification) => {
        const notificationDate = new Date(notification.createdAt).getTime();
        return notificationDate > viewedDate;
      }).length;

      setUnreadCount(unreadCount);
    } else {
      setUnreadCount(notifications.length);
    }
  }, [lastViewedTimestamp, notifications]);

  // Сохраняем timestamp при открытии меню
  useEffect(() => {
    if (isOpen && !hasMarkedAsViewed.current) {
      try {
        const currentTimestamp = new Date().toISOString();
        localStorage.setItem("notifications_last_viewed", currentTimestamp);
        setLastViewedTimestamp(currentTimestamp);
        setUnreadCount(0);
        hasMarkedAsViewed.current = true;
      } catch (error) {
        console.warn("Не удалось сохранить timestamp:", error);
      }
    }

    if (!isOpen) {
      hasMarkedAsViewed.current = false;
    }
  }, [isOpen]);

  // Слушаем события обновления друзей
  useEffect(() => {
    const handleFriendsUpdated = () => {
      if (!fetchInProgressRef.current) {
        fetchNotifications(true);
      }
    };

    window.addEventListener("friends-updated", handleFriendsUpdated);
    return () =>
      window.removeEventListener("friends-updated", handleFriendsUpdated);
  }, []);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (
        notification.type === "application_status" &&
        notification.applicationId
      ) {
        if (notification.status === "APPROVED") {
          router.push(`/stories/${notification.applicationId}`);
        } else {
          router.push("/applications");
        }
        setIsOpen(false);
      } else if (notification.type === "like" && notification.applicationId) {
        router.push(`/stories/${notification.applicationId}`);
        setIsOpen(false);
      } else if (notification.type === "friend_request") {
        router.push("/friends?tab=received");
        setIsOpen(false);
      }
    },
    [router],
  );

  return {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    loading,
    lastViewedTimestamp,
    mounted,
    menuPosition,
    buttonRef,
    handleNotificationClick,
    fetchNotifications,
  };
}
