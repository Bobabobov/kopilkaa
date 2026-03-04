"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
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
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card variant="darkGlass" padding="md" className="h-full transition-all duration-300 hover:border-[#f9bc60]/30 group">
            <CardContent className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(249, 188, 96, 0.15)" }}
              >
                <LucideIcons.Clock size="lg" className="text-[#f9bc60]" />
              </motion.div>
              <h3 className="font-bold text-[#fffffe] mb-2 text-base sm:text-lg group-hover:text-[#f9bc60] transition-colors">
                Модерация
              </h3>
              <p className="text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                Ваша заявка проверяется.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Уведомления */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <Card variant="darkGlass" padding="md" className="h-full transition-all duration-300 hover:border-[#f9bc60]/30 group">
            <CardContent className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(249, 188, 96, 0.15)" }}
              >
                <LucideIcons.Mail size="lg" className="text-[#f9bc60]" />
              </motion.div>
              <h3 className="font-bold text-[#fffffe] mb-2 text-base sm:text-lg group-hover:text-[#f9bc60] transition-colors">
                Уведомления
              </h3>
              <p className="text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                Мы сообщим о результате.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Следующая заявка */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card variant="darkGlass" padding="md" className="h-full transition-all duration-300 hover:border-white/15 group">
            <CardContent className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/10 mx-auto mb-4 flex items-center justify-center"
              >
                <LucideIcons.Clock size="lg" className="text-[#abd1c6]" />
              </motion.div>
              <h3 className="font-bold text-[#fffffe] mb-2 text-base sm:text-lg group-hover:text-[#abd1c6] transition-colors">
                Следующая заявка
              </h3>
              <p className="text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                Новую заявку можно подать через 24 часа — это помогает сохранять
                честность и порядок
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Поддержка */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <Link href="/support">
            <Card variant="darkGlass" padding="md" className="h-full transition-all duration-300 hover:border-[#f9bc60]/30 cursor-pointer group">
              <CardContent className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-red-500/20 mx-auto mb-4 flex items-center justify-center"
                >
                  <LucideIcons.Heart size="lg" className="text-red-400" />
                </motion.div>
                <h3 className="font-bold text-[#fffffe] mb-2 text-base sm:text-lg group-hover:text-red-400 transition-colors">
                  Поддержка
                </h3>
                <p className="text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                  Если нужна помощь, обращайтесь в поддержку
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex justify-center px-4"
      >
        <Link
          href="/profile"
          className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 font-semibold rounded-xl transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            color: "#001e1d",
            boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
          }}
        >
          <LucideIcons.User size="sm" />
          Мой профиль
        </Link>
      </motion.div>
    </motion.div>
  );
}
