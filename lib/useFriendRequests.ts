// lib/useFriendRequests.ts
"use client";
import { useEffect, useState, useRef, useCallback } from "react";

export function useFriendRequests() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/profile/friends?type=received", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.friendships?.length || 0);
      } else {
        setPendingCount(0);
      }
    } catch {
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndLoad = async () => {
      try {
        // Сначала проверяем авторизацию
        const authResponse = await fetch("/api/profile/me");
        const isAuth = authResponse.ok;
        setIsAuthenticated(isAuth);

        if (!isAuth) {
          // Пользователь не авторизован - не делаем запрос к friends API
          if (isMounted) {
            setPendingCount(0);
            setLoading(false);
          }
          return;
        }

        // Если авторизован, загружаем заявки
        if (isMounted) {
          setLoading(true);
        }

        if (isMounted) {
          await loadRequests();
        }
      } catch (error) {
        // Игнорируем ошибки
        if (isMounted) {
          setPendingCount(0);
          setLoading(false);
        }
      }
    };

    checkAuthAndLoad();

    // Обновляем каждые 30 секунд только если авторизован
    intervalRef.current = setInterval(() => {
      if (isAuthenticated) {
        checkAuthAndLoad();
      }
    }, 30000);

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, loadRequests]);

  useEffect(() => {
    const handleFriendsUpdated = () => {
      if (isAuthenticated) {
        loadRequests();
      }
    };

    window.addEventListener("friends-updated", handleFriendsUpdated);
    return () => {
      window.removeEventListener("friends-updated", handleFriendsUpdated);
    };
  }, [isAuthenticated, loadRequests]);

  return { pendingCount, loading };
}
