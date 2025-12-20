"use client";

import { motion } from "framer-motion";
import GamesInfoCard from "./GamesInfoCard";

const infoCards = [
  {
    icon: "🎯",
    title: "Разнообразие игр",
    description: "Планируем добавить различные типы игр: головоломки, аркады, стратегии"
  },
  {
    icon: "🏆",
    title: "Система достижений",
    description: "Каждая игра будет интегрирована с системой достижений и рейтингов"
  },
  {
    icon: "⚡",
    title: "Быстрая разработка",
    description: "Мы активно работаем над играми и скоро представим первые результаты"
  }
];

export default function GamesInfoCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
    >
      {infoCards.map((card, index) => (
        <GamesInfoCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          index={index}
        />
      ))}
    </motion.div>
  );
}

