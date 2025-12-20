"use client";

import { motion } from "framer-motion";
import GamePreview from "@/components/games/GamePreview";

export default function GamesPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 sm:mb-12 md:mb-16"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fffffe] mb-2">
          Доступные игры
        </h2>
        <p className="text-sm sm:text-base text-[#abd1c6]">
          Скоро здесь появятся новые игры
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto justify-center">
        <div className="md:col-start-1 md:col-end-2 lg:col-start-2 lg:col-end-3">
          <GamePreview
            title="Tower Blocks"
            description="3D игра на точность и реакцию. Сейчас игра временно недоступна — раздел в разработке."
            icon="🏗️"
            href="/tower-blocks"
            difficulty="Средне"
            category="Аркада"
            isAvailable={false}
          />
        </div>
      </div>
    </motion.div>
  );
}

