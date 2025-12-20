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
      className="mb-6"
    >
      <div className="rounded-xl sm:rounded-2xl border p-4 sm:p-6" style={{ backgroundColor: "#f9bc60/10", borderColor: "#f9bc60/30" }}>
        <h3 className="flex items-center gap-2 font-semibold mb-3 text-base sm:text-lg" style={{ color: "#f9bc60" }}>
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
        <div className="break-words text-sm sm:text-base" style={{ color: "#fffffe" }}>
          {comment}
        </div>
      </div>
    </motion.div>
  );
}


