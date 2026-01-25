"use client";

import { motion } from "framer-motion";

export default function NotFoundContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Большой градиентный 404 */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          type: "spring",
          stiffness: 200,
        }}
        className="mb-6 sm:mb-8 md:mb-10"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] bg-clip-text text-transparent leading-none">
          404
        </h1>
      </motion.div>

      {/* Заголовок */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#fffffe] mb-4 sm:mb-6 md:mb-8 leading-tight"
      >
        Упс! Страница потерялась
      </motion.h2>

      {/* Описание */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#abd1c6] mb-8 sm:mb-12 md:mb-16 leading-relaxed max-w-3xl mx-auto"
      >
        Копилка грустит, потому что не может найти эту страницу. Возможно, она
        где-то потерялась или еще строится. Давайте вернемся к главной странице!
      </motion.p>
    </motion.div>
  );
}
