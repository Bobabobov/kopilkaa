// app/admin/components/ApplicationsListItemFooter.tsx
"use client";
import type { ApplicationItem } from "../types";

interface ApplicationsListItemFooterProps {
  item: ApplicationItem;
  adminComment?: string | null;
}

export default function ApplicationsListItemFooter({
  item,
  adminComment,
}: ApplicationsListItemFooterProps) {
  return (
    <>
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Отправлено: {new Date(item.createdAt).toLocaleString()}
        </div>
        <a
          href={`/admin/applications/${item.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm"
        >
          <span>Подробнее</span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {adminComment && (
        <div className="text-sm rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 break-words mt-4">
          <span className="opacity-70">Комментарий модератора: </span>
          {adminComment}
        </div>
      )}
    </>
  );
}
