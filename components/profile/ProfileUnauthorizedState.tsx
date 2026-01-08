// components/profile/ProfileUnauthorizedState.tsx
// Компонент для отображения состояния неавторизованного пользователя
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function ProfileUnauthorizedState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center bg-[#004643]/80 backdrop-blur-xl rounded-3xl p-12 max-w-md border border-[#abd1c6]/20"
      >
        <div className="w-20 h-20 bg-[#f9bc60]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideIcons.User className="text-[#f9bc60]" size="xl" />
        </div>
        <h1 className="text-3xl font-bold text-[#fffffe] mb-4">
          Требуется авторизация
        </h1>
        <p className="text-[#abd1c6] mb-8 text-lg">
          Войдите в аккаунт, чтобы просмотреть свой профиль
        </p>
        <a
          href="/profile?modal=auth/signup"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-bold rounded-full transition-all duration-300"
        >
          <LucideIcons.ArrowRight size="sm" />
          Войти в аккаунт
        </a>
      </motion.div>
    </div>
  );
}


