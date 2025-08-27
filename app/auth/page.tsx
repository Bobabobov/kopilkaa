// app/auth/page.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState<boolean | null>(null);

  useEffect(() => { setMsg(null); setErr(null); }, [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null); setErr(null);

    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: mode === "register" ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ошибка");
      setMsg(mode === "login" ? "Вход выполнен" : "Регистрация выполнена");
      setTimeout(() => (window.location.href = "/profile"), 400);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-md card p-6"
    >
      <div className="flex gap-2 mb-4">
        <button
          className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost border border-black/10 dark:border-white/10"}`}
          onClick={() => setMode("login")}
        >
          Вход
        </button>
        <button
          className={`btn ${mode === "register" ? "btn-primary" : "btn-ghost border border-black/10 dark:border-white/10"}`}
          onClick={() => setMode("register")}
        >
          Регистрация
        </button>
      </div>

      <form onSubmit={submit} className="grid gap-3">
        {mode === "register" && (
          <div>
            <label className="label">Имя (необязательно)</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Фёдор" />
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailTaken(null); }}
            onBlur={async () => {
              if (mode === "register" && email) {
                try {
                  const r = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
                  const d = await r.json();
                  setEmailTaken(!!d.exists);
                } catch { /* ignore */ }
              }
            }}
            placeholder="you@example.com"
            required
          />
          {mode === "register" && emailTaken === true && (
            <div className="error mt-1">Этот email уже зарегистрирован</div>
          )}
        </div>

        <div>
          <label className="label">Пароль</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            placeholder="Минимум 6 символов"
            required
          />
        </div>

        <button disabled={loading || (mode === "register" && emailTaken === true)} className="btn-primary">
          {loading ? "Обработка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>

        {msg && <div className="text-green-700 dark:text-green-400 text-sm">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </form>
    </motion.div>
  );
}
