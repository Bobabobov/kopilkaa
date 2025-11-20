"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FormField from "@/components/ui/FormField";
import PasswordField from "./PasswordField";

interface FormData {
  email: string;
  username: string;
  name: string;
  password: string;
  password2: string;
  acceptTerms: boolean;
}

interface RegisterFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  busy: boolean;
  errors: { [key: string]: string };
}

export default function RegisterForm({
  onSubmit,
  busy,
  errors,
}: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    name: "",
    password: "",
    password2: "",
    acceptTerms: false,
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gradient-to-br from-[#004643]/95 to-[#001e1d]/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#abd1c6]/20">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-[#001e1d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#fffffe" }}
            >
              Создать аккаунт
            </h1>
            <p className="text-sm" style={{ color: "#abd1c6" }}>
              Присоединяйтесь к нашей платформе
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <FormField
              label="Email адрес"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="your@email.com"
              error={errors.email}
            />

            {/* Username */}
            <FormField
              label="Логин"
              type="input"
              value={formData.username}
              onChange={(value) => handleInputChange("username", value)}
              placeholder="naprimer_user"
              error={errors.username}
              hint="3–20 символов: буквы любого языка, цифры, точка, дефис или подчёркивание"
            />

            {/* Имя */}
            <FormField
              label="Имя"
              type="input"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="Как к вам обращаться"
              error={errors.name}
            />

            {/* Пароль */}
            <PasswordField
              label="Пароль"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Минимум 8 символов"
              error={errors.password}
            />

            {/* Подтверждение пароля */}
            <PasswordField
              label="Подтвердите пароль"
              value={formData.password2}
              onChange={(value) => handleInputChange("password2", value)}
              placeholder="Повторите пароль"
              error={errors.password2}
            />

            {/* Согласие с правилами */}
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                errors.acceptTerms
                  ? "bg-red-500/10 border-red-400/30"
                  : "bg-[#abd1c6]/5 border-[#abd1c6]/30"
              }`}
            >
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange("acceptTerms", e.target.checked)
                }
                className="mt-1 w-4 h-4 rounded focus:ring-[#f9bc60]/50 border-[#abd1c6]/60"
                style={{
                  accentColor: "#f9bc60",
                  backgroundColor: formData.acceptTerms
                    ? "#f9bc60"
                    : "transparent",
                }}
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm leading-relaxed"
                style={{ color: "#abd1c6" }}
              >
                Я соглашаюсь с{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-semibold hover:underline transition-all duration-300"
                  style={{ color: "#f9bc60" }}
                >
                  правилами и условиями
                </Link>{" "}
                использования платформы и{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-semibold hover:underline transition-all duration-300"
                  style={{ color: "#f9bc60" }}
                >
                  политикой конфиденциальности
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>{errors.acceptTerms}</span>
              </div>
            )}

            {/* Общие ошибки */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm p-4 rounded-xl flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Кнопка отправки */}
            <motion.button
              type="submit"
              disabled={busy}
              whileHover={{ scale: busy ? 1 : 1.02 }}
              whileTap={{ scale: busy ? 1 : 0.98 }}
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
                  Создание аккаунта...
                </div>
              ) : (
                "Создать аккаунт"
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "#abd1c6" }}>
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="font-semibold transition-all duration-300 hover:underline hover:scale-105 inline-block"
                style={{ color: "#f9bc60" }}
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
