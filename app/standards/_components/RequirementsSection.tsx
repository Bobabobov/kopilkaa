"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function RequirementsSection() {
  return (
    <motion.section
      id="requirements"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="mb-20"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Общие требования */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#f9bc60]/0 to-[#f9bc60]/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-8 bg-[#001e1d]/60 backdrop-blur-sm rounded-3xl border border-[#abd1c6]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center text-[#001e1d]">
                <LucideIcons.ClipboardList className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#fffffe]">
                Общие требования
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#004643]/30 rounded-xl border border-[#abd1c6]/5">
                <h3 className="text-base font-semibold text-[#f9bc60] mb-2 flex items-center gap-2">
                  <LucideIcons.Document className="w-4 h-4 flex-shrink-0" />
                  Текстовый контент
                </h3>
                <ul className="space-y-1.5 text-[#abd1c6] text-sm">
                  <li>
                    • <strong className="text-[#fffffe]">Заголовок:</strong>{" "}
                    20-40 символов
                  </li>
                  <li>
                    • <strong className="text-[#fffffe]">Описание:</strong>{" "}
                    60-120 символов
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-[#fffffe]">Доп. информация:</strong>{" "}
                    до 400 символов
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[#004643]/30 rounded-xl border border-[#abd1c6]/5">
                <h3 className="text-base font-semibold text-[#f9bc60] mb-2 flex items-center gap-2">
                  <LucideIcons.Image className="w-4 h-4 flex-shrink-0" />
                  Изображения
                </h3>
                <ul className="space-y-1.5 text-[#abd1c6] text-sm">
                  <li>
                    • <strong className="text-[#fffffe]">Форматы:</strong> JPG,
                    PNG, WebP
                  </li>
                  <li>
                    • <strong className="text-[#fffffe]">Размер:</strong> до 5MB
                    на изображение
                  </li>
                  <li>
                    • <strong className="text-[#fffffe]">Качество:</strong> HD
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[#004643]/30 rounded-xl border border-[#abd1c6]/5">
                <h3 className="text-base font-semibold text-[#f9bc60] mb-2 flex items-center gap-2">
                  <LucideIcons.Play className="w-4 h-4 flex-shrink-0" />
                  Видео (для большого баннера)
                </h3>
                <ul className="space-y-1.5 text-[#abd1c6] text-sm">
                  <li>
                    • <strong className="text-[#fffffe]">Форматы:</strong> MP4,
                    WebM
                  </li>
                  <li>
                    • <strong className="text-[#fffffe]">Размер:</strong> до 5MB
                    на файл
                  </li>
                  <li>
                    • <strong className="text-[#fffffe]">Показ:</strong> contain
                    (видео целиком, без обрезки)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Рекомендации */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#f9bc60]/0 to-[#f9bc60]/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-8 bg-[#001e1d]/60 backdrop-blur-sm rounded-3xl border border-[#abd1c6]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center text-[#001e1d]">
                <LucideIcons.Lightbulb className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#fffffe]">
                Рекомендации
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#004643]/30 rounded-xl border border-[#abd1c6]/5">
                <h3 className="text-base font-semibold text-[#f9bc60] mb-2 flex items-center gap-2">
                  <LucideIcons.Edit3 className="w-4 h-4 flex-shrink-0" />
                  Заголовок
                </h3>
                <ul className="space-y-1.5 text-[#abd1c6] text-sm">
                  <li>• Понятный и привлекательный</li>
                  <li>• Примеры: "Скидка 20%", "Новинка сезона"</li>
                  <li>• Используйте призыв к действию</li>
                </ul>
              </div>

              <div className="p-4 bg-[#004643]/30 rounded-xl border border-[#abd1c6]/5">
                <h3 className="text-base font-semibold text-[#f9bc60] mb-2 flex items-center gap-2">
                  <LucideIcons.Palette className="w-4 h-4 flex-shrink-0" />
                  Изображения
                </h3>
                <ul className="space-y-1.5 text-[#abd1c6] text-sm">
                  <li>• Четкие, без мелких деталей</li>
                  <li>• Высокое качество (HD)</li>
                  <li>• Оптимизированный размер файла</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
