"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";

interface FormData {
  email: string;
  username: string;
  phone: string;
  name: string;
  password: string;
  password2: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [busy, setBusy] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState<"form" | "code">("form");
  const [pendingPhone, setPendingPhone] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);

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

  const validateForm = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    if (!formData.username) {
      newErrors.username = "Логин обязателен";
    } else if (!/^[\p{L}\p{N}._-]{3,20}$/u.test(formData.username.trim())) {
      newErrors.username =
        "3–20 символов: буквы, цифры, точка, дефис или подчёркивание";
    }

    // Телефон: простая проверка, что есть хотя бы 10 цифр
    const digits = formData.phone.replace(/[^\d]+/g, "");
    if (!formData.phone) {
      newErrors.phone = "Телефон обязателен";
    } else if (digits.length < 10) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Имя обязательно";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      newErrors.password = "Пароль должен содержать минимум 8 символов";
    }

    if (!formData.password2) {
      newErrors.password2 = "Подтвердите пароль";
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = "Пароли не совпадают";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Необходимо согласиться с правилами и условиями";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          username: formData.username.trim().toLowerCase(),
          phone: formData.phone,
          password: formData.password,
          name: formData.name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setErrors({ general: data?.message || "Не удалось создать аккаунт" });
        return;
      }

      // Успешная регистрация: переходим на шаг ввода кода подтверждения телефона
      setPendingPhone(data.phone || formData.phone);
      setStep("code");
      setCode("");
      setCodeError(
        data.phoneCode
          ? `Код отправлен. В тестовом режиме он: ${data.phoneCode}. Введите его ниже.`
          : "Код отправлен на ваш телефон. Введите его ниже.",
      );
    } catch (error: any) {
      setErrors({ general: "Ошибка соединения. Попробуйте еще раз." });
    } finally {
      setBusy(false);
    }
  };

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

  if (step === "code") {
    return (
      <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4 pt-24 relative">
        <div className="w-full max-w-md bg-gradient-to-br from-[#004643]/95 to-[#001e1d]/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#abd1c6]/20 relative z-10">
          <h1
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: "#fffffe" }}
          >
            Подтверждение телефона
          </h1>
          <p className="text-sm mb-6 text-center" style={{ color: "#abd1c6" }}>
            Мы отправили код на номер{" "}
            <span className="font-semibold text-[#f9bc60]">
              {pendingPhone}
            </span>
            . Введите его, чтобы завершить регистрацию.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCodeError(null);

              if (!code.trim()) {
                setCodeError("Введите код из SMS");
                return;
              }

              setCodeBusy(true);
              try {
                const response = await fetch("/api/auth/phone/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ phone: pendingPhone, code }),
                });
                const data = await response.json();

                if (!response.ok || !data?.success) {
                  setCodeError(data?.error || "Неверный или просроченный код");
                  return;
                }

                // Телефон подтверждён, пользователь залогинен — ведём в профиль
                window.location.href = "/profile";
              } catch (error: any) {
                setCodeError(
                  error?.message || "Ошибка проверки кода. Попробуйте ещё раз.",
                );
              } finally {
                setCodeBusy(false);
              }
            }}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#abd1c6" }}
              >
                Код подтверждения
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#abd1c6]/30 bg-[#004643]/50 text-[#fffffe] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50"
                placeholder="123456"
              />
            </div>

            {codeError && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm p-3 rounded-xl">
                {codeError}
              </div>
            )}

            <button
              type="submit"
              disabled={codeBusy}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              style={{
                background: codeBusy
                  ? "linear-gradient(135deg, #abd1c6, #94c4b8)"
                  : "linear-gradient(135deg, #f9bc60, #e8a545)",
                color: "#001e1d",
              }}
            >
              {codeBusy ? "Проверяем код..." : "Завершить регистрацию"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <RegisterForm onSubmit={handleSubmit} busy={busy} errors={errors} />;
}
