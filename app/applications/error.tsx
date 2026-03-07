"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Applications page error:", error);
  }, [error]);

  const errorText = error?.message || String(error) || "Неизвестная ошибка";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#004643]">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f9bc60]/20 flex items-center justify-center">
          <LucideIcons.AlertCircle className="text-[#f9bc60]" size="lg" />
        </div>
        <h1 className="text-xl font-semibold text-[#fffffe] mb-2">
          Что-то пошло не так
        </h1>
        <p className="text-[#abd1c6] text-sm mb-6">
          Если вы только что отправили заявку — она, скорее всего, сохранена.
          Перейдите в профиль и проверьте список заявок.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-3 rounded-xl bg-[#f9bc60]/20 hover:bg-[#f9bc60]/30 text-[#fffffe] font-medium border border-[#f9bc60]/40 transition-colors"
          >
            Попробовать снова
          </button>
          <Link
            href="/profile"
            className="px-5 py-3 rounded-xl bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 text-[#fffffe] font-medium border border-[#abd1c6]/40 transition-colors inline-flex items-center justify-center gap-2"
          >
            <LucideIcons.User size="sm" />
            Мой профиль
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="text-xs text-[#94a1b2] underline hover:text-[#abd1c6]"
        >
          {showDetails ? "Скрыть подробности" : "Показать подробности (для поддержки)"}
        </button>
        {showDetails && (
          <p className="mt-3 text-left text-xs text-[#abd1c6]/90 bg-black/20 rounded-lg p-3 break-all font-mono">
            {errorText}
          </p>
        )}
      </div>
    </div>
  );
}
