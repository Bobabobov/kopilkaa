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
  rows = 6
}: FormFieldProps) {
  
  // Подсчет символов (без пробелов для textarea, с пробелами для input)
  const charCount = type === "textarea" 
    ? value.replace(/\s/g, '').length 
    : value.trim().length;
  
  const isValid = maxLength ? (charCount >= minLength && charCount <= maxLength) : true;
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
    if (isValid && charCount > 0) return "border-green-300 dark:border-green-600";
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
        animation: `fadeInUp 0.5s ease-out ${delay}s both`
      }}
    >
      {/* Лейбл */}
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {IconComponent && <IconComponent size="sm" className="text-emerald-500" />}
        {label} {required && "*"}
        {maxLength && <span className="text-gray-500">(≤ {maxLength})</span>}
        {ValidationIconComponent && (
          <div
            className={`${getValidationIconColor()} transition-transform duration-200`}
            style={{
              animation: `scaleIn 0.2s ease-out both`
            }}
          >
            <ValidationIconComponent size="sm" />
          </div>
        )}
      </label>
      
      {/* Поле ввода */}
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={compact ? 2 : rows}
            className={`w-full px-4 py-3 rounded-xl border-2 ${getValidationColor()} bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 resize-none ${compact ? 'text-sm' : ''}`}
          />
        ) : (
          <input 
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${getValidationColor()}`}
            type={type === "email" ? "text" : type}
            value={value} 
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
        
        {/* Иконка валидации справа */}
        {ValidationIconComponent && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ValidationIconComponent size="sm" className={getValidationIconColor()} />
          </div>
        )}
      </div>
      
      {/* Подсказка и счетчик */}
      {(hint || maxLength) && (
        <div className="flex justify-between items-center text-xs">
          {hint && <span className="text-gray-500 dark:text-gray-400">{hint}</span>}
          {maxLength && (
            <span className={getCounterColor()}>
              {charCount} / {maxLength}
            </span>
          )}
        </div>
      )}
      
      {/* Сообщения об ошибках */}
      {showValidation && (
        <>
          {isRequiredEmpty && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fadeIn"
            >
              <LucideIcons.Alert size="sm" />
              <span>Заполните это поле</span>
            </motion.div>
          )}
          
          {isOverLimit && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fadeIn"
            >
              <LucideIcons.XCircle size="sm" />
              <span>Превышен лимит символов</span>
            </motion.div>
          )}
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
        </>
      )}
    </div>
  );
}
