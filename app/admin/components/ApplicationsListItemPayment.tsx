// app/admin/components/ApplicationsListItemPayment.tsx
"use client";
import type { ApplicationItem } from "../types";

interface ApplicationsListItemPaymentProps {
  payment: string;
}

export default function ApplicationsListItemPayment({
  payment,
}: ApplicationsListItemPaymentProps) {
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(payment)
      .then(() => {
        const btn = e.target as HTMLButtonElement;
        const icon = btn.querySelector(".copy-icon") as HTMLElement;
        const text = btn.querySelector(".copy-text") as HTMLElement;
        if (icon && text) {
          icon.textContent = "✓";
          text.textContent = "Скопировано";
          btn.className = btn.className
            .replace("hover:bg-blue-100", "bg-green-100")
            .replace("hover:text-blue-700", "text-green-700");
          setTimeout(() => {
            icon.textContent = "📋";
            text.textContent = "Копировать";
            btn.className = btn.className
              .replace("bg-green-100", "hover:bg-blue-100")
              .replace("text-green-700", "hover:text-blue-700");
          }, 1500);
        }
      })
      .catch(() => {
        alert("Ошибка копирования. Выделите текст вручную.");
      });
  };

  return (
    <details className="toggle text-sm mb-6">
      <summary className="flex items-center gap-2 cursor-pointer select-none text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="label-closed">Показать реквизиты</span>
        <span className="label-open">Скрыть реквизиты</span>
      </summary>
      <div className="open-only rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 mt-3 relative group">
        <div className="px-4 py-3 break-words pr-16">
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Реквизиты:{" "}
          </span>
          <span className="select-all text-gray-900 dark:text-white">
            {payment}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-white/90 dark:bg-slate-800/90 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 backdrop-blur-sm shadow-sm"
          title="Копировать реквизиты"
        >
          <span className="copy-icon">📋</span>
          <span className="copy-text">Копировать</span>
        </button>
      </div>
    </details>
  );
}


