"use client";

import { Card } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AdvertisingContact } from "@/components/advertising";

const ctaPrimary =
  "inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-xl transition-all hover:opacity-90";
const ctaPrimaryStyle = {
  background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
  color: "#001e1d",
  boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
};
const ctaSecondary =
  "inline-flex items-center justify-center px-10 py-5 text-lg font-medium rounded-xl border border-white/20 text-[#fffffe] hover:border-[#f9bc60]/50 hover:text-[#f9bc60] transition-colors";

const formatCardCtaClass =
  "inline-flex items-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all hover:opacity-90";

function scrollToContactWithFormat(format: string) {
  window.location.hash = `#contact?format=${format}`;
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export default function AdvertisingPage() {
  return (
    <main
      className="min-h-screen pb-20 relative"
      aria-label="Реклама на платформе Копилка"
    >
      {/* Фоновые блики */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        aria-hidden
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
      </div>

      {/* Герой секция */}
      <div className="py-32 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold text-[#fffffe] mb-6 tracking-tight">
              Реклама,
              <br />
              которая работает
            </h1>
            <p className="text-xl text-[#abd1c6] max-w-2xl">
              Проект только запускается, аудитория ещё растёт. Первые
              рекламодатели будут особенно заметны на сайте.
            </p>
          </div>

          {/* Три блока информации — darkGlass */}
          <Card variant="darkGlass" padding="lg" className="mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-[#f9bc60] text-2xl font-bold mt-1" aria-hidden>
                  01
                </div>
                <div>
                  <div className="text-[#fffffe] text-xl font-medium mb-1">
                    Вы — среди первых
                  </div>
                  <div className="text-[#abd1c6]">
                    Реклама на главной странице в момент запуска проекта. Пока
                    конкурентов мало, каждое размещение привлекает больше
                    внимания.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#f9bc60] text-2xl font-bold mt-1" aria-hidden>
                  02
                </div>
                <div>
                  <div className="text-[#fffffe] text-xl font-medium mb-1">
                    Условия — гибкие
                  </div>
                  <div className="text-[#abd1c6]">
                    Цена обсуждается индивидуально — подберём формат и срок под
                    вашу задачу
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#f9bc60] text-2xl font-bold mt-1" aria-hidden>
                  03
                </div>
                <div>
                  <div className="text-[#fffffe] text-xl font-medium mb-1">
                    Запускаем за день
                  </div>
                  <div className="text-[#abd1c6]">
                    Оплатили — реклама уже показывается. Никаких согласований и
                    ожиданий
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Кнопки: CTA + вторичные */}
          <div className="flex gap-4 flex-wrap">
            <a href="#contact" className={ctaPrimary} style={ctaPrimaryStyle}>
              Оставить заявку
            </a>
            <a href="#formats" className={ctaSecondary}>
              Посмотреть форматы
            </a>
            <a href="/standards" className={ctaSecondary}>
              Стандарты рекламы
            </a>
          </div>
        </div>
      </div>

      {/* Форматы рекламы */}
      <section
        id="formats"
        className="py-24 px-4 relative z-10"
        aria-labelledby="formats-heading"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <h2
              id="formats-heading"
              className="text-5xl font-bold text-[#fffffe] mb-4"
            >
              Форматы размещения
            </h2>
            <p className="text-xl text-[#abd1c6]">
              4 варианта под разные задачи. Цена — договорная, поможем выбрать.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Большой баннер наверху */}
            <Card variant="darkGlass" padding="lg" className="transition-all hover:border-[#f9bc60]/25">
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3">
                Большой баннер наверху
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-4 font-medium">
                Видят все без исключения
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">
                  Договорная цена
                </span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-4">Срок: неделя</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-6 leading-relaxed">
                План: выйти на ~5000 показов в день по мере роста проекта
              </p>
              <button
                type="button"
                className={formatCardCtaClass}
                style={{ ...ctaPrimaryStyle, padding: "0.75rem 1.5rem", fontSize: "1rem" }}
                onClick={() => scrollToContactWithFormat("banner")}
              >
                Хочу это →
              </button>
            </Card>

            {/* Блок сбоку на главной */}
            <Card variant="darkGlass" padding="lg" className="transition-all hover:border-[#f9bc60]/25">
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3">
                Блок сбоку на главной
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-4 font-medium">
                Постоянно на виду
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">
                  Договорная цена
                </span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-4">Срок: неделя</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-6 leading-relaxed">
                Особенно заметен на старте, пока рекламодателей немного
              </p>
              <button
                type="button"
                className={formatCardCtaClass}
                style={{ ...ctaPrimaryStyle, padding: "0.75rem 1.5rem", fontSize: "1rem" }}
                onClick={() => scrollToContactWithFormat("side")}
              >
                Хочу это →
              </button>
            </Card>

            {/* Рекламная история */}
            <Card variant="darkGlass" padding="lg" className="transition-all hover:border-[#f9bc60]/25">
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3">
                Рекламная история
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-4 font-medium leading-relaxed">
                Отдельная история в разделе /stories на неделю (можно продлить по договорённости)
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">
                  Договорная цена
                </span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-4">Срок: неделя</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-6 leading-relaxed">
                Вы получаете свой блок в списке историй и отдельную страницу с подробным текстом и фотографиями — честный рассказ о вас, без приукрашивания и фейковых цифр.
              </p>
              <button
                type="button"
                className={formatCardCtaClass}
                style={{ ...ctaPrimaryStyle, padding: "0.75rem 1.5rem", fontSize: "1rem" }}
                onClick={() => scrollToContactWithFormat("story")}
              >
                Хочу это →
              </button>
            </Card>

            {/* Пост в Telegram */}
            <Card variant="darkGlass" padding="lg" className="transition-all hover:border-[#f9bc60]/25">
              <h3 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-3">
                Пост в нашем Telegram
              </h3>
              <p className="text-base md:text-lg text-[#abd1c6] mb-4 font-medium">
                Прямо в руки подписчикам
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl md:text-5xl font-bold text-[#f9bc60]">
                  Договорная цена
                </span>
              </div>
              <div className="text-sm text-[#abd1c6]/80 mb-4">Срок: один раз</div>
              <p className="text-sm md:text-base text-[#abd1c6] mb-6 leading-relaxed">
                Живой Telegram‑канал, аудитория растёт
              </p>
              <button
                type="button"
                className={formatCardCtaClass}
                style={{ ...ctaPrimaryStyle, padding: "0.75rem 1.5rem", fontSize: "1rem" }}
                onClick={() => scrollToContactWithFormat("tg")}
              >
                Хочу это →
              </button>
            </Card>
          </div>
        </div>
      </section>

      {/* Выбор способа подачи заявки */}
      <section
        id="contact"
        className="py-24 px-4 relative z-10"
        aria-labelledby="contact-heading"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2
              id="contact-heading"
              className="text-5xl font-bold text-[#fffffe] mb-4"
            >
              Оставить заявку
            </h2>
            <p className="text-xl text-[#abd1c6]">
              Выберите удобный способ подачи заявки
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Вариант 1: Форма на сайте */}
            <Card
              variant="darkGlass"
              padding="lg"
              className="relative cursor-pointer transition-all hover:border-[#f9bc60]/25 group"
              role="button"
              tabIndex={0}
              aria-label="Форма на сайте: прокрутить к форме заявки"
              onClick={() =>
                document
                  .getElementById("contact-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <div
                className="absolute top-4 right-4 w-12 h-12 bg-[#f9bc60]/15 rounded-xl flex items-center justify-center group-hover:bg-[#f9bc60]/25 transition-colors"
                aria-hidden
              >
                <LucideIcons.Document className="w-6 h-6 text-[#f9bc60]" />
              </div>
              <h3 className="text-2xl font-bold text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
                Форма на сайте
              </h3>
              <p className="text-[#abd1c6] mb-6 leading-relaxed">
                Заполните форму прямо на сайте. Все данные сохраняются автоматически.
              </p>
              <div className="space-y-2 text-sm text-[#abd1c6] mb-6">
                <div className="flex items-center gap-2">
                  <LucideIcons.Check className="w-4 h-4 text-[#f9bc60] flex-shrink-0" />
                  <span>Загрузка изображений с компьютера</span>
                </div>
                <div className="flex items-center gap-2">
                  <LucideIcons.Check className="w-4 h-4 text-[#f9bc60] flex-shrink-0" />
                  <span>Мгновенная отправка</span>
                </div>
                <div className="flex items-center gap-2">
                  <LucideIcons.Check className="w-4 h-4 text-[#f9bc60] flex-shrink-0" />
                  <span>Подробная форма с валидацией</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-[#f9bc60] font-semibold group-hover:gap-3 transition-all">
                <span>Заполнить форму</span>
                <span>→</span>
              </div>
            </Card>

            {/* Вариант 2: Telegram бот */}
            <a
              href="https://t.me/kopilka_advertising_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card variant="darkGlass" padding="lg" className="relative h-full transition-all hover:border-[#229ED9]/30 group">
                <div
                  className="absolute top-4 right-4 w-12 h-12 bg-[#229ED9]/15 rounded-xl flex items-center justify-center group-hover:bg-[#229ED9]/25 transition-colors"
                  aria-hidden
                >
                  <svg className="w-6 h-6 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#fffffe] mb-3 group-hover:text-[#229ED9] transition-colors">
                  Telegram-бот
                </h3>
                <p className="text-[#abd1c6] mb-6 leading-relaxed">
                  Напишите нашему боту в Telegram. Быстро, удобно и с уведомлениями.
                </p>
                <div className="space-y-2 text-sm text-[#abd1c6] mb-6">
                  <div className="flex items-center gap-2">
                    <LucideIcons.Check className="w-4 h-4 text-[#229ED9] flex-shrink-0" />
                    <span>Загрузка фото из Telegram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LucideIcons.Check className="w-4 h-4 text-[#229ED9] flex-shrink-0" />
                    <span>Уведомления о статусе</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LucideIcons.Check className="w-4 h-4 text-[#229ED9] flex-shrink-0" />
                    <span>Прямая связь с администрацией</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-[#229ED9] font-semibold group-hover:gap-3 transition-all">
                  <span>Открыть бота</span>
                  <span>→</span>
                </div>
              </Card>
            </a>
          </div>

          {/* Разделитель */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#0d1f1e] text-[#94a1b2] text-sm">или</span>
            </div>
          </div>
        </div>
      </section>

      {/* Форма */}
      <div id="contact-form" className="relative z-10">
        <AdvertisingContact />
      </div>
    </main>
  );
}
