"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  className?: string;
  showValidation?: boolean;
}

export default function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = "",
  showValidation = true
}: FormFieldProps) {
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input 
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 ${getValidationColor()}`}
          type={type === "email" ? "text" : type}
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {/* Иконка валидации */}
        {value.trim().length > 0 && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LucideIcons.CheckCircle size="sm" className="text-green-500" />
          </div>
        )}
        {(error || isRequiredEmpty) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LucideIcons.XCircle size="sm" className="text-red-500" />
          </div>
        )}
      </div>
      
      {/* Кастомные сообщения об ошибках */}
      {showValidation && isRequiredEmpty && (
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
    </div>
  );
}




