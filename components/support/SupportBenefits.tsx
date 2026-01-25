"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

const benefits = [
  {
    icon: "Trophy",
    title: "Проект без инвесторов и рекламы",
    description:
      "«Копилка» развивается за счёт поддержки сообщества — без инвесторов и навязчивой рекламы.",
    color: "#f9bc60",
  },
  {
    icon: "Share",
    title: "Поддержка помогает реальным людям",
    description:
      "Проект самостоятельно распределяет средства между одобренными заявками и поддерживает работу платформы.",
    color: "#abd1c6",
  },
  {
    icon: "BarChart3",
    title: "Прозрачность и публичность",
    description:
      "Истории и активность проекта видны публично — это помогает сообществу доверять платформе.",
    color: "#e16162",
  },
  {
    icon: "Infinity",
    title: "Поддержка — это участие, а не покупка",
    description:
      "Никаких обещаний выгоды. Это добровольный вклад в развитие проекта и помощь тем, кому она нужна.",
    color: "#f9bc60",
  },
];

export default function SupportBenefits() {
  return (
    <section className="py-8 sm:py-10 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4"
            style={{ color: "#fffffe" }}
          >
            ✨ Почему люди поддерживают «Копилку»
          </h3>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto px-2"
            style={{ color: "#abd1c6" }}
          >
            Коротко о том, почему поддержка важна для проекта и сообщества.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {benefits.map((benefit, index) => {
            const Icon = LucideIcons[benefit.icon as keyof typeof LucideIcons];
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center hover:border-[#abd1c6]/30 transition-all duration-300"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-4 sm:mb-5 mx-auto flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                  style={{
                    backgroundColor: `${benefit.color}20`,
                    border: `2px solid ${benefit.color}`,
                    color: benefit.color,
                  }}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-current" />
                </motion.div>

                <h4
                  className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                  style={{ color: "#fffffe" }}
                >
                  {benefit.title}
                </h4>

                <p
                  className="text-sm sm:text-base"
                  style={{ color: "#abd1c6" }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA на героев */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-br from-[#004643]/40 via-[#004643]/30 to-[#001e1d]/40 backdrop-blur-sm border-2 border-[#f9bc60]/40 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-4 sm:mb-5 mx-auto flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full"
            style={{
              backgroundColor: "#f9bc6020",
              border: "2px solid #f9bc60",
            }}
          >
            <LucideIcons.Trophy className="w-8 h-8 sm:w-9 sm:h-9 text-[#f9bc60]" />
          </motion.div>

          <h4
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4"
            style={{ color: "#fffffe" }}
          >
            Посмотрите «Героев проекта»
          </h4>

          <p
            className="text-base sm:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2"
            style={{ color: "#abd1c6" }}
          >
            Это публичная витрина благодарности пользователям, которые
            поддержали развитие платформы. Откройте страницу{" "}
            <Link
              href="/heroes"
              className="font-semibold hover:underline transition-all"
              style={{ color: "#f9bc60" }}
            >
              «Герои проекта»
            </Link>{" "}
            и посмотрите список участников, бейджи и активность сообщества.
          </p>

          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-full hover:bg-[#e8a545] transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            <LucideIcons.Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Перейти в «Герои»</span>
            <span className="xs:hidden">«Герои»</span>
            <LucideIcons.ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8"
        >
          <p
            className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 px-2"
            style={{ color: "#abd1c6" }}
          >
            Хотите добавить соцсети и оформить профиль? Они могут отображаться
            рядом с вами в «Героях проекта».
          </p>

          <Link
            href="/profile?settings=socials"
            className="inline-flex items-center text-sm sm:text-base md:text-lg font-semibold hover:scale-105 transition-transform duration-300"
            style={{ color: "#f9bc60" }}
          >
            <LucideIcons.User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Перейти к настройкам профиля
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
