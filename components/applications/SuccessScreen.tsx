"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface SuccessScreenProps {
  onNewApplication: () => void;
}

export default function SuccessScreen({ onNewApplication }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: '#abd1c6/20' }}
      >
        <LucideIcons.CheckCircle size="xl" className="text-[#f9bc60]" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Заявка отправлена!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
      >
        Спасибо за вашу заявку! Мы получили её и передали на модерацию. 
        Вы получите уведомление о результате в течение 24 часов.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/30">
          <LucideIcons.Clock size="lg" className="mx-auto mb-3 text-[#f9bc60]" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Модерация</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ваша заявка проверяется модераторами
          </p>
        </div>
        
        <div className="backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/30">
          <LucideIcons.Mail size="lg" className="mx-auto mb-3 text-[#f9bc60]" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Уведомления</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Мы сообщим о результате на email
          </p>
        </div>
        
        <div className="backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/30">
          <LucideIcons.Clock size="lg" className="text-orange-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Следующая заявка</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Следующую заявку можно подать только через 24 часа
          </p>
        </div>
        
        <div className="backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/30">
          <LucideIcons.Heart size="lg" className="text-red-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Поддержка</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Если нужна помощь, обращайтесь в поддержку
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewApplication}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Создать ещё заявку
        </motion.button>
        
        <Link href="/profile">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border border-slate-200/50 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Мой профиль
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

