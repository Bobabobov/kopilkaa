// components/heroes/HeroesHero.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

export default function HeroesHero() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 md:pt-14 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-[#0c332e] via-[#0b2a25] to-[#0a201d] p-6 sm:p-8 md:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-[#f9bc60]/10 blur-3xl" />
            <div className="absolute -right-20 top-10 w-80 h-80 rounded-full bg-[#abd1c6]/10 blur-3xl" />
            <div className="absolute right-0 bottom-0 w-[520px] h-[520px] opacity-20">
              <Image
                src="/hero.png"
                alt=""
                fill
                className="object-contain object-right-bottom"
                priority={false}
              />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 text-[#abd1c6] text-sm border border-white/10">
                Публичная витрина
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffffe] leading-tight">
                Герои проекта
                <span className="block text-[#f9bc60]">публичные профили раздела</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg md:text-xl leading-relaxed text-[#abd1c6] max-w-2xl">
                Здесь отображаются пользователи, которые оплатили цифровую услугу размещения профиля
                в разделе «Герои».
              </p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-[#abd1c6]/90 leading-relaxed max-w-2xl">
                Размещение профиля в разделе “Герои” является платной цифровой услугой. Оплата не является
                пожертвованием, благотворительностью или переводом средств другим пользователям.
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-full bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545] transition-colors"
                >
                  Разместиться в разделе “Герои”
                </Link>
                <a
                  href="#heroes-list"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-full border border-white/15 bg-white/5 text-[#fffffe] hover:bg-white/10 transition-colors"
                >
                  Смотреть рейтинг
                </a>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-[#f9bc60]/10 via-transparent to-[#abd1c6]/10 blur-2xl" />
              <div className="relative rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <div className="text-sm text-[#94a1b2]">Быстрый переход</div>
                <div className="mt-2 text-xl font-semibold text-[#fffffe]">
                  Оплата → профиль → участие в рейтинге
                </div>
                <div className="mt-3 text-sm text-[#abd1c6] leading-relaxed">
                  Привяжите соцсети на странице оплаты — они отображаются в карточке профиля в «Героях».
                </div>
                <div className="mt-5 flex gap-2">
                  <Link
                    href="/support"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#c7d4d0] hover:border-white/20 hover:bg-white/10 transition-colors text-sm font-semibold"
                  >
                    Страница услуги
                  </Link>
                  <Link
                    href="/"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#c7d4d0] hover:border-white/20 hover:bg-white/10 transition-colors text-sm font-semibold"
                  >
                    На главную
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
