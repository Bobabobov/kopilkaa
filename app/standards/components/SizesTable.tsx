"use client";

import { motion } from 'framer-motion';

const tableData = [
  {
    format: "Большой баннер",
    container: "100% × 250px (десктоп) / 300px (мобилка)",
    image: (
      <>
        Десктоп: 1400×250px (contain)<br/>
        <span className="text-xs text-[#f9bc60]">Мобильный: 1080×300px (contain)</span>
      </>
    ),
    maxImages: "2 (десктоп + мобилка)"
  },
  {
    format: "Главная — блок под кнопками",
    container: "до ~900px × 260px (десктоп) / карточка (мобилка)",
    image: (
      <>
        Десктоп: 900×260px<br/>
        <span className="text-xs text-[#f9bc60]">Мобилка (опц.): иконка 256×256px+</span>
      </>
    ),
    maxImages: "1–2 (десктоп + мобилка опц.)"
  },
  {
    format: "Раздел историй — рекламная история",
    container: "Карточка: h-208px (превью) / страница истории",
    image: (
      <>
        Превью: 16:9, 1280×720px+<br/>
        <span className="text-xs">Внутри истории: до 5 изображений</span>
      </>
    ),
    maxImages: "1 превью + до 5 в истории"
  },
  {
    format: "Telegram-пост",
    container: "Текст + изображения",
    image: "1200×800px (рекомендуется)",
    maxImages: "10"
  }
];

export function SizesTable() {
  return (
    <motion.section
      id="sizes"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="mb-12 sm:mb-16 md:mb-20"
    >
      <div className="text-center mb-6 sm:mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-full mb-4 sm:mb-6 backdrop-blur-md">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#f9bc60] rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium text-[#abd1c6]">Сводная таблица</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffffe] px-4">Размеры рекламных блоков</h2>
      </div>
      
      <div className="relative group">
        <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 bg-[#001e1d]/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#abd1c6]/10 overflow-hidden">
          {/* Десктопная таблица */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-[#f9bc60]/30">
                  <th className="text-left p-3 md:p-4 text-[#f9bc60] font-bold text-sm md:text-base">Формат</th>
                  <th className="text-left p-3 md:p-4 text-[#f9bc60] font-bold text-sm md:text-base">Размер контейнера</th>
                  <th className="text-left p-3 md:p-4 text-[#f9bc60] font-bold text-sm md:text-base">Размер изображения</th>
                  <th className="text-left p-3 md:p-4 text-[#f9bc60] font-bold text-sm md:text-base">Макс. изображений</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="border-b border-[#abd1c6]/10 hover:bg-[#004643]/20 transition-colors"
                  >
                    <td className="p-3 md:p-4 text-[#fffffe] font-semibold text-sm md:text-base">{row.format}</td>
                    <td className="p-3 md:p-4 text-[#abd1c6] text-sm md:text-base">{row.container}</td>
                    <td className="p-3 md:p-4 text-[#abd1c6] text-sm md:text-base">{row.image}</td>
                    <td className="p-3 md:p-4 text-[#abd1c6] font-semibold text-sm md:text-base">{row.maxImages}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Мобильные карточки */}
          <div className="md:hidden space-y-4">
            {tableData.map((row, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-4 bg-[#004643]/30 rounded-xl border border-[#abd1c6]/10"
              >
                <div className="mb-3 pb-3 border-b border-[#f9bc60]/30">
                  <h3 className="text-[#f9bc60] font-bold text-sm mb-1">Формат</h3>
                  <p className="text-[#fffffe] font-semibold text-base">{row.format}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-[#f9bc60] font-semibold text-xs mb-1">Размер контейнера</h4>
                    <p className="text-[#abd1c6] text-sm">{row.container}</p>
                  </div>
                  <div>
                    <h4 className="text-[#f9bc60] font-semibold text-xs mb-1">Размер изображения</h4>
                    <p className="text-[#abd1c6] text-sm">{row.image}</p>
                  </div>
                  <div>
                    <h4 className="text-[#f9bc60] font-semibold text-xs mb-1">Макс. изображений</h4>
                    <p className="text-[#abd1c6] font-semibold text-sm">{row.maxImages}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
