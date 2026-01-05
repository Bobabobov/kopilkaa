"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function ApplicationsTips() {
  const tips = [
    { icon: LucideIcons.Target, text: "Будьте конкретными в описании ситуации", color: "#10B981" },
    { icon: LucideIcons.Image, text: "Приложите фотографии для подтверждения", color: "#3B82F6" },
    { icon: LucideIcons.DollarSign, text: "Укажите точную сумму, которая нужна", color: "#F59E0B" },
    { icon: LucideIcons.FileText, text: "Опишите, как планируете использовать средства", color: "#8B5CF6" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="lg:sticky lg:top-8 space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative overflow-hidden backdrop-blur-sm rounded-2xl p-6 border border-[#abd1c6]/30 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 shadow-xl"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f9bc60]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#e16162]/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <motion.h3
            className="flex items-center gap-3 text-xl font-bold mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center shadow-lg shadow-[#f9bc60]/30"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <LucideIcons.Lightbulb className="text-[#001e1d]" size="sm" />
            </motion.div>
            <span className="bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent">
              Советы
            </span>
          </motion.h3>

          <div className="space-y-4">
            {tips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#001e1d]/30 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all hover:shadow-lg hover:shadow-[#f9bc60]/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ backgroundColor: `${tip.color}20`, color: tip.color }}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <IconComponent size="xs" />
                  </motion.div>
                  <span className="text-sm text-[#abd1c6] font-medium pt-1">
                    {tip.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ApplicationsTips;

