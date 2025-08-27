// app/_parts/NavAuth.tsx
"use client";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

type User = { id: string; email: string; role: "USER" | "ADMIN"; name?: string | null } | null;

// Маршруты авторизации (эти страницы у тебя уже есть)
const LOGIN    = "/login-new"    as Route;
const REGISTER = "/register-new" as Route;

export default function NavAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.reload();
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href={LOGIN} className="px-3 py-2 rounded-xl text-sm transition hover:bg-black/5 dark:hover:bg-white/10">
          Вход
        </Link>
        <Link href={REGISTER} className="px-3 py-2 rounded-xl text-sm transition hover:bg-black/5 dark:hover:bg-white/10">
          Регистрация
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/profile" className="px-3 py-2 rounded-xl text-sm transition hover:bg-black/5 dark:hover:bg-white/10">
        Личный кабинет
      </Link>
      {user.role === "ADMIN" && (
        <Link href="/admin" className="px-3 py-2 rounded-xl text-sm transition hover:bg-black/5 dark:hover:bg-white/10">
          Админка
        </Link>
      )}
      <button onClick={logout} className="px-3 py-2 rounded-xl text-sm transition hover:bg-black/5 dark:hover:bg-white/10">
        Выйти
      </button>
    </div>
  );
}
