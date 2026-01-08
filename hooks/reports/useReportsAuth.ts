// hooks/reports/useReportsAuth.ts
// Хук для авторизации на странице баг-репортов
import { useCallback, useState } from "react";

interface User {
  id: string;
  email?: string;
  role?: string;
}

interface UseReportsAuthReturn {
  user: User | null;
  isAdminAllowed: boolean;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
}

export function useReportsAuth(): UseReportsAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminAllowed, setIsAdminAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch("/api/profile/me", {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Нужно войти или зарегистрироваться");
        } else {
          setError("Не удалось загрузить профиль");
        }
        setUser(null);
        setIsAdminAllowed(false);
        return;
      }

      const data = await res.json();
      if (!data?.user) {
        setError("Нужно войти или зарегистрироваться");
        setUser(null);
        setIsAdminAllowed(false);
        return;
      }

      setUser(data.user);
      setIsAdminAllowed(Boolean(data?.isAdminAllowed));
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Сервер долго не отвечает. Попробуйте обновить страницу.");
      } else {
        setError("Не удалось загрузить профиль");
      }
      setUser(null);
      setIsAdminAllowed(false);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAdminAllowed,
    loading,
    error,
    loadUser,
  };
}


