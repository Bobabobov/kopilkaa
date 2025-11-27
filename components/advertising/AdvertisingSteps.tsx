"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

export function AdvertisingSteps() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Декоративный элемент */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#f9bc60]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#004643]/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Заголовок */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 bg-[#004643]/30 border border-[#f9bc60]/30 rounded-full px-6 py-3">
              <LucideIcons.Zap className="text-[#f9bc60]" size="sm" />
              <span className="text-[#f9bc60] font-semibold">От заявки до результата</span>
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[#fffffe] mb-6 leading-tight">
            Просто как 1, 2, 3, 4
          </h2>
          <p className="text-2xl text-[#abd1c6] max-w-2xl mx-auto">
            Без бюрократии, без ожиданий, без сложностей
          </p>
        </div>

        {/* Временная линия */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Вертикальная линия */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f9bc60] via-[#abd1c6] to-[#f9bc60] opacity-30 hidden md:block"></div>

          {/* Шаги */}
          <div className="space-y-20">

            {/* Шаг 1 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Номер */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-full flex items-center justify-center shadow-2xl shadow-[#f9bc60]/30">
                  <span className="text-3xl md:text-4xl font-black text-[#001e1d]">1</span>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 md:pl-12">
                <div className="bg-gradient-to-br from-[#004643]/50 to-[#001e1d]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8 md:p-10 hover:border-[#f9bc60]/40 transition-all duration-300">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-[#f9bc60]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Edit className="text-[#f9bc60]" size="lg" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#fffffe] mb-3">
                        Заполняете форму
                      </h3>
                      <p className="text-[#abd1c6] text-lg md:text-xl leading-relaxed">
                        Буквально 4 поля: имя, контакт, что рекламируете, бюджет. Всё.
                      </p>
                    </div>
                  </div>
                  
                  {/* Детали */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 bg-[#001e1d]/40 p-4 rounded-xl">
                      <LucideIcons.Clock className="text-[#f9bc60]" size="md" />
                      <span className="text-[#abd1c6] font-medium">2 минуты</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#001e1d]/40 p-4 rounded-xl">
                      <LucideIcons.Check className="text-[#f9bc60]" size="md" />
                      <span className="text-[#abd1c6] font-medium">Без регистрации</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center gap-8">
              {/* Номер */}
              <div className="relative z-10 flex-shrink-0 md:ml-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-full flex items-center justify-center shadow-2xl shadow-[#f9bc60]/30">
                  <span className="text-3xl md:text-4xl font-black text-[#001e1d]">2</span>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 md:pr-12">
                <div className="bg-gradient-to-bl from-[#004643]/50 to-[#001e1d]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8 md:p-10 hover:border-[#f9bc60]/40 transition-all duration-300">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-[#f9bc60]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Phone className="text-[#f9bc60]" size="lg" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#fffffe] mb-3">
                        Мы связываемся с вами
                      </h3>
                      <p className="text-[#abd1c6] text-lg md:text-xl leading-relaxed">
                        Звоним в течение часа. Обсуждаем детали, помогаем с выбором формата.
                      </p>
                    </div>
                  </div>
                  
                  {/* Что обсуждаем */}
                  <div className="space-y-3 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#f9bc60]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
                      </div>
                      <span className="text-[#abd1c6]">Ваши цели и задачи</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#f9bc60]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
                      </div>
                      <span className="text-[#abd1c6]">Оптимальный формат размещения</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#f9bc60]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
                      </div>
                      <span className="text-[#abd1c6]">Точная стоимость и сроки</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Номер */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-full flex items-center justify-center shadow-2xl shadow-[#f9bc60]/30">
                  <span className="text-3xl md:text-4xl font-black text-[#001e1d]">3</span>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 md:pl-12">
                <div className="bg-gradient-to-br from-[#004643]/50 to-[#001e1d]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8 md:p-10 hover:border-[#f9bc60]/40 transition-all duration-300">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-[#f9bc60]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <LucideIcons.CreditCard className="text-[#f9bc60]" size="lg" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#fffffe] mb-3">
                        Оплачиваете
                      </h3>
                      <p className="text-[#abd1c6] text-lg md:text-xl leading-relaxed">
                        Любым удобным способом. Быстро, безопасно, без комиссий.
                      </p>
                    </div>
                  </div>
                  
                  {/* Способы оплаты */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <div className="flex items-center gap-2 bg-[#001e1d]/40 px-4 py-3 rounded-xl border border-[#abd1c6]/10">
                      <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
                      <span className="text-[#abd1c6] text-sm font-medium">Картой</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#001e1d]/40 px-4 py-3 rounded-xl border border-[#abd1c6]/10">
                      <LucideIcons.Smartphone className="text-[#f9bc60]" size="sm" />
                      <span className="text-[#abd1c6] text-sm font-medium">QR-код</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#001e1d]/40 px-4 py-3 rounded-xl border border-[#abd1c6]/10">
                      <LucideIcons.Zap className="text-[#f9bc60]" size="sm" />
                      <span className="text-[#abd1c6] text-sm font-medium">СБП</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#001e1d]/40 px-4 py-3 rounded-xl border border-[#abd1c6]/10">
                      <LucideIcons.Building2 className="text-[#f9bc60]" size="sm" />
                      <span className="text-[#abd1c6] text-sm font-medium">Перевод</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 4 */}
            <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center gap-8">
              {/* Номер */}
              <div className="relative z-10 flex-shrink-0 md:ml-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-full flex items-center justify-center shadow-2xl shadow-[#f9bc60]/30">
                  <span className="text-3xl md:text-4xl font-black text-[#001e1d]">4</span>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 md:pr-12">
                <div className="bg-gradient-to-bl from-[#004643]/50 to-[#001e1d]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8 md:p-10 hover:border-[#f9bc60]/40 transition-all duration-300">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-[#f9bc60]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Rocket className="text-[#f9bc60]" size="lg" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#fffffe] mb-3">
                        Получаете клиентов
                      </h3>
                      <p className="text-[#abd1c6] text-lg md:text-xl leading-relaxed">
                        Через 24 часа реклама на сайте. Каждый день получаете отчёты.
                      </p>
                    </div>
                  </div>
                  
                  {/* Статистика */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-[#001e1d]/40 p-5 rounded-xl border border-[#f9bc60]/20 text-center">
                      <div className="text-3xl font-bold text-[#f9bc60] mb-1">5000+</div>
                      <div className="text-[#abd1c6] text-sm">цель по показам в день</div>
                    </div>
                    <div className="bg-[#001e1d]/40 p-5 rounded-xl border border-[#f9bc60]/20 text-center">
                      <div className="text-3xl font-bold text-[#f9bc60] mb-1">150-250</div>
                      <div className="text-[#abd1c6] text-sm">ожидаемых кликов в неделю при активном трафике</div>
                    </div>
                    <div className="bg-[#001e1d]/40 p-5 rounded-xl border border-[#f9bc60]/20 text-center">
                      <div className="text-3xl font-bold text-[#f9bc60] mb-1">3-5%</div>
                      <div className="text-[#abd1c6] text-sm">ориентир по CTR по рынку</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Финальный блок */}
        <div className="mt-32 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#004643] to-[#001e1d] rounded-3xl p-12 md:p-16 border-2 border-[#f9bc60]/30 relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f9bc60]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f9bc60]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-[#f9bc60] rounded-full flex items-center justify-center mx-auto">
                  <LucideIcons.Zap className="text-[#001e1d]" size="xl" />
                </div>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-[#fffffe] mb-6">
                Всё ещё думаете?
              </h3>
              <p className="text-xl md:text-2xl text-[#abd1c6] mb-10 max-w-2xl mx-auto leading-relaxed">
                Проект сейчас на старте. Это хороший момент, чтобы зайти одним из первых и получить больше внимания к вашей рекламе.
              </p>
              
              <a 
                href="#contact" 
                className="inline-flex items-center gap-3 bg-[#f9bc60] text-[#001e1d] px-10 py-5 text-xl font-bold rounded-full hover:bg-[#e8a545] transition-all duration-300 hover:scale-105 shadow-xl shadow-[#f9bc60]/20"
              >
                <span>Начать прямо сейчас</span>
                <LucideIcons.ArrowRight size="md" />
              </a>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[#abd1c6]">
                <div className="flex items-center gap-2">
                  <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
                  <span className="text-sm">Стараемся отвечать в течение часа</span>
                </div>
                <div className="flex items-center gap-2">
                  <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
                  <span className="text-sm">Планируем запускать рекламу в течение 24 часов</span>
                </div>
                <div className="flex items-center gap-2">
                  <LucideIcons.Check className="text-[#f9bc60]" size="sm" />
                  <span className="text-sm">Без скрытых платежей</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}