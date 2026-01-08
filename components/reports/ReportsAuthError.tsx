// Компонент ошибки авторизации
"use client";

import { useRouter } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

interface ReportsAuthErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ReportsAuthError({
  error,
  onRetry,
}: ReportsAuthErrorProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="container-p mx-auto max-w-3xl relative z-10 px-4 pt-12 pb-12">
        <div className="rounded-2xl border border-[#e16162]/40 bg-[#001e1d]/40 p-6 text-center space-y-4">
          <div className="text-lg font-semibold text-[#e16162]">Нет доступа</div>
          <p className="text-[#abd1c6]">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() =>
                router.push(
                  buildAuthModalUrl({
                    pathname: window.location.pathname,
                    search: window.location.search,
                    modal: "auth",
                  })
                )
              }
              className="px-4 py-2 rounded-lg bg-[#f9bc60] text-[#001e1d] font-semibold"
            >
              Войти/зарегистрироваться
            </button>
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg border border-[#abd1c6]/40 text-[#abd1c6]"
            >
              Повторить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


