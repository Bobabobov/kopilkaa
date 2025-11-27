"use client";

const formats = [
  {
    id: "top-banner",
    name: "Большой баннер наверху",
    why: "Видят все без исключения",
    price: "3000₽",
    time: "неделя",
    reality: "План: выйти на ~5000 показов в день по мере роста проекта",
  },
  {
    id: "side",
    name: "Блок сбоку на главной",
    why: "Постоянно на виду",
    price: "1500₽",
    time: "неделя",
    reality: "Особенно заметен на старте, пока рекламодателей немного",
  },
  {
    id: "story",
    name: "Рекламная история",
    why: "Отдельная история в разделе /stories на неделю (можно продлить по договорённости)",
    price: "2000₽",
    time: "неделя",
    reality:
      "Вы получаете свой блок в списке историй и отдельную страницу с подробным текстом и фотографиями — честный рассказ о вас, без приукрашивания и фейковых цифр.",
  },
  {
    id: "tg",
    name: "Пост в нашем Telegram",
    why: "Прямо в руки подписчикам",
    price: "1000₽",
    time: "один раз",
    reality: "Живой Telegram‑канал, аудитория растёт",
  },
];

export function AdvertisingFormats() {
  return (
    <section id="formats" className="py-24 px-4 border-t border-[#abd1c6]/10">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-[#fffffe] mb-4">Что можно купить</h2>
          <p className="text-xl text-[#abd1c6]">Четыре варианта. Выбирайте любой.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {formats.map((format) => (
            <div 
              key={format.id}
              className="border-2 border-[#abd1c6]/20 p-8 hover:border-[#f9bc60] transition-colors group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#fffffe] mb-2 group-hover:text-[#f9bc60] transition-colors">
                    {format.name}
                  </h3>
                  <p className="text-[#abd1c6]">{format.why}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#f9bc60]">{format.price}</div>
                  <div className="text-[#abd1c6] text-sm">{format.time}</div>
                </div>
              </div>

              <div className="border-t border-[#abd1c6]/10 pt-4">
                <div className="text-[#abd1c6] text-sm mb-4">{format.reality}</div>
                <a 
                  href="#contact"
                  className="inline-block bg-[#004643] text-[#fffffe] px-6 py-3 hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors font-medium"
                >
                  Хочу это →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Честное предложение */}
        <div className="mt-16 border-2 border-[#f9bc60]/30 p-8 bg-[#004643]/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <div className="text-xl font-bold text-[#fffffe] mb-2">Не знаете, что выбрать?</div>
              <p className="text-[#abd1c6] mb-4">
                Напишите нам, расскажите о вашем бизнесе. Мы подскажем, какой формат даст максимум отдачи.
              </p>
              <a 
                href="#contact"
                className="inline-block text-[#f9bc60] hover:underline font-medium"
              >
                Написать в чат →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
