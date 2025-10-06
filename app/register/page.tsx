"use client";
import { useState, useEffect } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import SuccessScreen from "@/components/auth/SuccessScreen";

interface FormData {
  email: string;
  name: string;
  password: string;
  password2: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (formData: FormData) => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
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
          password: formData.password,
          name: formData.name.trim()
        })
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

  if (success) {
    return <SuccessScreen />;
  }

  return (
    <RegisterForm 
      onSubmit={handleSubmit}
      busy={busy}
      errors={errors}
    />
  );
}
