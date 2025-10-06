// app/_parts/NavAuth.tsx
"use client";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
} | null;

// Маршруты авторизации
const LOGIN = "/login" as Route;
const REGISTER = "/register" as Route;

export default function NavAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((d) => {
        setUser(d.user);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.reload();
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
      <div className="flex items-center gap-2">
        <Link
          href={LOGIN}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{
            color: "#fffffe",
            backgroundColor: "rgba(171, 209, 198, 0.1)",
            border: "1px solid rgba(171, 209, 198, 0.3)",
          }}
        >
          Вход
        </Link>
        <Link
          href={REGISTER}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "#f9bc60",
            color: "#001e1d",
          }}
        >
          Регистрация
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
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
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
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
        onClick={logout}
        className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
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
