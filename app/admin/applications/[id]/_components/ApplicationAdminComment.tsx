// app/admin/applications/[id]/components/ApplicationAdminComment.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationAdminCommentProps {
  comment: string;
}

export default function ApplicationAdminComment({
  comment,
}: ApplicationAdminCommentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mb-6 min-w-0 overflow-hidden"
    >
      <div
        className="rounded-2xl border p-3 sm:p-6 min-w-0 bg-gradient-to-br from-[#f9bc60]/18 via-[#004643]/80 to-[#001e1d]/90"
        style={{ borderColor: "rgba(249, 188, 96, 0.7)" }}
      >
        <h3
          className="flex items-center gap-2 font-semibold mb-3 text-base sm:text-lg"
          style={{ color: "#f9bc60" }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Комментарий модератора
        </h3>
        <div
          className="break-words text-sm sm:text-base"
          style={{ color: "#fffffe" }}
        >
          {comment}
        </div>
      </div>
    </motion.div>
  );
}
