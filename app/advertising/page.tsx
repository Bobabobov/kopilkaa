"use client";

import { AdvertisingContact } from "@/components/advertising";

export default function AdvertisingPage() {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* Герой секция */}
      <div className="py-32 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-bold text-[#fffffe] mb-6 tracking-tight">
              Реклама,<br />которая работает
            </h1>
            <p className="text-xl text-[#abd1c6] max-w-2xl">
              Проект только запускается, аудитория ещё растёт. Первые рекламодатели будут особенно заметны на сайте.
            </p>
          </div>

          {/* Три блока информации */}
          <div className="space-y-4 mb-12">
            <div className="flex items-start gap-4 group">
              <div className="text-[#f9bc60] text-2xl font-bold mt-1">01</div>
              <div>
                <div className="text-[#fffffe] text-xl font-medium mb-1">Вы — среди первых</div>
                <div className="text-[#abd1c6]">
                  Реклама на главной странице в момент запуска проекта. Пока конкурентов мало, каждое размещение привлекает больше внимания.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="text-[#f9bc60] text-2xl font-bold mt-1">02</div>
              <div>
                <div className="text-[#fffffe] text-xl font-medium mb-1">Условия — гибкие</div>
                <div className="text-[#abd1c6]">Цена обсуждается индивидуально — подберём формат и срок под вашу задачу</div>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="text-[#f9bc60] text-2xl font-bold mt-1">03</div>
              <div>
                <div className="text-[#fffffe] text-xl font-medium mb-1">Запускаем за день</div>
                <div className="text-[#abd1c6]">Оплатили — реклама уже показывается. Никаких согласований и ожиданий</div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4 flex-wrap">
            <a
              href="#contact"
              className="inline-block bg-[#f9bc60] text-[#001e1d] px-10 py-5 text-lg font-medium hover:bg-[#e8a545] transition-colors rounded-xl"
            >
              Оставить заявку
            </a>
            <a
              href="#formats"
              className="inline-block bg-[#abd1c6] text-[#001e1d] px-10 py-5 text-lg font-medium hover:bg-[#d0e3dd] transition-colors rounded-xl"
            >
              Посмотреть форматы
            </a>
            <a
              href="/standards"
              className="inline-block bg-gradient-to-r from-[#004643] to-[#005a57] text-[#fffffe] px-10 py-5 text-lg font-bold hover:from-[#005a57] hover:to-[#006d68] transition-all rounded-xl border-2 border-[#f9bc60]/50 shadow-lg shadow-[#f9bc60]/20 hover:shadow-[#f9bc60]/40 hover:scale-105"
            >
              Стандарты рекламы
            </a>
          </div>
        </div>
      </div>

      {/* Форматы рекламы */}
      <section id="formats" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className="text-5xl font-bold text-[#fffffe] mb-4">Форматы размещения</h2>
            <p className="text-xl text-[#abd1c6]">
              4 варианта под разные задачи. Цена — договорная, поможем выбрать.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Большой баннер наверху */}
            <div className="relative pb-8 border-b border-[#abd1c6]/10 md:border-b-0 md:border-r md:border-r-[#abd1c6]/10 md:pr-8 lg:pr-12 last:border-r-0 transition-all group">
              <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-[#f9bc60] to-transparent group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
                Большой баннер наверху
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-6 font-medium">
                Видят все без исключения
              </p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">Договорная цена</span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-6">Срок: неделя</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-8 leading-relaxed">
                План: выйти на ~5000 показов в день по мере роста проекта
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#contact?format=banner";
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-[#f9bc60] text-[#001e1d] px-6 py-3.5 font-semibold hover:bg-[#e8a545] hover:scale-105 transition-all rounded-xl shadow-lg shadow-[#f9bc60]/20"
              >
                Хочу это →
              </a>
            </div>

            {/* Блок сбоку на главной */}
            <div className="relative pb-8 border-b border-[#abd1c6]/10 md:border-b-0 md:border-r md:border-r-[#abd1c6]/10 md:pr-8 lg:pr-12 last:border-r-0 transition-all group">
              <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-[#f9bc60] to-transparent group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
                Блок сбоку на главной
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-6 font-medium">
                Постоянно на виду
              </p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">Договорная цена</span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-6">Срок: неделя</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-8 leading-relaxed">
                Особенно заметен на старте, пока рекламодателей немного
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#contact?format=side";
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-[#f9bc60] text-[#001e1d] px-6 py-3.5 font-semibold hover:bg-[#e8a545] hover:scale-105 transition-all rounded-xl shadow-lg shadow-[#f9bc60]/20"
              >
                Хочу это →
              </a>
            </div>

            {/* Рекламная история */}
            <div className="relative pb-8 border-b border-[#abd1c6]/10 md:border-b-0 md:border-r md:border-r-[#abd1c6]/10 md:pr-8 lg:pr-12 last:border-r-0 transition-all group md:pt-8 md:border-t md:border-t-[#abd1c6]/10">
              <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-[#f9bc60] to-transparent group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
                Рекламная история
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-6 font-medium leading-relaxed">
                Отдельная история в разделе /stories на неделю (можно продлить по договорённости)
              </p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">Договорная цена</span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-6">Срок: неделя</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-8 leading-relaxed">
                Вы получаете свой блок в списке историй и отдельную страницу с подробным текстом и фотографиями — честный рассказ о вас, без приукрашивания и фейковых цифр.
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#contact?format=story";
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-[#f9bc60] text-[#001e1d] px-6 py-3.5 font-semibold hover:bg-[#e8a545] hover:scale-105 transition-all rounded-xl shadow-lg shadow-[#f9bc60]/20"
              >
                Хочу это →
              </a>
            </div>

            {/* Пост в Telegram */}
            <div className="relative pb-8 transition-all group md:pt-8 md:border-t md:border-t-[#abd1c6]/10">
              <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-[#f9bc60] to-transparent group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
                Пост в нашем Telegram
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-6 font-medium">
                Прямо в руки подписчикам
              </p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">Договорная цена</span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-6">Срок: один раз</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-8 leading-relaxed">
                Живой Telegram‑канал, аудитория растёт
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#contact?format=tg";
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-[#f9bc60] text-[#001e1d] px-6 py-3.5 font-semibold hover:bg-[#e8a545] hover:scale-105 transition-all rounded-xl shadow-lg shadow-[#f9bc60]/20"
              >
                Хочу это →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Выбор способа подачи заявки */}
      <section id="contact" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-[#fffffe] mb-4">Оставить заявку</h2>
            <p className="text-xl text-[#abd1c6]">Выберите удобный способ подачи заявки</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Вариант 1: Форма на сайте */}
            <div 
              className="relative p-8 bg-gradient-to-br from-[#001e1d] to-[#004643] rounded-2xl border-2 border-[#abd1c6]/20 hover:border-[#f9bc60] transition-all duration-300 cursor-pointer group"
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center group-hover:bg-[#f9bc60]/30 transition-colors">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
                Форма на сайте
              </h3>
              <p className="text-[#abd1c6] mb-6 leading-relaxed">
                Заполните форму прямо на сайте. Все данные сохраняются автоматически.
              </p>
              <div className="space-y-2 text-sm text-[#abd1c6] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#f9bc60]">✓</span>
                  <span>Загрузка изображений с компьютера</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f9bc60]">✓</span>
                  <span>Мгновенная отправка</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f9bc60]">✓</span>
                  <span>Подробная форма с валидацией</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-[#f9bc60] font-semibold group-hover:gap-3 transition-all">
                <span>Заполнить форму</span>
                <span>→</span>
              </div>
            </div>

            {/* Вариант 2: Telegram бот */}
            <a
              href="https://t.me/kopilka_advertising_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-8 bg-gradient-to-br from-[#001e1d] to-[#004643] rounded-2xl border-2 border-[#abd1c6]/20 hover:border-[#0088cc] transition-all duration-300 cursor-pointer group block"
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-[#0088cc]/20 rounded-xl flex items-center justify-center group-hover:bg-[#0088cc]/30 transition-colors">
                <svg className="w-6 h-6 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#fffffe] mb-3 group-hover:text-[#0088cc] transition-colors">
                Telegram-бот
              </h3>
              <p className="text-[#abd1c6] mb-6 leading-relaxed">
                Напишите нашему боту в Telegram. Быстро, удобно и с уведомлениями.
              </p>
              <div className="space-y-2 text-sm text-[#abd1c6] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#0088cc]">✓</span>
                  <span>Загрузка фото из Telegram</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0088cc]">✓</span>
                  <span>Уведомления о статусе</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0088cc]">✓</span>
                  <span>Прямая связь с администрацией</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-[#0088cc] font-semibold group-hover:gap-3 transition-all">
                <span>Открыть бота</span>
                <span>→</span>
              </div>
            </a>
          </div>

          {/* Разделитель */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#abd1c6]/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#004643] text-[#abd1c6] text-sm">или</span>
            </div>
          </div>
        </div>
      </section>

      {/* Форма */}
      <div id="contact-form" className="relative z-10">
        <AdvertisingContact />
      </div>
    </div>
  );
}
