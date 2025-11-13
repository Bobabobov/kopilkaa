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
    question: "Что за эксперимент? Какие гарантии?",
    answer: "Копилка — это социальный эксперимент без правил и гарантий. Никто никого не обязан поддерживать. Решения принимаются лично владельцем платформы или зрителями на стримах. Может быть да, может быть нет — в этом и суть.",
    icon: "HelpCircle",
  },
  {
    question: "Какие истории можно рассказывать?",
    answer: "Абсолютно любые житейские ситуации! Нужны деньги на пиво, не хватает на проезд, хочется пиццу, сломался телефон — рассказывайте что угодно. Главное честно и от души. Никаких требований к 'серьезности' проблемы.",
    icon: "FileText",
  },
  {
    question: "Как долго ждать решение?",
    answer: "Нет никаких сроков. Ваша история попадает в общую очередь. Решение может прийти через день, неделю или месяц — зависит от настроения, обстоятельств и потока заявок. Терпение — часть эксперимента.",
    icon: "Clock",
  },
  {
    question: "Как работают стримы с решениями?",
    answer: "Периодически проводятся стримы, где зрители голосуют за истории. Это интерактивная часть проекта — сообщество решает коллективно. Анонсы стримов публикуются в новостях платформы.",
    icon: "User",
  },
  {
    question: "Зачем нужны игры и рейтинги?",
    answer: "Игры — дополнительный способ получить деньги. Держитесь в топе недельного рейтинга — получите приз. Также есть система достижений и топ донатеров. Всё для разнообразия и геймификации процесса.",
    icon: "CheckCircle",
  },
  {
    question: "Что такое донаты в копилку?",
    answer: "Любой желающий может пополнить общую копилку платформы. Эти деньги идут на поддержку авторов историй. Донатеры попадают в рейтинг благотворителей — статусная штука для тех, кто хочет помочь проекту.",
    icon: "DollarSign",
  },
  {
    question: "Можно ли подавать истории повторно?",
    answer: "Да, можно рассказывать новые истории когда угодно. Каждая рассматривается отдельно. Но помните — чем больше историй, тем меньше шансов на каждую. Качество важнее количества.",
    icon: "Shield",
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
            Частые вопросы
          </h2>
          <p className="text-xl" style={{ color: "#abd1c6" }}>
            Честные ответы про эксперимент без обещаний
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
                          <LucideIcons.ChevronDown size="md" className="text-[#abd1c6]" />
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
            Готовы попробовать свою удачу?
          </p>
          <a
            href="/applications"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300 hover:scale-105"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            <LucideIcons.FileText size="sm" />
            Рассказать историю
          </a>
        </motion.div>
      </div>
    </section>
  );
}