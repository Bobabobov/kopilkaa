// app/admin/achievements/components/GrantPreview.tsx
"use client";
import { motion } from "framer-motion";
import type { Achievement } from "@/lib/achievements/types";
import type { User } from "./types";

interface GrantPreviewProps {
  achievement: Achievement;
  user: User;
}

export default function GrantPreview({ achievement, user }: GrantPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800"
    >
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
        Предварительный просмотр:
      </h4>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>{user.name || user.email}</strong> получит достижение{" "}
        <strong>"{achievement.name}"</strong>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {achievement.description}
      </p>
    </motion.div>
  );
}
