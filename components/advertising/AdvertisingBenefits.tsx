"use client";

export function AdvertisingBenefits() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-20 right-10 text-[#f9bc60]/5 text-[300px] font-bold leading-none pointer-events-none">
        5000
      </div>
      <div className="absolute bottom-20 left-10 text-[#f9bc60]/5 text-[200px] font-bold leading-none pointer-events-none">
        95%
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Заголовок с акцентом */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-[#fffffe] mb-6">
            Почему это работает
          </h2>
          <p className="text-xl text-[#abd1c6] max-w-3xl mx-auto">
            Не обещаем золотые горы. Просто факты о нашей аудитории и результатах.
          </p>
        </div>

        {/* Три больших блока */}
        <div className="space-y-20">
          
          {/* Блок 1 - Аудитория */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="mb-8">
                  <div className="text-[#f9bc60] text-7xl md:text-8xl font-bold mb-4 leading-none">
                    5000+
                  </div>
                  <div className="text-3xl text-[#fffffe] font-bold mb-4">
                    Реальных людей каждый день
                  </div>
                  <p className="text-[#abd1c6] text-xl leading-relaxed">
                    Не боты, не накрутка. Люди, которые действительно ищут помощь и поддержку. 
                    Ваша реклама попадает именно к тем, кому она нужна.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#f9bc60] rounded-full"></div>
                    <span className="text-[#abd1c6] text-lg">Живые люди</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#f9bc60] rounded-full"></div>
                    <span className="text-[#abd1c6] text-lg">200+ городов</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#f9bc60] rounded-full"></div>
                    <span className="text-[#abd1c6] text-lg">Средний возраст 25-45</span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 bg-[#004643]/40 border border-[#abd1c6]/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-[#f9bc60] rounded-full"></div>
                  <div className="text-[#abd1c6] text-base font-medium">Топ городов по активности</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#001e1d]/60 border border-[#f9bc60]/20 rounded-xl p-6 hover:bg-[#001e1d]/80 transition-colors">
                    <div className="text-[#fffffe] font-bold text-xl mb-2">Москва</div>
                    <div className="text-[#abd1c6] text-sm mb-3">~35% трафика</div>
                    <div className="w-full bg-[#abd1c6]/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-[#f9bc60] to-[#e8a545] h-3 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                  <div className="bg-[#001e1d]/60 border border-[#f9bc60]/20 rounded-xl p-6 hover:bg-[#001e1d]/80 transition-colors">
                    <div className="text-[#fffffe] font-bold text-xl mb-2">СПб</div>
                    <div className="text-[#abd1c6] text-sm mb-3">~15% трафика</div>
                    <div className="w-full bg-[#abd1c6]/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-[#f9bc60] to-[#e8a545] h-3 rounded-full" style={{width: '15%'}}></div>
                    </div>
                  </div>
                  <div className="bg-[#001e1d]/60 border border-[#f9bc60]/20 rounded-xl p-6 hover:bg-[#001e1d]/80 transition-colors">
                    <div className="text-[#fffffe] font-bold text-xl mb-2">Екатеринбург</div>
                    <div className="text-[#abd1c6] text-sm mb-3">~8% трафика</div>
                    <div className="w-full bg-[#abd1c6]/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-[#f9bc60] to-[#e8a545] h-3 rounded-full" style={{width: '8%'}}></div>
                    </div>
                  </div>
                  <div className="bg-[#001e1d]/60 border border-[#f9bc60]/20 rounded-xl p-6 hover:bg-[#001e1d]/80 transition-colors">
                    <div className="text-[#fffffe] font-bold text-xl mb-2">Новосибирск</div>
                    <div className="text-[#abd1c6] text-sm mb-3">~6% трафика</div>
                    <div className="w-full bg-[#abd1c6]/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-[#f9bc60] to-[#e8a545] h-3 rounded-full" style={{width: '6%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Блок 2 - Результат */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="flex-1">
                <div className="mb-8">
                  <div className="text-[#f9bc60] text-7xl md:text-8xl font-bold mb-4 leading-none">
                    3-5%
                  </div>
                  <div className="text-3xl text-[#fffffe] font-bold mb-4">
                    Кликают на рекламу
                  </div>
                  <p className="text-[#abd1c6] text-xl leading-relaxed">
                    Средний CTR в интернете — 1-2%. У нас в 2-3 раза выше, потому что люди 
                    приходят с конкретными запросами и готовы к действию.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-[#004643]/60 to-[#001e1d]/60 border border-[#f9bc60]/30 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="text-[#f9bc60] font-bold mb-3 flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    <span className="text-2xl">Практический результат</span>
                  </div>
                  <div className="text-[#fffffe] text-3xl font-bold mb-2">150-250 переходов в неделю</div>
                  <div className="text-[#abd1c6] text-lg">с большого баннера</div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 bg-[#004643]/40 border border-[#abd1c6]/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-[#f9bc60] rounded-full"></div>
                  <div className="text-[#abd1c6] text-base font-medium">Сравнение с другими площадками</div>
                </div>
                
                {/* Визуальная диаграмма */}
                <div className="mb-6">
                  <div className="flex items-end justify-center gap-2 h-32">
                    <div className="flex flex-col items-center">
                      <div className="w-12 bg-[#abd1c6]/30 rounded-t-lg h-8 mb-2"></div>
                      <div className="text-[#abd1c6] text-xs text-center">
                        <div className="font-bold">0.5-1%</div>
                        <div>Соцсети</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 bg-[#abd1c6]/60 rounded-t-lg h-16 mb-2"></div>
                      <div className="text-[#abd1c6] text-xs text-center">
                        <div className="font-bold">1-2%</div>
                        <div>Сайты</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 bg-gradient-to-t from-[#f9bc60] to-[#e8a545] rounded-t-lg h-28 mb-2 shadow-lg"></div>
                      <div className="text-[#f9bc60] text-xs text-center font-bold">
                        <div className="text-lg">3-5%</div>
                        <div>Мы</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Детальное сравнение */}
                <div className="space-y-3">
                  <div className="group flex justify-between items-center py-3 px-4 bg-[#001e1d]/60 rounded-xl hover:bg-[#001e1d]/80 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#abd1c6] rounded-full group-hover:bg-[#f9bc60] transition-colors"></div>
                      <span className="text-[#abd1c6] text-lg group-hover:text-[#fffffe] transition-colors">Социальные сети</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#fffffe] font-bold text-xl group-hover:text-[#f9bc60] transition-colors">0.5-1%</div>
                      <div className="text-[#abd1c6] text-xs group-hover:text-[#abd1c6]">много отвлечений</div>
                    </div>
                  </div>
                  
                  <div className="group flex justify-between items-center py-3 px-4 bg-[#001e1d]/60 rounded-xl hover:bg-[#001e1d]/80 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#abd1c6] rounded-full group-hover:bg-[#f9bc60] transition-colors"></div>
                      <span className="text-[#abd1c6] text-lg group-hover:text-[#fffffe] transition-colors">Обычные сайты</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#fffffe] font-bold text-xl group-hover:text-[#f9bc60] transition-colors">1-2%</div>
                      <div className="text-[#abd1c6] text-xs group-hover:text-[#abd1c6]">стандартный CTR</div>
                    </div>
                  </div>
                  
                  <div className="group flex justify-between items-center py-3 px-4 bg-gradient-to-r from-[#f9bc60]/20 to-[#e8a545]/20 border border-[#f9bc60]/40 rounded-xl hover:from-[#f9bc60]/30 hover:to-[#e8a545]/30 hover:scale-105 hover:shadow-lg hover:shadow-[#f9bc60]/20 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#f9bc60] rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                      <span className="text-[#f9bc60] font-bold text-xl group-hover:text-[#001e1d] transition-colors">Наш сайт</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#f9bc60] font-bold text-2xl group-hover:text-[#001e1d] transition-colors">3-5%</div>
                      <div className="text-[#f9bc60] text-xs font-bold group-hover:text-[#001e1d] transition-colors">целевая аудитория</div>
                    </div>
                  </div>
                </div>
                
                {/* Итоговый блок */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[#f9bc60]/10 to-[#e8a545]/10 rounded-xl border border-[#f9bc60]/20">
                  <div className="text-center">
                    <div className="text-[#f9bc60] font-bold text-lg mb-1">В 2-3 раза эффективнее</div>
                    <div className="text-[#abd1c6] text-sm">чем средний показатель по рынку</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Блок 3 - Скорость */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="mb-8">
                  <div className="text-[#f9bc60] text-7xl md:text-8xl font-bold mb-4 leading-none">
                    24ч
                  </div>
                  <div className="text-3xl text-[#fffffe] font-bold mb-4">
                    И реклама уже работает
                  </div>
                  <p className="text-[#abd1c6] text-xl leading-relaxed">
                    Оплатили — разместили. Никаких согласований, ожидания модерации 
                    или сложных процессов. Максимум через сутки ваша реклама показывается.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/60 border border-[#f9bc60]/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-[#f9bc60] font-bold mb-3 flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span className="text-xl">Быстро</span>
                    </div>
                    <div className="text-[#abd1c6] text-lg">Обычно размещаем за 2-4 часа</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/60 border border-[#f9bc60]/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-[#f9bc60] font-bold mb-3 flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span className="text-xl">Прозрачно</span>
                    </div>
                    <div className="text-[#abd1c6] text-lg">Статистику присылаем каждый день</div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 bg-[#004643]/40 border border-[#abd1c6]/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-[#f9bc60] rounded-full"></div>
                  <div className="text-[#abd1c6] text-base font-medium">Что получаете</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-[#001e1d]/60 rounded-xl hover:bg-[#001e1d]/80 transition-colors">
                    <div className="w-3 h-3 bg-[#f9bc60] rounded-full mt-2"></div>
                    <div>
                      <div className="text-[#fffffe] font-bold text-lg mb-1">Детальную статистику показов</div>
                      <div className="text-[#abd1c6]">Каждый день в удобном формате</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-[#001e1d]/60 rounded-xl hover:bg-[#001e1d]/80 transition-colors">
                    <div className="w-3 h-3 bg-[#f9bc60] rounded-full mt-2"></div>
                    <div>
                      <div className="text-[#fffffe] font-bold text-lg mb-1">Количество кликов</div>
                      <div className="text-[#abd1c6]">Точные данные в реальном времени</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-[#001e1d]/60 rounded-xl hover:bg-[#001e1d]/80 transition-colors">
                    <div className="w-3 h-3 bg-[#f9bc60] rounded-full mt-2"></div>
                    <div>
                      <div className="text-[#fffffe] font-bold text-lg mb-1">Поддержку 24/7</div>
                      <div className="text-[#abd1c6]">Ответим в любое время</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-[#001e1d]/60 rounded-xl hover:bg-[#001e1d]/80 transition-colors">
                    <div className="w-3 h-3 bg-[#f9bc60] rounded-full mt-2"></div>
                    <div>
                      <div className="text-[#fffffe] font-bold text-lg mb-1">Возможность изменить креатив</div>
                      <div className="text-[#abd1c6]">Бесплатно в течение кампании</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}