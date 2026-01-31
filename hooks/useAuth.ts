/**
 * Единый хук для проверки авторизации.
 * Заменяет дублирующиеся fetch("/api/profile/me") по всему проекту.
 *
 * Использование:
 * const { isAuthenticated, user, loading } = useAuth();
 *
 * Паттерн согласно React docs: извлечение повторяющейся логики в custom hook.
 */
"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  username: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
}

interface UseAuthResult {
  /** Авторизован ли пользователь */
  isAuthenticated: boolean;
  /** Данные пользователя (null если не авторизован) */
  user: AuthUser | null;
  /** Загрузка данных */
  loading: boolean;
  /** Перезагрузить данные авторизации */
  refetch: () => Promise<void>;
}

// Глобальный кеш для избежания множественных запросов
let cachedUser: AuthUser | null = null;
let cachedIsAuthenticated: boolean | null = null;
let fetchPromise: Promise<{ user: AuthUser | null; isAuthenticated: boolean }> | null = null;

async function fetchAuthData(): Promise<{ user: AuthUser | null; isAuthenticated: boolean }> {
  // Если уже есть активный запрос — используем его
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await fetch("/api/profile/me", { cache: "no-store" });
      
      if (!response.ok) {
        cachedUser = null;
        cachedIsAuthenticated = false;
        return { user: null, isAuthenticated: false };
      }

      const data = await response.json();
      
      if (data.user) {
        cachedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          username: data.user.username,
          avatar: data.user.avatar,
          role: data.user.role,
        };
        cachedIsAuthenticated = true;
        return { user: cachedUser, isAuthenticated: true };
      }

      cachedUser = null;
      cachedIsAuthenticated = false;
      return { user: null, isAuthenticated: false };
    } catch {
      cachedUser = null;
      cachedIsAuthenticated = false;
      return { user: null, isAuthenticated: false };
    } finally {
      // Сбрасываем промис через небольшую задержку
      // чтобы избежать гонки между компонентами
      setTimeout(() => {
        fetchPromise = null;
      }, 100);
    }
  })();

  return fetchPromise;
}

/**
 * Хук для проверки авторизации пользователя.
 * Кеширует результат между компонентами для избежания дублирующих запросов.
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(cachedUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    cachedIsAuthenticated ?? false
  );
  const [loading, setLoading] = useState<boolean>(cachedIsAuthenticated === null);

  const refetch = useCallback(async () => {
    setLoading(true);
    // Сбрасываем кеш
    cachedUser = null;
    cachedIsAuthenticated = null;
    fetchPromise = null;
    
    const result = await fetchAuthData();
    setUser(result.user);
    setIsAuthenticated(result.isAuthenticated);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Если есть кеш — используем его
    if (cachedIsAuthenticated !== null) {
      setUser(cachedUser);
      setIsAuthenticated(cachedIsAuthenticated);
      setLoading(false);
      return;
    }

    // Иначе загружаем данные
    let mounted = true;

    fetchAuthData().then((result) => {
      if (mounted) {
        setUser(result.user);
        setIsAuthenticated(result.isAuthenticated);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { isAuthenticated, user, loading, refetch };
}

/**
 * Сбросить кеш авторизации.
 * Вызывается при логауте или смене пользователя.
 */
export function clearAuthCache(): void {
  cachedUser = null;
  cachedIsAuthenticated = null;
  fetchPromise = null;
}

/**
 * Проверить только статус авторизации (без данных пользователя).
 * Для простых случаев, когда нужен только boolean.
 */
export function useIsAuthenticated(): { isAuthenticated: boolean; loading: boolean } {
  const { isAuthenticated, loading } = useAuth();
  return { isAuthenticated, loading };
}
