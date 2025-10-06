"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function HowItWorks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="max-w-4xl mx-auto mt-16 px-4"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Как это работает
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#E3EED4] to-[#AEC3B0] dark:from-[#0F2A1D] dark:to-[#375534] border border-[#AEC3B0] dark:border-[#6B9071] hover:shadow-lg hover:scale-105 transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-[#6B9071] text-white font-bold text-sm flex items-center justify-center">
              1
            </div>
          </div>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#6B9071] to-[#375534] flex items-center justify-center mb-6 shadow-lg">
            <LucideIcons.Document size="xl" className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Подайте заявку
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <LucideIcons.Document size="sm" className="text-[#6B9071]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Заполните форму заявки
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LucideIcons.Help size="sm" className="text-[#6B9071]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Опишите вашу ситуацию
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LucideIcons.Money size="sm" className="text-[#6B9071]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Укажите нужную сумму
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[#E3EED4] dark:bg-[#0F2A1D] border border-[#AEC3B0] dark:border-[#6B9071]">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Время: 5-10 минут
            </span>
          </div>
        </div>

        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#AEC3B0] to-[#6B9071] dark:from-[#375534] dark:to-[#6B9071] border border-[#6B9071] dark:border-[#AEC3B0] hover:shadow-lg hover:scale-105 transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-[#6B9071] text-white font-bold text-sm flex items-center justify-center">
              2
            </div>
          </div>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#6B9071] to-[#375534] flex items-center justify-center mb-6 shadow-lg">
            <LucideIcons.Stats size="xl" className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Рассмотрение заявки
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <LucideIcons.Document size="sm" className="text-[#6B9071]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Проверка документов
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LucideIcons.Stats size="sm" className="text-[#6B9071]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Оценка ситуации
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LucideIcons.Star size="sm" className="text-[#6B9071]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Принятие решения
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[#E3EED4] dark:bg-[#0F2A1D] border border-[#AEC3B0] dark:border-[#6B9071]">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Время: 3-5 дней
            </span>
          </div>
        </div>

        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#6B9071] to-[#375534] dark:from-[#6B9071] dark:to-[#375534] border border-[#375534] dark:border-[#6B9071] hover:shadow-lg hover:scale-105 transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-[#375534] text-white font-bold text-sm flex items-center justify-center">
              3
            </div>
          </div>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#375534] to-[#0F2A1D] flex items-center justify-center mb-6 shadow-lg">
            <LucideIcons.Money size="xl" className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Получите помощь
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <LucideIcons.Money size="sm" className="text-[#AEC3B0]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Перевод средств
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LucideIcons.Help size="sm" className="text-[#AEC3B0]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Уведомление о решении
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LucideIcons.Friends size="sm" className="text-[#AEC3B0]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Поддержка проекта
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[#E3EED4] dark:bg-[#0F2A1D] border border-[#AEC3B0] dark:border-[#6B9071]">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Мгновенно
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
