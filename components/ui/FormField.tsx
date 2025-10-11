// components/ui/FormField.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface FormFieldProps {
  // Основные свойства
  label: string;
  type: "input" | "textarea" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;

  // Валидация
  error?: string;
  required?: boolean;
  showValidation?: boolean;

  // Для input/textarea
  icon?: keyof typeof LucideIcons;
  hint?: string;
  minLength?: number;
  maxLength?: number;

  // Стилизация
  className?: string;
  delay?: number;
  compact?: boolean; // для компактного отображения textarea

  // Дополнительные свойства
  rows?: number;
}

export default function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  showValidation = true,
  icon,
  hint,
  minLength = 0,
  maxLength,
  className = "",
  delay = 0,
  compact = false,
  rows = 6,
}: FormFieldProps) {
  // Подсчет символов (без пробелов для textarea, с пробелами для input)
  const charCount =
    type === "textarea" ? value.replace(/\s/g, "").length : value.trim().length;

  const isValid = maxLength
    ? charCount >= minLength && charCount <= maxLength
    : charCount >= minLength;
  const isNearLimit = maxLength ? charCount > maxLength * 0.8 : false;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  // Проверка на обязательность поля
  const isEmpty = charCount === 0;
  const isRequiredEmpty = required && isEmpty;

  // Функция для получения цвета рамки
  const getValidationColor = () => {
    if (error || isRequiredEmpty) return "border-red-300 dark:border-red-600";
    if (isOverLimit) return "border-red-300 dark:border-red-600";
    if (isNearLimit) return "border-lime-300 dark:border-lime-600";
    if (isValid && charCount > 0)
      return "border-green-300 dark:border-green-600";
    return "border-gray-300 dark:border-gray-600";
  };

  // Функция для получения иконки валидации
  const getValidationIcon = () => {
    if (error || isRequiredEmpty || isOverLimit) return LucideIcons.XCircle;
    if (isNearLimit) return LucideIcons.Alert;
    if (isValid && charCount > 0) return LucideIcons.CheckCircle;
    return null;
  };

  const getValidationIconColor = () => {
    if (error || isRequiredEmpty || isOverLimit) return "text-red-500";
    if (isNearLimit) return "text-lime-500";
    if (isValid && charCount > 0) return "text-green-500";
    return "";
  };

  const getCounterColor = () => {
    if (isOverLimit) return "text-red-500";
    if (isNearLimit) return "text-lime-500";
    return "text-gray-500 dark:text-gray-400";
  };

  const IconComponent = icon ? LucideIcons[icon] : null;
  const ValidationIconComponent = getValidationIcon();

  return (
    <div
      className={`space-y-2 relative ${className}`}
      style={{
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
      }}
    >
      {/* Лейбл */}
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "#abd1c6" }}
      >
        {label} {required && "*"}
      </label>

      {/* Поле ввода */}
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={compact ? 2 : rows}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 resize-none ${
              error || isRequiredEmpty
                ? "border-red-400 bg-red-50/10"
                : value.trim()
                  ? "border-[#abd1c6]/60 bg-[#abd1c6]/5"
                  : "border-[#abd1c6]/30 bg-[#004643]/50"
            }`}
            style={{
              color: "#fffffe",
              backgroundColor:
                error || isRequiredEmpty
                  ? "rgba(239, 68, 68, 0.05)"
                  : value.trim()
                    ? "rgba(171, 209, 198, 0.05)"
                    : "rgba(0, 70, 67, 0.5)",
            }}
          />
        ) : (
          <input
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 ${
              error || isRequiredEmpty
                ? "border-red-400 bg-red-50/10"
                : value.trim()
                  ? "border-[#abd1c6]/60 bg-[#abd1c6]/5"
                  : "border-[#abd1c6]/30 bg-[#004643]/50"
            }`}
            style={{
              color: "#fffffe",
              backgroundColor:
                error || isRequiredEmpty
                  ? "rgba(239, 68, 68, 0.05)"
                  : value.trim()
                    ? "rgba(171, 209, 198, 0.05)"
                    : "rgba(0, 70, 67, 0.5)",
            }}
            type={type === "email" ? "text" : type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}

        {/* Иконка валидации справа */}
        {value.trim() && !error && !isRequiredEmpty && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LucideIcons.CheckCircle size="sm" className="text-[#abd1c6]" />
          </div>
        )}
        {(error || isRequiredEmpty) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LucideIcons.XCircle size="sm" className="text-red-400" />
          </div>
        )}
      </div>

      {/* Подсказка и счетчик */}
      {(hint || maxLength) && (
        <div className="flex justify-between items-center text-xs">
          {hint && (
            <span className="text-gray-500 dark:text-gray-400">{hint}</span>
          )}
          {maxLength && (
            <span className={getCounterColor()}>
              {charCount} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* Статус поля */}
      {showValidation && value.trim() && !error && !isRequiredEmpty && (
        <div className="flex items-center gap-2 text-sm mt-1">
          {isOverLimit ? (
            <div className="flex items-center gap-2 text-red-400">
              <LucideIcons.XCircle size="sm" />
              <span>Слишком много символов</span>
            </div>
          ) : isNearLimit ? (
            <div className="flex items-center gap-2 text-lime-400">
              <LucideIcons.Alert size="sm" />
              <span>Приближается лимит</span>
            </div>
          ) : isValid && charCount >= minLength && !isNearLimit ? (
            <div className="flex items-center gap-2 text-green-400">
              <LucideIcons.CheckCircle size="sm" />
              <span>Поле заполнено корректно</span>
            </div>
          ) : charCount > 0 && charCount < minLength ? (
            <div className="flex items-center gap-2 text-yellow-400">
              <LucideIcons.Alert size="sm" />
              <span>Минимум {minLength} символов</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Сообщения об ошибках */}
      {showValidation && (
        <>
          {isRequiredEmpty && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
              <LucideIcons.Alert size="sm" />
              <span>Заполните это поле</span>
            </div>
          )}

          {isOverLimit && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
              <LucideIcons.XCircle size="sm" />
              <span>Превышен лимит символов</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
              <LucideIcons.Alert size="sm" />
              <span>{error}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
