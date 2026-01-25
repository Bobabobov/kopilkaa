// Заголовок страницы баг-репортов
"use client";

import { motion } from "framer-motion";

export default function ReportsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      <div className="inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
        <img
          src="/kopibag.png"
          alt="Баг-репорты"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#e16162] bg-clip-text text-transparent">
        Баг-репорты
      </h1>
      <p className="text-lg text-[#abd1c6] max-w-2xl mx-auto">
        Копилка — молодой проект: баги, уязвимости или любые дыры безопасности
        сразу пишите сюда, мы быстро разберёмся.
      </p>
    </motion.div>
  );
}
