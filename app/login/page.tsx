"use client";
import { useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Функция валидации
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      errors.email = "Введите email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Введите корректный email";
    }
    
    if (!password.trim()) {
      errors.password = "Введите пароль";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setValidationErrors({});
    
    // Проверяем валидацию перед отправкой
    if (!validateForm()) {
      return;
    }
    
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
        console.log("Login successful, redirecting to profile...");
        // Используем window.location.href для полной перезагрузки страницы
        window.location.href = "/profile";
      }
    } catch (e: any) {
      console.error("Login error:", e);
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4 relative">
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl"></div>
      
      <div className="card w-full max-w-md relative z-10">
        <h1 className="text-2xl font-semibold mb-1">Вход</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Войдите в свой аккаунт</p>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <div>
            <label className="label">Email *</label>
            <div className="relative">
              <input 
                className={`input ${validationErrors.email ? 'border-red-300 dark:border-red-600' : email.trim() ? 'border-green-300 dark:border-green-600' : ''}`}
                type="text" 
                value={email} 
                onChange={e => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({...prev, email: ''}));
                  }
                }} 
              />
              {email.trim() && !validationErrors.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LucideIcons.CheckCircle size="sm" className="text-green-500" />
                </div>
              )}
              {validationErrors.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LucideIcons.XCircle size="sm" className="text-red-500" />
                </div>
              )}
            </div>
            {validationErrors.email && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fadeIn">
                <LucideIcons.Alert size="sm" />
                <span>{validationErrors.email}</span>
              </div>
            )}
          </div>
          
          <div>
            <label className="label">Пароль *</label>
            <div className="relative">
              <input 
                className={`input ${validationErrors.password ? 'border-red-300 dark:border-red-600' : password.trim() ? 'border-green-300 dark:border-green-600' : ''}`}
                type="password" 
                value={password} 
                onChange={e => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({...prev, password: ''}));
                  }
                }} 
              />
              {password.trim() && !validationErrors.password && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LucideIcons.CheckCircle size="sm" className="text-green-500" />
                </div>
              )}
              {validationErrors.password && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LucideIcons.XCircle size="sm" className="text-red-500" />
                </div>
              )}
            </div>
            {validationErrors.password && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fadeIn">
                <LucideIcons.Alert size="sm" />
                <span>{validationErrors.password}</span>
              </div>
            )}
          </div>

          {err && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              {err}
            </div>
          )}

          <button 
            type="submit" 
            disabled={busy}
            className="w-full btn-primary py-3 px-4"
          >
            {busy ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Нет аккаунта? <Link href="/register" className="text-green-600 dark:text-green-400 hover:underline font-medium">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

