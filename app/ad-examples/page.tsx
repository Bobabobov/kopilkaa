"use client";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function AdExamplesPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container-p mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#fffffe] mb-4">
            📏 Примеры рекламных блоков
          </h1>
          <p className="text-[#abd1c6] text-lg">
            Стандартные размеры и форматы для размещения рекламы
          </p>
        </div>

        {/* Горизонтальный баннер */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-6">
            1. Горизонтальный баннер (TopBanner)
          </h2>
          <div className="bg-gradient-to-r from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4" style={{ minHeight: '250px' }}>
              <div className="flex items-center justify-between gap-4 h-full">
                {/* Левая часть - контент */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Иконка */}
                  <div className="flex-shrink-0 text-[#f9bc60]">
                    <LucideIcons.Megaphone size="md" />
                  </div>
                  
                  {/* Текст */}
                  <div className="text-[#abd1c6]">
                    <h3 className="text-xl font-bold text-[#fffffe] mb-2">
                      🔥 МЕГА СКИДКА 50% НА ВСЕ ТОВАРЫ!
                    </h3>
                    <p className="text-sm">
                      Только 3 дня! Скидка на весь ассортимент. Не упустите возможность сэкономить!
                    </p>
                  </div>
                </div>

                {/* Правая часть - кнопки */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Ссылка на рекламу */}
                  <a
                    href="#"
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90 transition-all duration-200"
                  >
                    Перейти к акции
                  </a>

                  {/* Кнопка закрытия */}
                  <button className="p-2 rounded-lg hover:bg-[#abd1c6]/20 transition-all duration-200">
                    <LucideIcons.X size="sm" className="text-[#abd1c6]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-[#001e1d] rounded-lg">
            <h4 className="text-[#f9bc60] font-semibold mb-2">Технические характеристики:</h4>
            <ul className="text-[#abd1c6] text-sm space-y-1">
              <li>• <strong>Размер:</strong> 100% × 250px (полная ширина экрана)</li>
              <li>• <strong>Позиция:</strong> Верх страницы (под адресной строкой)</li>
              <li>• <strong>Изображение:</strong> 100% × 150px (соотношение 16:9)</li>
              <li>• <strong>Заголовок:</strong> 30-60 символов</li>
              <li>• <strong>Описание:</strong> 80-150 символов</li>
              <li>• <strong>Адаптивность:</strong> Полностью адаптивный дизайн</li>
            </ul>
          </div>

          {/* Демонстрация адаптивности */}
          <div className="mt-4 p-4 bg-gradient-to-r from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg">
            <h4 className="text-[#f9bc60] font-semibold mb-3">📱 Адаптивность:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-[#fffffe] font-medium mb-2">🖥️ Десктоп (md+)</h5>
                <ul className="text-[#abd1c6] text-xs space-y-1">
                  <li>• Горизонтальный макет</li>
                  <li>• Иконка + текст слева</li>
                  <li>• Кнопки справа</li>
                  <li>• Размер иконки: md</li>
                </ul>
              </div>
              <div>
                <h5 className="text-[#fffffe] font-medium mb-2">📱 Мобильный (&lt;md)</h5>
                <ul className="text-[#abd1c6] text-xs space-y-1">
                  <li>• Вертикальный макет</li>
                  <li>• Иконка + текст сверху</li>
                  <li>• Кнопка по центру снизу</li>
                  <li>• Размер иконки: sm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Боковые блоки */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-6">
            2. Боковые блоки (AdSection, TopDonors)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* AdSection */}
            <div>
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-4">AdSection (левый блок)</h3>
              <div className="w-80 bg-gradient-to-b from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg shadow-2xl p-6">
                {/* Заголовок */}
                <h4 className="text-base font-bold text-[#fffffe] mb-2">
                  Скидка 30% на все товары!
                </h4>
                
                {/* Описание */}
                <p className="text-xs text-[#abd1c6] leading-relaxed mb-4">
                  Только до конца месяца скидка на весь ассортимент магазина. Успейте купить!
                </p>
                
                {/* Изображение */}
                <div className="w-full h-28 bg-[#001e1d] rounded-lg mb-4 flex items-center justify-center border border-[#abd1c6]/20">
                  <span className="text-[#abd1c6]/50 text-xs">320×112px</span>
                </div>
                
                {/* Ссылка */}
                <a
                  href="#"
                  className="block text-center text-xs font-medium text-[#f9bc60] hover:text-[#f9bc60]/80 transition-colors"
                >
                  Перейти к магазину →
                </a>
              </div>
              
              <div className="mt-4 p-3 bg-[#001e1d] rounded-lg">
                <h4 className="text-[#f9bc60] font-semibold mb-2 text-sm">AdSection:</h4>
                <ul className="text-[#abd1c6] text-xs space-y-1">
                  <li>• <strong>Размер:</strong> 320px × 400-500px</li>
                  <li>• <strong>Изображение:</strong> 320×112px</li>
                  <li>• <strong>Позиция:</strong> Левый верхний угол</li>
                </ul>
              </div>
            </div>

            {/* TopDonors */}
            <div>
              <h3 className="text-lg font-semibold text-[#f9bc60] mb-4">TopDonors (правый блок)</h3>
              <div className="w-80 bg-gradient-to-b from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg shadow-2xl p-6">
                {/* Заголовок */}
                <h4 className="text-base font-bold text-[#fffffe] mb-4 flex items-center gap-2">
                  <LucideIcons.Star className="text-[#f9bc60]" size="sm" />
                  Топ донатеров
                </h4>
                
                {/* Список донатеров */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#f9bc60] rounded-full flex items-center justify-center">
                        <span className="text-[#001e1d] font-bold text-sm">{i}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#fffffe]">
                          Пользователь {i}
                        </div>
                        <div className="text-xs text-[#abd1c6]">
                          {10000 - i * 1000} руб
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-[#001e1d] rounded-lg">
                <h4 className="text-[#f9bc60] font-semibold mb-2 text-sm">TopDonors:</h4>
                <ul className="text-[#abd1c6] text-xs space-y-1">
                  <li>• <strong>Размер:</strong> 320px × 400-500px</li>
                  <li>• <strong>Контент:</strong> Топ-3 донатера</li>
                  <li>• <strong>Позиция:</strong> Правый верхний угол</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Сравнительная таблица */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-6">
            3. Сравнительная таблица размеров
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-[#001e1d] rounded-lg border border-[#abd1c6]/30">
              <thead>
                <tr className="border-b border-[#abd1c6]/30">
                  <th className="text-left p-4 text-[#f9bc60] font-semibold">Тип блока</th>
                  <th className="text-left p-4 text-[#f9bc60] font-semibold">Размер</th>
                  <th className="text-left p-4 text-[#f9bc60] font-semibold">Позиция</th>
                  <th className="text-left p-4 text-[#f9bc60] font-semibold">Заголовок</th>
                  <th className="text-left p-4 text-[#f9bc60] font-semibold">Описание</th>
                  <th className="text-left p-4 text-[#f9bc60] font-semibold">Изображение</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#abd1c6]/20">
                  <td className="p-4 text-[#fffffe] font-medium">TopBanner</td>
                  <td className="p-4 text-[#abd1c6]">100% × 250px</td>
                  <td className="p-4 text-[#abd1c6]">Верх страницы</td>
                  <td className="p-4 text-[#abd1c6]">30-60 символов</td>
                  <td className="p-4 text-[#abd1c6]">80-150 символов</td>
                  <td className="p-4 text-[#abd1c6]">
                    100% × 150px<br/>
                    <span className="text-xs text-[#f9bc60]">📱 Адаптивный</span>
                  </td>
                </tr>
                <tr className="border-b border-[#abd1c6]/20">
                  <td className="p-4 text-[#fffffe] font-medium">AdSection</td>
                  <td className="p-4 text-[#abd1c6]">320px × 400-500px</td>
                  <td className="p-4 text-[#abd1c6]">Левый верх</td>
                  <td className="p-4 text-[#abd1c6]">20-40 символов</td>
                  <td className="p-4 text-[#abd1c6]">60-120 символов</td>
                  <td className="p-4 text-[#abd1c6]">320×112px</td>
                </tr>
                <tr>
                  <td className="p-4 text-[#fffffe] font-medium">TopDonors</td>
                  <td className="p-4 text-[#abd1c6]">320px × 400-500px</td>
                  <td className="p-4 text-[#abd1c6]">Правый верх</td>
                  <td className="p-4 text-[#abd1c6]">20-40 символов</td>
                  <td className="p-4 text-[#abd1c6]">60-120 символов</td>
                  <td className="p-4 text-[#abd1c6]">320×112px</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Рекомендации */}
        <div className="bg-gradient-to-r from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#fffffe] mb-4">
            💡 Рекомендации по использованию
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[#f9bc60] font-semibold mb-3">Горизонтальный баннер</h3>
              <ul className="text-[#abd1c6] text-sm space-y-2">
                <li>• Используйте для важных объявлений</li>
                <li>• Подходит для акций и скидок</li>
                <li>• Обращает внимание всех посетителей</li>
                <li>• Можно закрыть пользователем</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#f9bc60] font-semibold mb-3">Боковые блоки</h3>
              <ul className="text-[#abd1c6] text-sm space-y-2">
                <li>• Не мешают основному контенту</li>
                <li>• Подходят для постоянной рекламы</li>
                <li>• Видны только на больших экранах</li>
                <li>• Можно разместить несколько блоков</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ссылки */}
        <div className="mt-8 text-center">
          <Link 
            href="/admin/ads" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
          >
            <LucideIcons.Plus size="sm" />
            Создать рекламу
          </Link>
          <Link 
            href="/standards" 
            className="inline-flex items-center gap-2 ml-4 px-6 py-3 border border-[#abd1c6] text-[#abd1c6] font-semibold rounded-lg hover:bg-[#abd1c6]/10 transition-colors"
          >
            <LucideIcons.FileText size="sm" />
            Подробные стандарты
          </Link>
        </div>
      </div>
    </div>
  );
}
