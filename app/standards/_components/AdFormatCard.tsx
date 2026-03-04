"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AdFormatData } from "./adFormatsData";

interface AdFormatCardProps {
  format: AdFormatData;
  index: number;
}

export function AdFormatCard({ format, index }: AdFormatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      {/* Фоновый градиент при hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f9bc60]/0 via-[#f9bc60]/20 to-[#f9bc60]/0 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-4 sm:p-6 md:p-8 bg-[#001e1d]/60 rounded-2xl sm:rounded-3xl border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all duration-300 overflow-hidden">
        <div className="relative z-10">
          {/* Заголовок */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black text-[#001e1d] shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
              {format.number}
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#fffffe] group-hover:text-[#f9bc60] transition-colors break-words">
              {format.title}
            </h3>
          </div>

          {/* Информация в сетке */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Размер контейнера */}
            <div className="p-3 sm:p-4 md:p-5 bg-[#004643]/30 rounded-xl sm:rounded-2xl border border-[#abd1c6]/5 hover:border-[#f9bc60]/20 transition-colors">
              <h4 className="text-sm sm:text-base font-semibold text-[#f9bc60] mb-2 sm:mb-3 flex items-center gap-2">
                <LucideIcons.Ruler className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#f9bc60]" />
                <span className="break-words">
                  {format.containerSize.title}
                </span>
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[#abd1c6] text-xs sm:text-sm">
                {format.containerSize.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#f9bc60] mt-1 flex-shrink-0 text-xs">
                      •
                    </span>
                    <span className="leading-relaxed break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Изображения */}
            <div className="p-3 sm:p-4 md:p-5 bg-[#004643]/30 rounded-xl sm:rounded-2xl border border-[#abd1c6]/5 hover:border-[#f9bc60]/20 transition-colors">
              <h4 className="text-sm sm:text-base font-semibold text-[#f9bc60] mb-2 sm:mb-3 flex items-center gap-2">
                <LucideIcons.Image className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#f9bc60]" />
                <span className="break-words">{format.images.title}</span>
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[#abd1c6] text-xs sm:text-sm">
                {format.images.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#f9bc60] mt-1 flex-shrink-0 text-xs">
                      •
                    </span>
                    <span className="leading-relaxed break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Примечание */}
          <div className="p-3 sm:p-4 bg-[#f9bc60]/5 border border-[#f9bc60]/20 rounded-lg sm:rounded-xl">
            <p className="text-xs sm:text-sm text-[#abd1c6] leading-relaxed break-words">
              <LucideIcons.Lightbulb className="inline-block w-4 h-4 align-middle text-[#f9bc60] mr-1" /> {format.note}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
