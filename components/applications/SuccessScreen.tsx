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
        Спасибо за вашу заявку! Мы получили её и передали на модерацию. 
        <span style={{ color: '#f9bc60' }}>Вы получите уведомление о результате в течение 24 часов.</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-xl p-6 shadow-lg" style={{ borderColor: '#abd1c6/30' }}>
          <LucideIcons.Clock size="lg" className="mx-auto mb-3" style={{ color: '#f9bc60' }} />
          <h3 className="font-semibold mb-2" style={{ color: '#001e1d' }}>Модерация</h3>
          <p className="text-sm" style={{ color: '#2d5a4e' }}>
            Ваша заявка проверяется модераторами
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl rounded-xl p-6 shadow-lg" style={{ borderColor: '#abd1c6/30' }}>
          <LucideIcons.Mail size="lg" className="mx-auto mb-3" style={{ color: '#f9bc60' }} />
          <h3 className="font-semibold mb-2" style={{ color: '#001e1d' }}>Уведомления</h3>
          <p className="text-sm" style={{ color: '#2d5a4e' }}>
            Мы сообщим о результате на email
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl rounded-xl p-6 shadow-lg" style={{ borderColor: '#abd1c6/30' }}>
          <LucideIcons.Clock size="lg" className="text-orange-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2" style={{ color: '#001e1d' }}>Следующая заявка</h3>
          <p className="text-sm" style={{ color: '#2d5a4e' }}>
            Следующую заявку можно подать только через 24 часа
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl rounded-xl p-6 shadow-lg" style={{ borderColor: '#abd1c6/30' }}>
          <LucideIcons.Heart size="lg" className="text-red-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2" style={{ color: '#001e1d' }}>Поддержка</h3>
          <p className="text-sm" style={{ color: '#2d5a4e' }}>
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
          className="px-8 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)' }}
        >
          Создать ещё заявку
        </motion.button>
        
        <Link href="/profile">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/90 backdrop-blur-xl font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ 
              borderColor: '#abd1c6/30',
              color: '#2d5a4e'
            }}
          >
            Мой профиль
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

