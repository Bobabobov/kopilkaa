import React from 'react';

export default function StandardsPage() {
  return (
    <div className="min-h-screen pt-8 pb-6 px-6" style={{ backgroundColor: "#004643" }}>
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#fffffe] mb-4">
            📏 Стандарты рекламных блоков
          </h1>
          <p className="text-lg text-[#abd1c6]">
            Руководство по созданию и размещению рекламы на платформе
          </p>
        </div>

        {/* Основные размеры */}
        <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-4">🎯 Основные размеры</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Боковые блоки</h3>
              <ul className="space-y-2 text-[#abd1c6]">
                <li><strong className="text-[#fffffe]">Ширина:</strong> 320px (w-80)</li>
                <li><strong className="text-[#fffffe]">Высота:</strong> Адаптивная (400-500px)</li>
                <li><strong className="text-[#fffffe]">Отступы:</strong> 16px (p-4) или 24px (p-6)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Изображения</h3>
              <ul className="space-y-2 text-[#abd1c6]">
                <li><strong className="text-[#fffffe]">Размер:</strong> 320x112px</li>
                <li><strong className="text-[#fffffe]">Соотношение:</strong> 2.86:1</li>
                <li><strong className="text-[#fffffe]">Класс:</strong> w-full h-28</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Детальные стандарты */}
        <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-4">📐 Детальные стандарты</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">1. Контейнер рекламы</h3>
              <div className="bg-[#001e1d] p-3 rounded border border-[#abd1c6]/10">
                <code className="text-[#abd1c6] text-sm">
                  .w-80 {'{'} width: 320px; {'}'}<br/>
                  .p-4 {'{'} padding: 16px; {'}'}<br/>
                  .p-6 {'{'} padding: 24px; {'}'}
                </code>
              </div>
            </div>
            
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">2. Изображения</h3>
              <div className="bg-[#001e1d] p-3 rounded border border-[#abd1c6]/10">
                <code className="text-[#abd1c6] text-sm">
                  .w-full.h-28 {'{'} width: 100%; height: 112px; {'}'}<br/>
                  .object-cover.rounded-lg {'{'} object-fit: cover; border-radius: 8px; {'}'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Визуальные стандарты */}
        <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-4">🎨 Визуальные стандарты</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Цветовая схема</h3>
              <ul className="space-y-2 text-[#abd1c6]">
                <li><strong className="text-[#fffffe]">Фон:</strong> #004643 → #001e1d</li>
                <li><strong className="text-[#fffffe]">Заголовок:</strong> #fffffe</li>
                <li><strong className="text-[#fffffe]">Описание:</strong> #abd1c6</li>
                <li><strong className="text-[#fffffe]">Акценты:</strong> #f9bc60</li>
              </ul>
            </div>
            
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Эффекты</h3>
              <ul className="space-y-2 text-[#abd1c6]">
                <li><strong className="text-[#fffffe]">Тень:</strong> shadow-2xl</li>
                <li><strong className="text-[#fffffe]">Анимация:</strong> hover:scale-105</li>
                <li><strong className="text-[#fffffe]">Переходы:</strong> duration-500</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Рекомендации для контента */}
        <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-4">📋 Рекомендации для контента</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Заголовок рекламы</h3>
              <ul className="space-y-2 text-[#abd1c6]">
                <li><strong className="text-[#fffffe]">Длина:</strong> 20-40 символов</li>
                <li><strong className="text-[#fffffe]">Стиль:</strong> Понятный и привлекательный</li>
                <li><strong className="text-[#fffffe]">Примеры:</strong> "Скидка 20%", "Новинка сезона"</li>
              </ul>
            </div>
            
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Описание</h3>
              <ul className="space-y-2 text-[#abd1c6]">
                <li><strong className="text-[#fffffe]">Длина:</strong> 60-120 символов</li>
                <li><strong className="text-[#fffffe]">Стиль:</strong> Информативный, с призывом к действию</li>
                <li><strong className="text-[#fffffe]">Пример:</strong> "Только до конца недели скидка на весь ассортимент"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Примеры */}
        <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-4">📊 Примеры использования</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#004643] rounded-lg border border-[#abd1c6]/20">
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-2">Торговая реклама</h3>
              <div className="space-y-2 text-[#abd1c6]">
                <p><strong className="text-[#fffffe]">Заголовок:</strong> "Скидка 30% на все товары!"</p>
                <p><strong className="text-[#fffffe]">Описание:</strong> "Только до конца месяца скидка на весь ассортимент магазина. Успейте купить!"</p>
                <p><strong className="text-[#fffffe]">Изображение:</strong> 320x112px товар или акция</p>
              </div>
            </div>
          </div>
        </div>

        {/* Чек-лист */}
        <div className="p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-4">✅ Чек-лист для создания рекламы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Заголовок 20-40 символов
              </label>
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Описание 60-120 символов
              </label>
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Изображение 320x112px
              </label>
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Валидная ссылка
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Дата истечения установлена
              </label>
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Реклама активирована
              </label>
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Проверка отображения
              </label>
              <label className="flex items-center gap-2 text-[#abd1c6]">
                <input type="checkbox" className="rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60]" />
                Тестирование на мобильных
              </label>
            </div>
          </div>
        </div>

        {/* Ссылки */}
        <div className="mt-8 text-center">
          <a 
            href="/admin/ads" 
            className="inline-block px-6 py-3 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
          >
            🎯 Перейти к управлению рекламой
          </a>
        </div>
      </div>
    </div>
  );
}
