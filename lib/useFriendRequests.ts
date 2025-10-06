// lib/useFriendRequests.ts
"use client";
import { useEffect, useState, useRef } from "react";

export function useFriendRequests() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

        const response = await fetch("/api/profile/friends?type=received");
        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            setPendingCount(data.friendships?.length || 0);
          } else {
            setPendingCount(0);
          }
          setLoading(false);
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
  }, [isAuthenticated]);

  return { pendingCount, loading };
}
