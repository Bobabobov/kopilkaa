// app/donate/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function DonateSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Можно проверить статус платежа через API
    // Пока просто показываем успех
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
            <p style={{ color: "#abd1c6" }}>Проверяем платёж...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: "#f9bc6020" }}>
              <LucideIcons.CheckCircle size="lg" className="text-[#f9bc60]" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#fffffe" }}>
              Спасибо за поддержку!
            </h1>
            <p className="text-lg" style={{ color: "#abd1c6" }}>
              Ваш донат успешно пополнил копилку проекта.
            </p>
            {paymentId && (
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                ID платежа: {paymentId}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "#f9bc60",
                  color: "#001e1d"
                }}
              >
                На главную
              </Link>
              <Link
                href="/applications"
                className="px-6 py-3 rounded-xl font-semibold transition-all border-2"
                style={{
                  borderColor: "#abd1c6",
                  color: "#abd1c6"
                }}
              >
                Посмотреть истории
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: "#ef444420" }}>
              <LucideIcons.AlertCircle size="lg" className="text-[#ef4444]" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#fffffe" }}>
              Что-то пошло не так
            </h1>
            <p className="text-lg" style={{ color: "#abd1c6" }}>
              Платёж не был обработан. Попробуйте ещё раз.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: "#f9bc60",
                color: "#001e1d"
              }}
            >
              Вернуться на главную
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}



