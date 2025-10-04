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
        <LucideIcons.CheckCircle size="xl" className="text-[#abd1c6]" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-3xl font-bold mb-4"
        style={{ color: '#fffffe' }}
      >
        ✅ Заявка отправлена!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg mb-8 max-w-2xl mx-auto"
        style={{ color: '#abd1c6' }}
      >
        Спасибо за вашу заявку! Мы получили её и передали на модерацию. Вы получите уведомление о результате в течение 24 часов.
      </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-white/10" style={{ borderColor: '#abd1c6/20' }}>
                <LucideIcons.Clock size="lg" className="mx-auto mb-3" style={{ color: '#abd1c6' }} />
                <h3 className="font-semibold mb-2" style={{ color: '#fffffe' }}>Модерация</h3>
                <p className="text-sm" style={{ color: '#abd1c6' }}>
                  Ваша заявка проверяется модераторами
                </p>
              </div>
              
              <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-white/10" style={{ borderColor: '#abd1c6/20' }}>
                <LucideIcons.Mail size="lg" className="mx-auto mb-3" style={{ color: '#abd1c6' }} />
                <h3 className="font-semibold mb-2" style={{ color: '#fffffe' }}>Уведомления</h3>
                <p className="text-sm" style={{ color: '#abd1c6' }}>
                  Мы сообщим о результате на email
                </p>
              </div>
              
              <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-white/10" style={{ borderColor: '#abd1c6/20' }}>
                <LucideIcons.Clock size="lg" className="text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2" style={{ color: '#fffffe' }}>Следующая заявка</h3>
                <p className="text-sm" style={{ color: '#abd1c6' }}>
                  Следующую заявку можно подать только через 24 часа
                </p>
              </div>
              
              <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-white/10" style={{ borderColor: '#abd1c6/20' }}>
                <LucideIcons.Heart size="lg" className="text-red-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2" style={{ color: '#fffffe' }}>Поддержка</h3>
                <p className="text-sm" style={{ color: '#abd1c6' }}>
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
          className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
          style={{ borderColor: '#abd1c6/20' }}
        >
          Создать ещё заявку
        </motion.button>
        
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white/20 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                  style={{ 
                    borderColor: '#abd1c6/20',
                    color: '#fffffe'
                  }}
                >
                  Мой профиль
                </motion.button>
              </Link>
      </motion.div>
    </motion.div>
  );
}

