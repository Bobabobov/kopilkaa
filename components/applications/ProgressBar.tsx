"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProgressBarProps {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  photos: { file: File; url: string }[];
}

const LIMITS = {
  titleMax: 40,
  summaryMax: 140,
  storyMin: 200,
  storyMax: 3000,
  amountMin: 1,
  amountMax: 1000000,
  paymentMin: 10,
  paymentMax: 200,
};

export default function ProgressBar({
  title,
  summary,
  story,
  amount,
  payment,
  photos,
}: ProgressBarProps) {
  // Функция для подсчета символов без пробелов
  const getCharCount = (text: string) => text.replace(/\s/g, "").length;

  const progress = [
    { name: "Заголовок", filled: getCharCount(title) > 0 },
    { name: "Описание", filled: getCharCount(summary) > 0 },
    { name: "История", filled: getCharCount(story) >= LIMITS.storyMin },
    {
      name: "Сумма",
      filled: amount.length > 0 && parseInt(amount) >= LIMITS.amountMin,
    },
    { name: "Реквизиты", filled: getCharCount(payment) >= LIMITS.paymentMin },
    { name: "Фото", filled: photos.length > 0 },
  ];

  const filledCount = progress.filter((p) => p.filled).length;
  const percentage = Math.round((filledCount / progress.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-6 relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 border border-[#abd1c6]/30 shadow-xl"
    >
      {/* Декоративные элементы */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#f9bc60]/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#e16162]/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h3 
            className="text-lg font-bold bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Прогресс заполнения
          </motion.h3>
          <motion.div
            className="text-3xl font-bold bg-gradient-to-br from-[#f9bc60] to-[#e8a545] bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            {percentage}%
          </motion.div>
        </div>
        
        {/* Улучшенная Progress bar */}
        <div className="w-full bg-[#001e1d]/40 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981] rounded-full"></div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </motion.div>
        </div>

        {/* Улучшенные шаги */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {progress.map((step, index) => (
            <motion.div
              key={step.name}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                step.filled
                  ? "bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/10 border border-[#10B981]/30"
                  : "bg-[#001e1d]/30 border border-[#abd1c6]/10"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.filled
                    ? "bg-[#10B981] shadow-lg shadow-[#10B981]/30"
                    : "bg-[#abd1c6]/20"
                }`}
                animate={step.filled ? {
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                {step.filled ? (
                  <LucideIcons.Check className="text-white" size="xs" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#abd1c6]/50"></div>
                )}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  step.filled
                    ? "text-[#10B981]"
                    : "text-[#abd1c6]"
                }`}
              >
                {step.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
