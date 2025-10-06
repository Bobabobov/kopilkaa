"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  className?: string;
  showValidation?: boolean;
}

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = "",
  showValidation = true
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Проверка на обязательность поля
  const isEmpty = value.trim().length === 0;
  const isRequiredEmpty = required && isEmpty;
  
  // Функция для получения цвета рамки
  const getValidationColor = () => {
    if (error || isRequiredEmpty) return "border-red-300 dark:border-red-600";
    if (value.trim().length > 0) return "border-green-300 dark:border-green-600";
    return "border-gray-300 dark:border-gray-600";
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: '#abd1c6' }}>
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input 
          className={`w-full px-4 py-3 pr-20 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 ${
            error || isRequiredEmpty 
              ? 'border-red-400 bg-red-50/10' 
              : value.trim() 
                ? 'border-[#abd1c6]/60 bg-[#abd1c6]/5' 
                : 'border-[#abd1c6]/30 bg-[#004643]/50'
          }`}
          style={{ 
            color: '#fffffe',
            backgroundColor: error || isRequiredEmpty ? 'rgba(239, 68, 68, 0.05)' : value.trim() ? 'rgba(171, 209, 198, 0.05)' : 'rgba(0, 70, 67, 0.5)'
          }}
          type={showPassword ? "text" : "password"}
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        
        {/* Иконка валидации */}
        {value.trim().length > 0 && !error && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <LucideIcons.CheckCircle size="sm" className="text-[#abd1c6]" />
          </div>
        )}
        {(error || isRequiredEmpty) && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <LucideIcons.XCircle size="sm" className="text-red-400" />
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 hover:text-[#f9bc60]" 
          style={{ color: '#abd1c6' }}
        >
          {showPassword ? (
            <LucideIcons.EyeOff size="sm" />
          ) : (
            <LucideIcons.Eye size="sm" />
          )}
        </button>
      </div>
      
      {/* Кастомные сообщения об ошибках */}
      {showValidation && isRequiredEmpty && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
          <LucideIcons.Alert size="sm" />
          <span>Заполните это поле</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-fadeIn">
          <LucideIcons.Alert size="sm" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
