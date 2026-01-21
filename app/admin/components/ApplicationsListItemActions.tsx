// app/admin/components/ApplicationsListItemActions.tsx
"use client";
import Badge from "./Badge";
import type { ApplicationItem } from "../types";

interface ApplicationsListItemActionsProps {
  item: ApplicationItem;
  onStatusChange: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onQuickUpdate: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onDelete: (id: string) => void;
  onToggleTrust?: (id: string, next: boolean) => void;
}

export default function ApplicationsListItemActions({
  item,
  onStatusChange,
  onQuickUpdate,
  onDelete,
  onToggleTrust,
}: ApplicationsListItemActionsProps) {
  const handleDelete = () => {
    if (
      confirm(
        "Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.",
      )
    ) {
      onDelete(item.id);
    }
  };

  return (
    <div className="flex items-center gap-3 shrink-0">
      <Badge status={item.status} />
      <button
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
        onClick={() =>
          onStatusChange(item.id, item.status, item.adminComment || "")
        }
      >
        Изменить статус
      </button>

      {/* Быстрые действия */}
      <button
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
        onClick={() =>
          onQuickUpdate(item.id, "APPROVED", item.adminComment || "")
        }
      >
        Одобрить
      </button>
      <button
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
        onClick={() =>
          onQuickUpdate(item.id, "REJECTED", item.adminComment || "")
        }
      >
        Отказать
      </button>
      {typeof onToggleTrust === "function" && (
        <label className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={item.countTowardsTrust}
            onChange={(e) => onToggleTrust(item.id, e.target.checked)}
          />
          <span>Засчитывать для доверия</span>
        </label>
      )}
      <button
        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
        onClick={handleDelete}
        title="Удалить заявку"
      >
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}


