// app/admin/components/ApplicationCardFooter.tsx
"use client";
import type { ApplicationItem } from "../types";

interface ApplicationCardFooterProps {
  applicationId: string;
  createdAt: string;
}

export default function ApplicationCardFooter({
  applicationId,
  createdAt,
}: ApplicationCardFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#abd1c6]/20">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#abd1c6]/70">
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
        <span>
          Отправлено: {new Date(createdAt).toLocaleString("ru-RU")}
        </span>
      </div>

      <a
        href={`/admin/applications/${applicationId}`}
        className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-bold shadow-lg hover:shadow-xl text-xs sm:text-sm"
      >
        <span>Подробнее</span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
  );
}

