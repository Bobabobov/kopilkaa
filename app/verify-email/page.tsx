"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const errorText: Record<string, string> = {
  missing_token:
    "В ссылке нет кода подтверждения. Откройте ссылку из последнего письма.",
  invalid_or_expired:
    "Ссылка недействительна или устарела. Запросите новое письмо на экране входа или регистрации.",
  server: "Произошла ошибка сервера. Попробуйте позже.",
};

function VerifyEmailContent() {
  const sp = useSearchParams();
  const err = sp.get("error");

  if (!err) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-[#fffffe]">
        <h1 className="text-2xl font-bold mb-3">Подтверждение email</h1>
        <p className="text-[#abd1c6] leading-relaxed mb-6">
          Мы отправили вам письмо со ссылкой. Откройте ссылку из письма — после
          этого вход в аккаунт по паролю станет доступен.
        </p>
        <p className="text-sm text-[#94a1b2] mb-8">
          Письмо не пришло? Проверьте папку «Спам» или нажмите «Отправить снова»
          в окне входа или регистрации.
        </p>
        <Link
          href="/?modal=auth"
          className="inline-flex rounded-xl bg-[#f9bc60] px-5 py-3 font-semibold text-[#001e1d]"
        >
          На главную
        </Link>
      </div>
    );
  }

  const msg = errorText[err] || errorText.invalid_or_expired;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-[#fffffe]">
      <h1 className="text-2xl font-bold mb-3 text-red-300">
        Не удалось подтвердить
      </h1>
      <p className="text-[#abd1c6] leading-relaxed mb-8">{msg}</p>
      <Link
        href="/?modal=auth"
        className="inline-flex rounded-xl bg-[#f9bc60] px-5 py-3 font-semibold text-[#001e1d]"
      >
        Ко входу
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-[#abd1c6]">
          Загрузка…
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
