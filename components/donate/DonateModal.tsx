"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DonateForm } from "./DonateForm";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  quickAmounts: number[];
}

export function DonateModal({
  isOpen,
  onClose,
  amount,
  onAmountChange,
  onSubmit,
  loading,
  error,
  quickAmounts,
}: DonateModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              duration: 0.4,
              bounce: 0.2,
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#001e1d] via-[#002b2a] to-[#001e1d] border-2 border-[#f9bc60]/20 shadow-2xl shadow-[#f9bc60]/10 px-8 py-8 pointer-events-auto overflow-hidden">
              {/* Декоративный фон */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f9bc60]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#abd1c6]/10 rounded-full blur-3xl"></div>
              </div>

              {/* Кнопка закрытия */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 z-10 w-10 h-10 flex items-center justify-center text-[#abd1c6] hover:text-[#f9bc60] hover:bg-[#f9bc60]/10 rounded-xl transition-all duration-200"
              >
                <LucideIcons.X size="md" />
              </motion.button>

              {/* Заголовок */}
              <div className="relative mb-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#f9bc60] via-[#e8a545] to-[#f9bc60] flex items-center justify-center shadow-lg shadow-[#f9bc60]/30"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <LucideIcons.Heart size="lg" className="text-[#001e1d]" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent"
                >
                  Пополнить копилку
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm"
                  style={{ color: "#abd1c6" }}
                >
                  Ваша поддержка помогает проекту развиваться
                </motion.p>
              </div>

              {/* Форма */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <DonateForm
                  amount={amount}
                  onAmountChange={onAmountChange}
                  onSubmit={onSubmit}
                  loading={loading}
                  error={error}
                  quickAmounts={quickAmounts}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
