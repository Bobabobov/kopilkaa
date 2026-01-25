"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdRequestSuccessScreenProps {
  onReset: () => void;
}

export function AdRequestSuccessScreen({
  onReset,
}: AdRequestSuccessScreenProps) {
  return (
    <section
      id="contact"
      className="py-16 sm:py-24 px-4"
      style={{ backgroundColor: "#004643" }}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Анимированная галочка */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-[#f9bc60] rounded-full flex items-center justify-center shadow-lg shadow-[#f9bc60]/30"
            >
              <LucideIcons.CheckCircle className="text-[#001e1d]" size="2xl" />
            </motion.div>
          </div>

          {/* Заголовок */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffffe] mb-6"
          >
            Отлично! Заявка отправлена
          </motion.h2>

          {/* Основное сообщение */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#001e1d] to-[#002523] rounded-2xl p-6 sm:p-8 border border-[#abd1c6]/20 mb-8"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-[#abd1c6] mb-4">
              Мы уже изучаем вашу заявку и готовим персональное предложение!
            </p>
            <p className="text-base sm:text-lg text-[#abd1c6]">
              Свяжемся с вами в течение{" "}
              <span className="text-[#f9bc60] font-semibold">15-30 минут</span>.
              Обычно быстрее!
            </p>
          </motion.div>

          {/* Что будет дальше */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#001e1d] to-[#002523] rounded-2xl p-6 border border-[#abd1c6]/20"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#abd1c6]/20 flex items-center justify-center">
                  <LucideIcons.Phone className="text-[#abd1c6]" size="lg" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">
                Свяжемся
              </h3>
              <p className="text-sm text-[#abd1c6]">
                Позвоним или напишем для уточнения деталей
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#001e1d] to-[#002523] rounded-2xl p-6 border border-[#abd1c6]/20"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#f9bc60]/20 flex items-center justify-center">
                  <LucideIcons.Zap className="text-[#f9bc60]" size="lg" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">
                Предложим
              </h3>
              <p className="text-sm text-[#abd1c6]">
                Подберём оптимальный формат и тариф
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-[#001e1d] to-[#002523] rounded-2xl p-6 border border-[#abd1c6]/20"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#e16162]/20 flex items-center justify-center">
                  <LucideIcons.Rocket className="text-[#e16162]" size="lg" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">
                Запустим
              </h3>
              <p className="text-sm text-[#abd1c6]">
                Начнём рекламу уже сегодня
              </p>
            </motion.div>
          </div>

          {/* Контакты для срочности */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-[#001e1d] to-[#002523] rounded-2xl p-6 border border-[#f9bc60]/30 mb-8"
          >
            <p className="text-[#fffffe] font-medium mb-3 flex items-center justify-center gap-2">
              <LucideIcons.AlertCircle className="text-[#e16162]" size="sm" />
              Нужно срочно? Напишите в Telegram:
            </p>
            <a
              href="https://t.me/bobabobovv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#f9bc60] hover:text-[#e8a545] font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              <span>@bobabobovv</span>
            </a>
          </motion.div>

          {/* Кнопка возврата */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={onReset}
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#abd1c6] text-[#001e1d] rounded-xl hover:bg-[#d0e3dd] transition-all duration-300 font-semibold text-sm sm:text-base"
          >
            <LucideIcons.ArrowLeft size="sm" />
            <span>Отправить ещё одну заявку</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
