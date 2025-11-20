"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import SuccessScreen from "@/components/auth/SuccessScreen";

interface FormData {
  email: string;
  username: string;
  name: string;
  password: string;
  password2: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          username: formData.username.trim().toLowerCase(),
          password: formData.password,
          name: formData.name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data?.message || "Не удалось создать аккаунт" });
        return;
      }

      // Успешная регистрация
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2000);
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

  if (success) {
    return <SuccessScreen />;
  }

  return <RegisterForm onSubmit={handleSubmit} busy={busy} errors={errors} />;
}
