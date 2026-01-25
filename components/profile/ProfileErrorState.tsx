// components/profile/ProfileErrorState.tsx
// Компонент для отображения состояния ошибки при загрузке профиля
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ProfileErrorState({
  error,
  onRetry,
}: ProfileErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center bg-[#004643]/80 backdrop-blur-xl rounded-3xl p-12 max-w-md border border-[#abd1c6]/20"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideIcons.AlertTriangle className="text-red-400" size="xl" />
        </div>
        <h1 className="text-3xl font-bold text-[#fffffe] mb-4">
          Ошибка загрузки
        </h1>
        <p className="text-[#abd1c6] mb-8 text-lg">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-bold rounded-full transition-all duration-300"
        >
          <LucideIcons.ArrowRight size="sm" />
          Попробовать снова
        </button>
      </motion.div>
    </div>
  );
}
