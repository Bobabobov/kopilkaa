"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneStep, setPhoneStep] = useState<"enter" | "code">("enter");
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const telegramContainerRef = useRef<HTMLDivElement | null>(null);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // Пользователь уже авторизован, перенаправляем в профиль
            router.push("/profile");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Встраиваем Telegram Login Widget
  useEffect(() => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    if (!botUsername || !telegramContainerRef.current) return;

    // Коллбек, который вызывает Telegram-виджет после успешной авторизации
    (window as any).onTelegramAuth = async (user: any) => {
      try {
        setErr(null);
        setBusy(true);

        const r = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram: user }),
        });
        const data = await r.json();

        if (!r.ok || !data?.success) {
          setErr(data?.error || "Ошибка входа через Telegram");
          return;
        }

        // Успешный вход / регистрация через Telegram
        window.location.href = "/profile";
      } catch (error: any) {
        console.error("Telegram login error:", error);
        setErr(error?.message || "Ошибка входа через Telegram");
      } finally {
        setBusy(false);
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    telegramContainerRef.current.innerHTML = "";
    telegramContainerRef.current.appendChild(script);

    return () => {
      // Чистим контейнер при размонтировании
      if (telegramContainerRef.current) {
        telegramContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Функция валидации
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!identifier.trim()) {
      errors.identifier = "Введите логин или email";
    } else if (
      identifier.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())
    ) {
      errors.identifier = "Введите корректный email";
    } else if (
      !identifier.includes("@") &&
      identifier.trim().length < 3
    ) {
      errors.identifier = "Логин должен быть длиннее";
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
        body: JSON.stringify({ identifier: identifier.trim(), password }),
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

  // Вход по телефону (тестовый режим)
  async function handlePhoneLogin(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError(null);

    if (!phone.trim()) {
      setPhoneError("Введите номер телефона");
      return;
    }

    setPhoneBusy(true);

    try {
      if (phoneStep === "enter") {
        const r = await fetch("/api/auth/phone/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const data = await r.json();

        if (!r.ok || !data?.success) {
          setPhoneError(data?.error || "Не удалось отправить код");
          return;
        }

        // В тестовом режиме показываем код прямо пользователю
        setPhoneError(
          `Код отправлен. В тестовом режиме он: ${data.code}. Введите его ниже.`,
        );
        setPhoneStep("code");
      } else {
        if (!phoneCode.trim()) {
          setPhoneError("Введите код");
          return;
        }

        const r = await fetch("/api/auth/phone/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code: phoneCode }),
        });
        const data = await r.json();

        if (!r.ok || !data?.success) {
          setPhoneError(data?.error || "Неверный код");
          return;
        }

        window.location.href = "/profile";
      }
    } catch (error: any) {
      console.error("Phone login error:", error);
      setPhoneError(error.message || "Ошибка входа по телефону");
    } finally {
      setPhoneBusy(false);
    }
  }

  // Показываем загрузку пока проверяем авторизацию
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4 pt-24 relative"
      style={{ backgroundColor: "#004643" }}
    >
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/20 to-[#e8a545]/20 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-[#abd1c6]/15 to-[#94c4b8]/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-[#e16162]/10 to-[#d63384]/10 rounded-full blur-lg animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-[#004643]/95 to-[#001e1d]/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#abd1c6]/20">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg">
              <LucideIcons.User size="lg" className="text-[#001e1d]" />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#fffffe" }}
            >
              Вход
            </h1>
            <p className="text-sm" style={{ color: "#abd1c6" }}>
              Войдите в свой аккаунт
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6" noValidate>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#abd1c6" }}
              >
                Email или логин *
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 ${
                    validationErrors.identifier
                      ? "border-red-400 bg-red-50/10"
                      : identifier.trim()
                        ? "border-[#abd1c6]/60 bg-[#abd1c6]/5"
                        : "border-[#abd1c6]/30 bg-[#004643]/50"
                  }`}
                  style={{
                    color: "#fffffe",
                    backgroundColor: validationErrors.identifier
                      ? "rgba(239, 68, 68, 0.05)"
                      : identifier.trim()
                        ? "rgba(171, 209, 198, 0.05)"
                        : "rgba(0, 70, 67, 0.5)",
                  }}
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (validationErrors.identifier) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        identifier: "",
                      }));
                    }
                  }}
                />
                {identifier.trim() && !validationErrors.identifier && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.CheckCircle
                      size="sm"
                      className="text-[#abd1c6]"
                    />
                  </div>
                )}
                {validationErrors.identifier && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.XCircle size="sm" className="text-red-400" />
                  </div>
                )}
              </div>
              {validationErrors.identifier && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
                  <LucideIcons.Alert size="sm" />
                  <span>{validationErrors.identifier}</span>
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#abd1c6" }}
              >
                Пароль *
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 ${
                    validationErrors.password
                      ? "border-red-400 bg-red-50/10"
                      : password.trim()
                        ? "border-[#abd1c6]/60 bg-[#abd1c6]/5"
                        : "border-[#abd1c6]/30 bg-[#004643]/50"
                  }`}
                  style={{
                    color: "#fffffe",
                    backgroundColor: validationErrors.password
                      ? "rgba(239, 68, 68, 0.05)"
                      : password.trim()
                        ? "rgba(171, 209, 198, 0.05)"
                        : "rgba(0, 70, 67, 0.5)",
                  }}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }
                  }}
                />
                {password.trim() && !validationErrors.password && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.CheckCircle
                      size="sm"
                      className="text-[#abd1c6]"
                    />
                  </div>
                )}
                {validationErrors.password && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.XCircle size="sm" className="text-red-400" />
                  </div>
                )}
              </div>
              {validationErrors.password && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
                  <LucideIcons.Alert size="sm" />
                  <span>{validationErrors.password}</span>
                </div>
              )}
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm p-4 rounded-xl flex items-center gap-2">
                <LucideIcons.Alert size="sm" />
                <span>{err}</span>
              </div>
            )}

          {/* Вход через Telegram */}
          <div className="mb-4">
            <p className="text-xs mb-2 text-center" style={{ color: "#abd1c6" }}>
              Или войдите через Telegram:
            </p>
            <div
              ref={telegramContainerRef}
              className="flex justify-center"
            />
          </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              style={{
                background: busy
                  ? "linear-gradient(135deg, #abd1c6, #94c4b8)"
                  : "linear-gradient(135deg, #f9bc60, #e8a545)",
                color: "#001e1d",
              }}
            >
              {busy ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#001e1d]/30 border-t-[#001e1d] rounded-full animate-spin"></div>
                  Вход...
                </div>
              ) : (
                "Войти"
              )}
            </button>
          </form>

          {/* Вход по телефону (тестовый режим) */}
          <div className="mt-10 pt-6 border-t border-[#abd1c6]/20">
            <h2
              className="text-lg font-semibold mb-4 text-center"
              style={{ color: "#fffffe" }}
            >
              Или войдите по телефону (тестовый режим)
            </h2>
            <form onSubmit={handlePhoneLogin} className="space-y-4" noValidate>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#abd1c6" }}
                >
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#abd1c6]/30 bg-[#004643]/50 text-[#fffffe] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50"
                  placeholder="+7 900 000-00-00"
                />
              </div>

              {phoneStep === "code" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#abd1c6" }}
                  >
                    Код из SMS (из ответа сервера)
                  </label>
                  <input
                    type="text"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#abd1c6]/30 bg-[#004643]/50 text-[#fffffe] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50"
                    placeholder="123456"
                  />
                </div>
              )}

              {phoneError && (
                <div className="bg-emerald-500/10 border border-emerald-400/40 text-emerald-100 text-sm p-3 rounded-xl">
                  {phoneError}
                </div>
              )}

              <button
                type="submit"
                disabled={phoneBusy}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mt-2"
                style={{
                  background: phoneBusy
                    ? "linear-gradient(135deg, #abd1c6, #94c4b8)"
                    : "linear-gradient(135deg, #f9bc60, #e8a545)",
                  color: "#001e1d",
                }}
              >
                {phoneBusy
                  ? "Обрабатываем..."
                  : phoneStep === "enter"
                    ? "Получить код"
                    : "Войти по коду"}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "#abd1c6" }}>
              Нет аккаунта?{" "}
              <Link
                href="/register"
                className="font-semibold transition-all duration-300 hover:underline hover:scale-105 inline-block"
                style={{ color: "#f9bc60" }}
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
