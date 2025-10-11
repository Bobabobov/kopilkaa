"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface FAQItem {
  question: string;
  answer: string;
  icon: keyof typeof LucideIcons;
}

const faqs: FAQItem[] = [
  {
    question: "Как создать заявку на помощь?",
    answer: "Зарегистрируйтесь на платформе, перейдите в раздел 'Создать заявку', заполните все необходимые поля: опишите вашу ситуацию, укажите нужную сумму и приложите подтверждающие документы/фото. После модерации ваша заявка будет опубликована.",
    icon: "FileText",
  },
  {
    question: "Сколько времени занимает модерация?",
    answer: "Обычно модерация заявки занимает до 24 часов. Мы тщательно проверяем каждую заявку, чтобы убедиться в её достоверности и защитить наше сообщество от мошенничества.",
    icon: "Clock",
  },
  {
    question: "Безопасно ли указывать свои реквизиты?",
    answer: "Да, ваши данные защищены. Мы используем современные технологии шифрования. Однако рекомендуем указывать только необходимую информацию для получения помощи и не делиться конфиденциальными данными.",
    icon: "Shield",
  },
  {
    question: "Могу ли я помочь анонимно?",
    answer: "Да, вы можете оказывать помощь анонимно. При переводе средств вы сами решаете, раскрывать ли свою личность. Система защищает конфиденциальность всех участников.",
    icon: "User",
  },
  {
    question: "Что делать, если моя заявка отклонена?",
    answer: "Если ваша заявка отклонена, вы получите уведомление с указанием причины. Вы можете исправить недочёты и подать заявку повторно через 24 часа. Обратитесь в поддержку, если у вас остались вопросы.",
    icon: "HelpCircle",
  },
  {
    question: "Берёте ли вы комиссию?",
    answer: "Нет, наша платформа полностью бесплатна. Мы не берём комиссию с переводов. 100% средств идут напрямую тем, кто нуждается в помощи.",
    icon: "DollarSign",
  },
  {
    question: "Как я могу быть уверен, что помогаю реальным людям?",
    answer: "Каждая заявка проходит тщательную модерацию. Мы проверяем документы, фотографии и достоверность информации. Также вы можете видеть историю пользователя на платформе.",
    icon: "CheckCircle",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fffffe" }}>
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl" style={{ color: "#abd1c6" }}>
            Ответы на популярные вопросы о работе платформы
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = LucideIcons[faq.icon];
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Иконка */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#f9bc6020" }}
                    >
                      {Icon && (
                        <div style={{ color: "#f9bc60" }}>
                          <Icon size="md" />
                        </div>
                      )}
                    </div>

                    {/* Контент */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg md:text-xl font-bold" style={{ color: "#fffffe" }}>
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <LucideIcons.ChevronDown size="md" style={{ color: "#abd1c6" }} />
                        </motion.div>
                      </div>

                      {/* Ответ */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 text-base leading-relaxed" style={{ color: "#abd1c6" }}>
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg mb-4" style={{ color: "#abd1c6" }}>
            Не нашли ответ на свой вопрос?
          </p>
          <a
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300 hover:scale-105"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            <LucideIcons.MessageCircle size="sm" />
            Связаться с поддержкой
          </a>
        </motion.div>
      </div>
    </section>
  );
}