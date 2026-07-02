// app/admin/applications/[id]/components/ApplicationFooter.tsx
"use client";
import { motion } from "framer-motion";
import { buildSubmittedAtDisplay } from "@/lib/admin/formatSubmittedAt";

interface ApplicationFooterProps {
  createdAt: string;
  clientTimezone?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicationId: string;
  onDelete: () => void;
}

export default function ApplicationFooter({
  createdAt,
  clientTimezone,
  status,
  applicationId,
  onDelete,
}: ApplicationFooterProps) {
  const submitted = buildSubmittedAtDisplay(createdAt, clientTimezone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="flex flex-col gap-3 pt-4 border-t min-w-0 w-full overflow-hidden"
      style={{ borderColor: "rgba(171,209,198,0.2)" }}
    >
      <div className="flex gap-2 min-w-0 w-full">
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "#abd1c6" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div
          className="min-w-0 flex-1 text-xs leading-relaxed space-y-0.5"
          style={{ color: "#abd1c6" }}
        >
          <p className="font-semibold text-[#fffffe]">Отправлено</p>
          {submitted.authorTime && submitted.authorCity ? (
            <p>
              У автора ({submitted.authorCity}): {submitted.authorTime}
            </p>
          ) : (
            <>
              <p>{new Date(createdAt).toLocaleString("ru-RU")}</p>
              <p className="text-[10px] opacity-75">
                Часовой пояс автора не записан (старая заявка)
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full min-w-0">
        {status === "APPROVED" && (
          <a
            href={`/stories/${applicationId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full px-3 py-2 bg-[#f9bc60] hover:bg-[#e8a545] rounded-lg transition-colors font-medium shadow-md text-sm"
            style={{ color: "#001e1d" }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Посмотреть историю</span>
          </a>
        )}

        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                "Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.",
              )
            ) {
              onDelete();
            }
          }}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors font-medium shadow-md text-sm"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
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
          <span>Удалить</span>
        </button>
      </div>
    </motion.div>
  );
}
