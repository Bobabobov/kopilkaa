"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface MotivationalMessagesProps {
  progress: number;
  filledFields: number;
  totalFields: number;
}

const messages = [
  { threshold: 0, text: "Начните заполнение заявки", icon: "Rocket", color: "#f9bc60" },
  { threshold: 20, text: "Отличное начало! Продолжайте", icon: "ThumbsUp", color: "#10B981" },
  { threshold: 40, text: "Вы на полпути! Так держать", icon: "Star", color: "#3B82F6" },
  { threshold: 60, text: "Почти готово! Осталось немного", icon: "Zap", color: "#8B5CF6" },
  { threshold: 80, text: "Превосходно! Завершайте форму", icon: "Trophy", color: "#F59E0B" },
  { threshold: 95, text: "Готово к отправке! 🎉", icon: "CheckCircle", color: "#10B981" },
];

export default function MotivationalMessages({ progress, filledFields, totalFields }: MotivationalMessagesProps) {
  const currentMessage = messages
    .slice()
    .reverse()
    .find((msg) => progress >= msg.threshold) || messages[0];

  const IconComponent = LucideIcons[currentMessage.icon as keyof typeof LucideIcons] || LucideIcons.Star;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={progress}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 border border-[#abd1c6]/30 backdrop-blur-sm"
      >
        {/* Декоративные элементы */}
        <div 
          className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-30"
          style={{ backgroundColor: currentMessage.color }}
        ></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${currentMessage.color}20`, color: currentMessage.color }}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <IconComponent size="sm" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#fffffe]">
              {currentMessage.text}
            </p>
            <p className="text-xs text-[#abd1c6] mt-0.5">
              Заполнено {filledFields} из {totalFields} полей
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


























