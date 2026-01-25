"use client";

import { motion } from "framer-motion";
import { AdFormatCard } from "./AdFormatCard";
import { adFormats } from "./adFormatsData";

export function AdFormatsSection() {
  return (
    <motion.section
      id="formats"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="mb-20"
    >
      <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-full mb-4 sm:mb-6 backdrop-blur-md">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#f9bc60] rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-[#abd1c6]">
              Форматы размещения
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#fffffe] mb-3 sm:mb-4 px-4">
            Форматы рекламы
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#abd1c6] max-w-2xl mx-auto px-4">
            Актуальные форматы размещения и требования к креативам
          </p>
        </motion.div>
      </div>

      <div className="space-y-6">
        {adFormats.map((format, index) => (
          <AdFormatCard key={format.number} format={format} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
