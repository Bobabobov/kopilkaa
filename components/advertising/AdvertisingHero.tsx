"use client";

export function AdvertisingHero() {
  return (
    <div className="py-32 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        {/* Простой, но мощный заголовок */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-bold text-[#fffffe] mb-6 tracking-tight">
            Реклама,<br />которая работает
          </h1>
          <p className="text-xl text-[#abd1c6] max-w-2xl">
            Без воды и красивых обещаний. Просто разместите рекламу и получите клиентов.
          </p>
        </div>

        {/* Три больших блока информации */}
        <div className="space-y-4 mb-12">
          <div className="flex items-start gap-4 group">
            <div className="text-[#f9bc60] text-2xl font-bold mt-1">01</div>
            <div>
              <div className="text-[#fffffe] text-xl font-medium mb-1">Видят тысячи людей</div>
              <div className="text-[#abd1c6]">Ваша реклама на главной странице, где бывают все наши пользователи</div>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="text-[#f9bc60] text-2xl font-bold mt-1">02</div>
            <div>
              <div className="text-[#fffffe] text-xl font-medium mb-1">Дешевле, чем кажется</div>
              <div className="text-[#abd1c6]">От 1000 рублей за неделю. Меньше, чем стоит обед в кафе</div>
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

        {/* Простая кнопка */}
        <div className="flex gap-4">
          <a
            href="#contact"
            className="inline-block bg-[#f9bc60] text-[#001e1d] px-10 py-5 text-lg font-medium hover:bg-[#e8a545] transition-colors"
          >
            Оставить заявку
          </a>
          <a
            href="#formats"
            className="inline-block border-2 border-[#abd1c6]/30 text-[#fffffe] px-10 py-5 text-lg font-medium hover:border-[#f9bc60] hover:text-[#f9bc60] transition-colors"
          >
            Посмотреть цены
          </a>
        </div>
      </div>
    </div>
  );
}
