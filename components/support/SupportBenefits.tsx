"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

const benefits = [
  {
    icon: "Users",
    title: "Помогаешь людям",
    description: "Твои деньги напрямую идут на поддержку авторов историй",
    color: "#f9bc60",
  },
  {
    icon: "Zap",
    title: "Пополняешь копилку",
    description: "Увеличиваешь общий фонд, из которого поддерживают авторов историй",
    color: "#abd1c6",
  },
  {
    icon: "Heart",
    title: "Честная благодарность",
    description: "Получаешь искреннее спасибо и упоминание среди поддержавших",
    color: "#e16162",
  },
];

export default function SupportBenefits() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-6" style={{ color: "#fffffe" }}>
            🤝 Зачем поддерживать?
          </h3>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: "#abd1c6" }}>
            Простые и честные причины помочь проекту без лишних обещаний.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = LucideIcons[benefit.icon as keyof typeof LucideIcons];
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-[#004643]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8 text-center hover:border-[#f9bc60]/60 transition-all duration-500"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-6 mx-auto flex items-center justify-center w-20 h-20 rounded-full"
                  style={{ backgroundColor: `${benefit.color}20`, border: `2px solid ${benefit.color}` }}
                >
                  <Icon className="w-10 h-10" style={{ color: benefit.color }} />
                </motion.div>
                
                <h4 className="text-xl font-bold mb-4" style={{ color: "#fffffe" }}>
                  {benefit.title}
                </h4>
                
                <p style={{ color: "#abd1c6" }}>
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8"
        >
          <p className="text-lg mb-6" style={{ color: "#abd1c6" }}>
            Не готов поддержать? Это абсолютно нормально! 
            <br />
            Просто продолжай читать истории и участвовать в жизни проекта.
          </p>
          
          <Link
            href="/stories"
            className="inline-flex items-center text-lg font-semibold hover:scale-105 transition-transform duration-300"
            style={{ color: "#f9bc60" }}
          >
            <LucideIcons.ArrowLeft className="w-5 h-5 mr-2" />
            Вернуться к историям
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
