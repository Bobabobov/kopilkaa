"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export function TelegramBotCard() {
  const features = [
    "Быстрая подача заявки через удобный интерфейс",
    "Загрузка изображений прямо из Telegram",
    "Мгновенные уведомления о статусе заявки",
    "Прямая связь с администрацией"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 sm:mb-16 md:mb-20"
    >
      <div className="relative group">
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#abd1c6]/20 overflow-hidden shadow-2xl">
          
          <div className="relative z-10">
            {/* Заголовок с иконкой */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-shrink-0 w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 bg-gradient-to-br from-[#0088cc] to-[#0077b5] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-[#0088cc]/40 ring-2 sm:ring-4 ring-[#0088cc]/20"
              >
                <svg className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12" fill="white" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#fffffe] mb-2 sm:mb-3 bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent break-words">
                  Telegram-бот для рекламы
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-[#abd1c6] leading-relaxed">
                  Удобный способ оставить заявку на размещение рекламы прямо из Telegram
                </p>
              </div>
            </div>
            
            {/* Карточка с информацией о боте */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0088cc]/20 to-[#f9bc60]/20 rounded-xl sm:rounded-2xl blur opacity-50"></div>
              <div className="relative bg-[#001e1d]/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#abd1c6]/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0088cc] to-[#0077b5] shadow-xl ring-2 sm:ring-4 ring-[#0088cc]/30 flex-shrink-0"
                  >
                    <Image
                      src="/pigs.png"
                      alt="Telegram бот"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#fffffe] mb-1 break-words">@kopilka_advertising_bot</h3>
                    <p className="text-xs sm:text-sm text-[#abd1c6]">Официальный бот для заявок на рекламу</p>
                  </div>
                </div>
                
                {/* Преимущества */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-[#004643]/40 rounded-lg sm:rounded-xl hover:bg-[#004643]/60 transition-all border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 group/feature"
                    >
                      <motion.span 
                        className="text-[#f9bc60] text-lg sm:text-xl mt-0.5 flex-shrink-0"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                      >
                        ✓
                      </motion.span>
                      <span className="text-xs sm:text-sm text-[#abd1c6] group-hover/feature:text-[#fffffe] transition-colors break-words">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Кнопка */}
            <motion.a
              href="https://t.me/kopilka_advertising_bot"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-[#0088cc] to-[#0077b5] text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-xl shadow-[#0088cc]/40 hover:shadow-[#0088cc]/60 text-sm sm:text-base md:text-lg"
            >
              <svg className="w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span className="whitespace-nowrap">Открыть бота в Telegram</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
