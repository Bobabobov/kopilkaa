"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface SuccessScreenProps {
  onNewApplication: () => void;
}

export default function SuccessScreen({
  onNewApplication,
}: SuccessScreenProps) {
  // onNewApplication больше не используется, но оставляем для совместимости
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-8 sm:py-12"
    >
      {/* Главная иконка успеха */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className="relative inline-block mb-6 sm:mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br from-[#f9bc60] to-[#e8a545] shadow-2xl shadow-[#f9bc60]/30 relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <LucideIcons.CheckCircle size="xl" className="text-[#001e1d]" />
          </motion.div>
        </motion.div>
        {/* Декоративные кольца */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#f9bc60]/30 mx-auto"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#f9bc60]/20 mx-auto"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent"
      >
        Заявка отправлена!
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
      >
        <p className="text-base sm:text-lg md:text-xl text-[#abd1c6] leading-relaxed mb-3">
          Спасибо за вашу заявку!
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-[#d7e9e0] font-semibold flex items-center justify-center gap-2"
        >
          <LucideIcons.Bell size="md" className="text-[#d7e9e0]" />
          Вы получите уведомление о результате в личном кабинете
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 max-w-6xl mx-auto px-4"
      >
        {/* Модерация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 hover:shadow-3xl transition-all duration-500 group"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          </div>
          <div className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#f9bc60]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Clock size="lg" className="text-[#f9bc60]" />
              </motion.div>
            </motion.div>
            <h3 className="font-bold text-[#fffffe] mb-2 text-center text-base sm:text-lg group-hover:text-[#f9bc60] transition-colors duration-300">
              Модерация
            </h3>
            <p className="text-xs sm:text-sm text-center text-[#abd1c6] leading-relaxed">
              Ваша заявка проверяется.
            </p>
          </div>
        </motion.div>

        {/* Уведомления */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 hover:shadow-3xl transition-all duration-500 group"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          </div>
          <div className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#f9bc60]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <LucideIcons.Mail size="lg" className="text-[#f9bc60]" />
              </motion.div>
            </motion.div>
            <h3 className="font-bold text-[#fffffe] mb-2 text-center text-base sm:text-lg group-hover:text-[#f9bc60] transition-colors duration-300">
              Уведомления
            </h3>
            <p className="text-xs sm:text-sm text-center text-[#abd1c6] leading-relaxed">
              Мы сообщим о результате.
            </p>
          </div>
        </motion.div>

        {/* Следующая заявка */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 hover:shadow-3xl transition-all duration-500 group"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          </div>
          <div className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#abd1c6]/15 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <LucideIcons.Clock size="lg" className="text-[#d7e9e0]" />
              </motion.div>
            </motion.div>
            <h3 className="font-bold text-[#fffffe] mb-2 text-center text-base sm:text-lg group-hover:text-[#abd1c6] transition-colors duration-300">
              Следующая заявка
            </h3>
            <p className="text-xs sm:text-sm text-center text-[#c8ddd6] leading-relaxed">
              Новую заявку можно подать через 24 часа — это помогает сохранять честность и порядок
            </p>
          </div>
        </motion.div>

        {/* Поддержка */}
        <Link href="/support">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 hover:shadow-3xl transition-all duration-500 group cursor-pointer"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-red-500/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#abd1c6]/10 to-red-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <LucideIcons.Heart size="lg" className="text-red-400" />
                </motion.div>
              </motion.div>
              <h3 className="font-bold text-[#fffffe] mb-2 text-center text-base sm:text-lg group-hover:text-red-400 transition-colors duration-300">
                Поддержка
              </h3>
              <p className="text-xs sm:text-sm text-center text-[#abd1c6] leading-relaxed">
                Если нужна помощь, обращайтесь в поддержку
              </p>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex justify-center px-4"
      >
        <Link href="/profile">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 sm:px-10 py-3 bg-[#abd1c6]/10 hover:bg-[#abd1c6]/20 text-[#fffffe] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 flex items-center justify-center gap-2 group"
          >
            <LucideIcons.User className="group-hover:scale-110 transition-transform duration-300" size="sm" />
            Мой профиль
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
