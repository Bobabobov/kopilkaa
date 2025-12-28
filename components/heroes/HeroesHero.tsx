// components/heroes/HeroesHero.tsx
"use client";
import Link from "next/link";

export default function HeroesHero() {
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative">
      <div className="text-center max-w-4xl mx-auto">
        {/* Заголовок */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#fffffe] leading-tight">
          Пользователи
          <br />
          <span className="text-[#f9bc60]">Поддержавшие проект</span>
        </h1>

        {/* Описание */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 leading-relaxed text-[#abd1c6] px-2">
          Которые внесли вклад в развитие платформы «Копилка» и её работу.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/support"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-semibold rounded-full bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545] transition-colors w-full sm:w-auto"
          >
            Поддержать проект
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm md:text-base text-[#abd1c6] hover:text-[#fffffe] underline-offset-4 hover:underline"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
