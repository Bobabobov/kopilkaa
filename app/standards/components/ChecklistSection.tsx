"use client";

import { motion } from 'framer-motion';

const basicInfo = [
  "Название компании заполнено",
  "Email указан и валиден",
  "Ссылка на сайт указана и валидна",
  "Формат рекламы выбран",
  "Срок размещения указан"
];

const contentMedia = [
  "Креативы загружены файлом или указаны URL (изображение/видео — где доступно)",
  "Большой баннер: 2 версии креатива (десктоп 1400×250 и мобилка 1080×300)",
  "Доп. информация заполнена (до 400 символов)",
  "Размеры изображений соответствуют требованиям",
  "Все файлы оптимизированы (до 5MB)"
];

export function ChecklistSection() {
  return (
    <motion.section
      id="checklist"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="mb-20"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-full mb-6 backdrop-blur-md">
          <div className="w-2 h-2 bg-[#f9bc60] rounded-full"></div>
          <span className="text-sm font-medium text-[#abd1c6]">Проверка готовности</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#fffffe]">Чек-лист для создания рекламы</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#f9bc60]/0 to-[#f9bc60]/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-6 bg-[#001e1d]/60 backdrop-blur-sm rounded-3xl border border-[#abd1c6]/10">
            <h3 className="text-xl font-semibold text-[#f9bc60] mb-4 flex items-center gap-2">
              <span>📋</span>
              Основная информация
            </h3>
            <div className="space-y-3">
              {basicInfo.map((item, idx) => (
                <motion.label
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-center gap-3 text-[#abd1c6] cursor-pointer hover:text-[#fffffe] transition-colors group/label"
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60] focus:ring-2 cursor-pointer" 
                  />
                  <span className="group-hover/label:translate-x-1 transition-transform text-sm">{item}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#f9bc60]/0 to-[#f9bc60]/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-6 bg-[#001e1d]/60 backdrop-blur-sm rounded-3xl border border-[#abd1c6]/10">
            <h3 className="text-xl font-semibold text-[#f9bc60] mb-4 flex items-center gap-2">
              <span>🎨</span>
              Контент и медиа
            </h3>
            <div className="space-y-3">
              {contentMedia.map((item, idx) => (
                <motion.label
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-center gap-3 text-[#abd1c6] cursor-pointer hover:text-[#fffffe] transition-colors group/label"
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-[#abd1c6]/30 text-[#f9bc60] focus:ring-[#f9bc60] focus:ring-2 cursor-pointer" 
                  />
                  <span className="group-hover/label:translate-x-1 transition-transform text-sm">{item}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
