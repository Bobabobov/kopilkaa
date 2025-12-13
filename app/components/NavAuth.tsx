// app/_parts/NavAuth.tsx
"use client";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
} | null;

// Маршрут авторизации (используем модальное окно с параметром ?modal=auth)
const LOGIN = "/?modal=auth" as Route;

interface NavAuthProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function NavAuth({ isMobile = false, onLinkClick }: NavAuthProps) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const notifyAuthChange = (isAuth: boolean) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth-status-change", {
          detail: { isAuthenticated: isAuth },
        }),
      );
    }
  };

  useEffect(() => {
    let cancelled = false;
    
    // Используем AbortController для отмены при размонтировании
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Таймаут 5 секунд
    
    fetch("/api/profile/me", { 
      cache: "no-store",
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          setUser(d.user);
          notifyAuthChange(true);
        }
      })
      .catch((error) => {
        if (!cancelled && error.name !== 'AbortError') {
          console.error("Error fetching user:", error);
        }
        if (!cancelled) {
          setUser(null);
          notifyAuthChange(false);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (!cancelled) {
          setLoading(false);
        }
      });
    
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const logout = async () => {
    try {
    await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      notifyAuthChange(false);
      // Перенаправляем на главную страницу
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // В случае ошибки все равно перенаправляем на главную
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-[52px] h-[36px] rounded-xl bg-white/5 animate-pulse"></div>
        <div className="w-[108px] h-[36px] rounded-xl bg-white/5 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href={LOGIN}
        onClick={onLinkClick}
        className={
          isMobile
            ? "block w-full rounded-lg border text-sm font-semibold transition-all duration-200 px-4 py-3 text-center hover:scale-[1.01]"
            : "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
        }
        style={
          isMobile
            ? {
                backgroundColor: "rgba(249, 188, 96, 0.05)",
                borderColor: "rgba(249, 188, 96, 0.6)",
                color: "#f9bc60",
              }
            : {
                backgroundColor: "#f9bc60",
                color: "#001e1d",
              }
        }
      >
        Вход
      </Link>
    );
  }

  const handleLogout = async () => {
    onLinkClick?.();
    await logout();
  };

  return (
    <div className={`flex ${isMobile ? "flex-col w-full gap-2" : "items-center gap-2"}`}>
      <Link
        href="/profile"
        onClick={onLinkClick}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
          isMobile ? "w-full text-center" : "whitespace-nowrap"
        }`}
        style={{
          color: "#fffffe",
          backgroundColor: "rgba(171, 209, 198, 0.1)",
          border: "1px solid rgba(171, 209, 198, 0.3)",
        }}
      >
        <span className="hidden sm:inline">Личный кабинет</span>
        <span className="sm:hidden">Профиль</span>
      </Link>
      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          onClick={onLinkClick}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isMobile ? "w-full text-center" : ""
          }`}
          style={{
            backgroundColor: "#f9bc60",
            color: "#001e1d",
          }}
        >
          <span className="hidden sm:inline">Админка</span>
          <span className="sm:hidden">Админ</span>
        </Link>
      )}
      <button
        onClick={handleLogout}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
          isMobile ? "w-full text-center" : ""
        }`}
        style={{
          color: "#fffffe",
          backgroundColor: "rgba(171, 209, 198, 0.1)",
          border: "1px solid rgba(171, 209, 198, 0.3)",
        }}
      >
        Выйти
      </button>
    </div>
  );
}
