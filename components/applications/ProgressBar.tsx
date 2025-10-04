"use client";

import { motion } from "framer-motion";

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

export default function ProgressBar({ title, summary, story, amount, payment, photos }: ProgressBarProps) {
  // Функция для подсчета символов без пробелов
  const getCharCount = (text: string) => text.replace(/\s/g, '').length;
  
  const progress = [
    { name: "Заголовок", filled: getCharCount(title) > 0 },
    { name: "Описание", filled: getCharCount(summary) > 0 },
    { name: "История", filled: getCharCount(story) >= LIMITS.storyMin },
    { name: "Сумма", filled: amount.length > 0 && parseInt(amount) >= LIMITS.amountMin },
    { name: "Реквизиты", filled: getCharCount(payment) >= LIMITS.paymentMin },
    { name: "Фото", filled: photos.length > 0 },
  ];

  const filledCount = progress.filter(p => p.filled).length;
  const percentage = Math.round((filledCount / progress.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Прогресс заполнения</h3>
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{percentage}%</span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <motion.div 
          className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        {progress.map((step, index) => (
          <div key={step.name} className="flex items-center gap-1">
            <span className={step.filled ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>{step.name}</span>
            {index < progress.length - 1 && <span className="text-gray-400">•</span>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

