// app/admin/achievements/components/GrantSuccessScreen.tsx
"use client";
import { motion } from "framer-motion";

interface GrantSuccessScreenProps {
  achievementName: string;
}

export default function GrantSuccessScreen({
  achievementName,
}: GrantSuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="text-green-500 text-6xl mb-4">✅</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Достижение успешно выдано!
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Пользователь получил достижение "{achievementName}"
      </p>
    </motion.div>
  );
}
