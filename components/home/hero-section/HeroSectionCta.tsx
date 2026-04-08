"use client";

import Link from "next/link";

export function HeroSectionCta() {
  return (
    <div className="text-center mb-10">
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-center text-sm sm:text-base text-[#abd1c6]">
        <Link
          href="/stories"
          className="underline underline-offset-4 hover:text-[#fffffe] transition-colors"
        >
          Смотреть истории →
        </Link>
        <span className="hidden sm:inline text-[#abd1c6]/60">•</span>
        <a
          href="#how-it-works"
          className="underline underline-offset-4 hover:text-[#fffffe] transition-colors"
        >
          Как получить помощь
        </a>
      </div>
      <p className="mt-4 text-sm text-[#94a1b2] max-w-2xl mx-auto leading-relaxed">
        Решение по каждой заявке принимаем мы; помощь не гарантирована, но мы
        помогаем по возможности.
      </p>
    </div>
  );
}
