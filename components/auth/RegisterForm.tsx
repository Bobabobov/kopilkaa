"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FormField from "@/components/ui/FormField";
import PasswordField from "./PasswordField";

interface FormData {
  email: string;
  name: string;
  password: string;
  password2: string;
  acceptTerms: boolean;
}

interface RegisterFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  busy: boolean;
  errors: {[key: string]: string};
}

export default function RegisterForm({ onSubmit, busy, errors }: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    password2: "",
    acceptTerms: false
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4 pt-24 relative">
      {/* Декоративные элементы */}
      <div className="absolute top-10 right-20 w-20 h-20 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-16 w-28 h-28 bg-gradient-to-br from-green-400/15 to-yellow-400/15 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Создать аккаунт</h1>
          <p className="text-gray-600 dark:text-gray-400">Присоединяйтесь к нашей платформе</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email */}
          <FormField
            label="Email адрес"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="your@email.com"
            error={errors.email}
          />
          
          {/* Имя */}
          <FormField
            label="Имя"
            type="input"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="Как к вам обращаться"
            error={errors.name}
          />
          
          {/* Пароль */}
          <PasswordField
            label="Пароль"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Минимум 8 символов"
            error={errors.password}
          />
          
          {/* Подтверждение пароля */}
          <PasswordField
            label="Подтвердите пароль"
            value={formData.password2}
            onChange={(value) => handleInputChange('password2', value)}
            placeholder="Повторите пароль"
            error={errors.password2}
          />

          {/* Согласие с правилами */}
          <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
            errors.acceptTerms 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
              : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50'
          }`}>
            <input 
              type="checkbox" 
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={e => handleInputChange('acceptTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Я соглашаюсь с{" "}
              <Link href="/terms" target="_blank" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                правилами и условиями
              </Link>
              {" "}использования платформы и{" "}
              <Link href="/terms" target="_blank" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                политикой конфиденциальности
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600 dark:text-red-400"
            >
              {errors.acceptTerms}
            </motion.p>
          )}

          {/* Общие ошибки */}
          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Кнопка отправки */}
          <motion.button 
            type="submit" 
            disabled={busy}
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: busy ? 1 : 0.98 }}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              busy 
                ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {busy ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Создание аккаунта...
              </div>
            ) : (
              'Создать аккаунт'
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Уже есть аккаунт? </span>
          <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
            Войти
          </Link>
        </div>
      </motion.div>
    </div>
  );
}




