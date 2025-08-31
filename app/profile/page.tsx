// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type User = { id: string; email: string; role: "USER" | "ADMIN"; name?: string | null; createdAt: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl card p-6"
    >
      <h1 className="text-2xl font-semibold mb-4">Профиль</h1>
      {loading && <div>Загрузка…</div>}
      {!loading && !user && (
        <div>
          Вы не вошли. <a href="/login" className="underline">Перейти ко входу</a>
        </div>
      )}
  
{!loading && user && (
  <div className="grid gap-2">
    <div><span className="opacity-70">Email:</span> {user.email}</div>
    <div><span className="opacity-70">Имя:</span> {user.name ?? "—"}</div>
    <div><span className="opacity-70">Роль:</span> {user.role}</div>
    <div className="mt-3">
      <a className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2" href="/profile/applications">
        Мои заявки
      </a>
    </div>
  </div>
)}

    </motion.div>
  );
}
