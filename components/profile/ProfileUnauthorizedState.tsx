// components/profile/ProfileUnauthorizedState.tsx
// Компонент для отображения состояния неавторизованного пользователя
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function ProfileUnauthorizedState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center rounded-2xl p-10 sm:p-12 max-w-md border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
        style={{
          background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#f9bc60]"
          style={{ background: "rgba(249, 188, 96, 0.15)" }}
        >
          <LucideIcons.User className="w-8 h-8" size="xl" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#fffffe] mb-3">
          Требуется авторизация
        </h1>
        <p className="text-[#abd1c6] mb-8 text-base">
          Войдите в аккаунт, чтобы просмотреть свой профиль
        </p>
        <a
          href="/profile?modal=auth/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            color: "#001e1d",
            boxShadow: "0 8px 24px rgba(249, 188, 96, 0.3)",
          }}
        >
          <LucideIcons.ArrowRight size="sm" />
          Войти в аккаунт
        </a>
      </motion.div>
    </div>
  );
}
