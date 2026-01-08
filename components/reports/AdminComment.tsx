// Компонент для отображения комментария администратора
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdminCommentProps {
  comment: string;
}

export default function AdminComment({ comment }: AdminCommentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <LucideIcons.MessageCircle
          size="sm"
          className="text-[#3B82F6] mt-0.5 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="text-sm font-medium text-[#3B82F6] mb-2">
            Комментарий администратора:
          </div>
          <div className="text-sm text-[#abd1c6] whitespace-pre-wrap break-words">
            {comment}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


