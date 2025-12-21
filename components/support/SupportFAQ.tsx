"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useState } from "react";

const faqItems = [
  {
    question: "Куда идут мои деньги?",
    answer: "Все деньги поступают в общую копилку проекта. Из этой копилки поддерживаются авторы историй, чьи заявки были одобрены. Мы полностью прозрачны — каждый рубль идёт на помощь реальным людям.",
    icon: "CreditCard",
    color: "#f9bc60",
  },
  {
    question: "Как работает поддержка историй?",
    answer: "Когда человек подаёт заявку и она одобряется, ему выплачивается помощь из копилки. Размер поддержки зависит от суммы в копилке и количества одобренных заявок.",
    icon: "Heart",
    color: "#e16162",
  },
  {
    question: "Как работает ежемесячная поддержка?",
    answer: "В данный момент поддержка работает в тестовом режиме. Каждое пожертвование является разовым — автоматических списаний нет. В будущем будет добавлена возможность настройки автоматических подписок с возможностью их управления.",
    icon: "Settings",
    color: "#abd1c6",
  },
  {
    question: "Как стать героем проекта?",
    answer: "Любой, кто поддержал проект, автоматически попадает на страницу Героев проекта. Чем больше сумма поддержки, тем выше вы будете в рейтинге. Привяжите соцсети, чтобы их видели все пользователи!",
    icon: "Trophy",
    color: "#f9bc60",
  },
  {
    question: "Безопасно ли платить?",
    answer: "Да, все платежи проходят через защищённые платёжные системы. Мы не храним данные ваших банковских карт. Процесс оплаты максимально безопасен и защищён.",
    icon: "Shield",
    color: "#abd1c6",
  },
  {
    question: "Есть ли минимальная сумма?",
    answer: "Нет строгого минимума, но рекомендуем от 100₽ для разовой поддержки и от 300₽/мес для ежемесячной. Любая сумма важна и помогает проекту развиваться.",
    icon: "Coin",
    color: "#e16162",
  },
];

export default function SupportFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 sm:py-10 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4" style={{ color: "#fffffe" }}>
            ❓ Частые вопросы
          </h3>
          <p className="text-sm sm:text-base max-w-xl mx-auto px-2" style={{ color: "#abd1c6" }}>
            Всё, что нужно знать о поддержке проекта
          </p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => {
            const IconName = item.icon as keyof typeof LucideIcons;
            const Icon = LucideIcons[IconName] || LucideIcons.HelpCircle;
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-xl overflow-hidden hover:border-[#abd1c6]/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-between gap-4 text-left hover:bg-[#004643]/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${item.color}20`,
                        border: `2px solid ${item.color}`,
                      }}
                    >
                      <span style={{ color: item.color }}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </span>
                    </div>
                    <h4
                      className="text-base sm:text-lg font-semibold flex-1"
                      style={{ color: "#fffffe" }}
                    >
                      {item.question}
                    </h4>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <LucideIcons.ChevronDown
                      className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 text-[#abd1c6]"
                    />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-18 sm:pl-20">
                    <p className="text-sm sm:text-base leading-relaxed opacity-90" style={{ color: "#abd1c6" }}>
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
