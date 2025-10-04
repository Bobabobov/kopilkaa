"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import React from "react";

interface FormFieldProps {
  type: "input" | "textarea";
  label: string;
  icon: keyof typeof LucideIcons;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint: string;
  minLength?: number;
  maxLength: number;
  required?: boolean;
  className?: string;
  delay?: number;
  compact?: boolean; // для компактного отображения
  showValidation?: boolean; // показывать ли валидацию
}

export default function FormField({
  type,
  label,
  icon,
  value,
  onChange,
  placeholder,
  hint,
  minLength = 0,
  maxLength,
  required = false,
  className = "",
  delay = 0.1,
  compact = false,
  showValidation = true
}: FormFieldProps) {
  // Считаем символы без пробелов
  const charCount = value.replace(/\s/g, '').length;
  const isValid = charCount >= minLength && charCount <= maxLength;
  const isNearLimit = charCount > maxLength * 0.8;
  const isOverLimit = charCount > maxLength;
  
  // Проверка на обязательность поля
  const isEmpty = charCount === 0;
  const isRequiredEmpty = required && isEmpty;

  const getValidationColor = () => {
    if (isOverLimit || isRequiredEmpty) return "border-red-300 dark:border-red-600";
    if (isNearLimit) return "border-lime-300 dark:border-lime-600";
    if (isValid && charCount > 0) return "border-green-300 dark:border-green-600";
    return "border-slate-300 dark:border-slate-600";
  };

  const getValidationIcon = () => {
    if (isOverLimit || isRequiredEmpty) return LucideIcons.XCircle;
    if (isNearLimit) return LucideIcons.Alert;
    if (isValid && charCount > 0) return LucideIcons.CheckCircle;
    return null;
  };

  const getValidationIconColor = () => {
    if (isOverLimit || isRequiredEmpty) return "text-red-500";
    if (isNearLimit) return "text-lime-500";
    if (isValid && charCount > 0) return "text-green-500";
    return "";
  };

  const getCounterColor = () => {
    if (isOverLimit) return "text-red-500";
    if (isNearLimit) return "text-lime-500";
    return "text-gray-500 dark:text-gray-400";
  };

  const IconComponent = LucideIcons[icon];
  const ValidationIconComponent = getValidationIcon();

  return (
    <div
      className={`space-y-2 relative ${className}`}
      style={{
        animation: `fadeInUp 0.5s ease-out ${delay}s both`
      }}
    >
      
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {IconComponent && <IconComponent size="sm" className="text-emerald-500" />}
        {label} <span className="text-gray-500">(≤ {maxLength})</span>
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
      
      {type === "input" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border-2 ${getValidationColor()} bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300`}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={compact ? 2 : 6}
          className={`w-full px-4 py-3 rounded-xl border-2 ${getValidationColor()} bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 resize-none ${compact ? 'text-sm' : ''}`}
        />
      )}
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500 dark:text-gray-400">{hint}</span>
        <span className={getCounterColor()}>
          {charCount} / {maxLength}
        </span>
      </div>
      
      {/* Кастомное сообщение об ошибке */}
      {showValidation && isRequiredEmpty && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fadeIn">
          <LucideIcons.Alert size="sm" />
          <span>Заполните это поле</span>
        </div>
      )}
      
      {showValidation && isOverLimit && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fadeIn">
          <LucideIcons.XCircle size="sm" />
          <span>Превышен лимит символов</span>
        </div>
      )}
    </div>
  );
}