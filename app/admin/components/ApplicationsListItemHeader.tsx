// app/admin/components/ApplicationsListItemHeader.tsx
"use client";
import type { ApplicationItem } from "../types";

interface ApplicationsListItemHeaderProps {
  item: ApplicationItem;
  isEmailVisible: boolean;
  onToggleEmail: () => void;
}

export default function ApplicationsListItemHeader({
  item,
  isEmailVisible,
  onToggleEmail,
}: ApplicationsListItemHeaderProps) {
  return (
    <div className="min-w-0 flex-1 basis-0">
      <a
        href={`/admin/applications/${item.id}`}
        className="text-xl font-bold clamp-2 break-words max-w-full text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer group-hover:scale-105 transform duration-300"
        title="Открыть полную заявку"
      >
        {item.title}
      </a>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="text-sm text-gray-500 dark:text-gray-400 break-words">
          Автор:
          {isEmailVisible ? (
            <span className="ml-1">
              {!item.user.hideEmail ? item.user.email : "Email скрыт"}
            </span>
          ) : (
            <button
              onClick={onToggleEmail}
              className="ml-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {!item.user.hideEmail ? "Показать email" : "Email скрыт"}
            </button>
          )}
        </div>
      </div>

      {/* Сумма запроса */}
      <div className="mt-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border border-green-200 dark:border-green-700/50">
          <span className="text-green-600 dark:text-green-400 font-bold text-lg">
            ₽{item.amount.toLocaleString()}
          </span>
          <span className="text-xs text-green-700 dark:text-green-300 font-medium">
            Сумма запроса
          </span>
        </div>
      </div>
    </div>
  );
}


