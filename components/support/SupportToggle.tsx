"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface SupportToggleProps {
  isSubscription: boolean;
  onToggle: (isSubscription: boolean) => void;
}

export default function SupportToggle({ isSubscription, onToggle }: SupportToggleProps) {
  return (
    <section className="py-5 sm:py-6 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-5 sm:mb-6"
        >
          <p className="text-sm sm:text-base text-[#abd1c6]/90 font-medium tracking-wide">
            Выберите тип поддержки
          </p>
        </motion.div>
        
        <div className="relative bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-2xl p-1 shadow-lg max-w-xl mx-auto">
          <div className="grid grid-cols-2 gap-1 relative">
            {/* Анимированный фон для ежемесячной */}
            {isSubscription && (
              <motion.div
                layoutId="activeToggleBg"
                className="absolute inset-0 bg-gradient-to-r from-[#f9bc60]/30 to-[#f9bc60]/10 rounded-xl"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  width: "calc(50% - 0.125rem)",
                  left: "0.125rem",
                }}
              />
            )}
            
            {/* Анимированный фон для разовой */}
            {!isSubscription && (
              <motion.div
                layoutId="activeToggleBg"
                className="absolute inset-0 bg-gradient-to-r from-[#e16162]/30 to-[#e16162]/10 rounded-xl"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  width: "calc(50% - 0.125rem)",
                  left: "calc(50% + 0.125rem)",
                }}
              />
            )}
            
            {/* Ежемесячная поддержка */}
            <motion.button
              onClick={() => onToggle(true)}
              className="relative z-10 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: isSubscription ? "#f9bc60" : "transparent",
                color: isSubscription ? "#001e1d" : "#abd1c6",
              }}
            >
              <motion.div
                animate={{
                  scale: isSubscription ? 1.08 : 1,
                }}
                transition={{ duration: 0.3, type: "spring" }}
                className="flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{
                    rotate: isSubscription ? [0, -8, 8, -8, 0] : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <LucideIcons.Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold leading-tight">Ежемесячная</span>
                  <span className="text-[10px] sm:text-xs opacity-70 font-normal">Стабильная</span>
                </div>
              </motion.div>
              
              {isSubscription && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#001e1d]/30 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
            
            {/* Разовая поддержка */}
            <motion.button
              onClick={() => onToggle(false)}
              className="relative z-10 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: !isSubscription ? "#e16162" : "transparent",
                color: !isSubscription ? "#fffffe" : "#abd1c6",
              }}
            >
              <motion.div
                animate={{
                  scale: !isSubscription ? 1.08 : 1,
                }}
                transition={{ duration: 0.3, type: "spring" }}
                className="flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{
                    rotate: !isSubscription ? [0, 8, -8, 8, 0] : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <LucideIcons.Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  {!isSubscription && (
                    <motion.div
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-[#fffffe] rounded-full blur-sm"
                    />
                  )}
                </motion.div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold leading-tight">Разовая</span>
                  <span className="text-[10px] sm:text-xs opacity-80 font-normal">Один раз</span>
                </div>
              </motion.div>
              
              {!isSubscription && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#fffffe]/30 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
















