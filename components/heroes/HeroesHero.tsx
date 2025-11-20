// components/heroes/HeroesHero.tsx
"use client";
import Link from "next/link";

export default function HeroesHero() {
  return (
    <div className="flex items-center justify-center px-4 py-16 md:py-20 relative">
      <div className="text-center max-w-4xl mx-auto">
        {/* Заголовок */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#fffffe]">
          Наши
          <br />
          <span className="text-[#f9bc60]">топ‑донатеры</span>
        </h1>

        {/* Описание */}
        <p className="text-lg md:text-2xl mb-8 leading-relaxed text-[#abd1c6]">
          Пользователи, которые задонатили проекту больше всех и помогли выйти в свет
          десяткам историй.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/support"
            className="px-8 py-3 text-base md:text-lg font-semibold rounded-full bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545] transition-colors"
          >
            Поддержать проект
          </Link>
          <Link
            href="/"
            className="text-sm md:text-base text-[#abd1c6] hover:text-[#fffffe] underline-offset-4 hover:underline"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
