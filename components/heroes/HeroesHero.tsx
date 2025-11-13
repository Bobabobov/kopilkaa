// components/heroes/HeroesHero.tsx
"use client";
import Link from "next/link";

export default function HeroesHero() {
  return (
    <div className="flex items-center justify-center px-4 py-24 relative">
      <div className="text-center max-w-4xl mx-auto">
        {/* Основной заголовок */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: "#fffffe" }}
        >
          Поддержавшие
          <br />
          <span style={{ color: "#f9bc60" }}>проект</span>
        </h1>

        {/* Описание */}
        <p
          className="text-xl md:text-2xl mb-8 leading-relaxed"
          style={{ color: "#abd1c6" }}
        >
          Люди, которые поддержали проект
        </p>

        {/* CTA кнопка */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/support"
            className="px-8 py-4 text-lg font-semibold rounded-xl transition-colors"
            style={{
              backgroundColor: "#f9bc60",
              color: "#001e1d",
            }}
          >
            Поддержать проект
          </Link>

          <Link
            href="/"
            className="px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-colors"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
