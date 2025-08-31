"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await r.json();
      
      if (!r.ok) {
        setErr(data?.error || "Ошибка входа");
        return;
      }
      
      // Успешный вход - перенаправляем на профиль
      if (data.ok) {
        window.location.href = "/profile";
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-1">Вход</h1>
        <p className="text-sm text-neutral-500 mb-4">Войдите в свой аккаунт</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input 
              className="w-full rounded-xl border px-3 py-2" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input 
              className="w-full rounded-xl border px-3 py-2" 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {err && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              {err}
            </div>
          )}

          <button 
            type="submit" 
            disabled={busy}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 disabled:opacity-50"
          >
            {busy ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Нет аккаунта? <Link href="/register" className="text-blue-600 hover:underline">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

