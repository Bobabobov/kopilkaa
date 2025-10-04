// components/terms/TermsHeader.tsx
"use client";

export default function TermsHeader() {
  return (
    <div className="text-center mb-12 animate-fade-in-up">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Пользовательское соглашение
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
        и Политика конфиденциальности
      </p>
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
        <span>Версия: 1.0</span>
        <span>•</span>
        <span>Дата вступления в силу: 25.09.2025</span>
      </div>
    </div>
  );
}
