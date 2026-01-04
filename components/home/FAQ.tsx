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
    question: "Что это за проект? Есть ли гарантии?",
    answer:
      "Копилка — это независимая онлайн-платформа, которая самостоятельно принимает решения о финансовой поддержке пользователей.\n\nГарантий получения помощи нет.\nКаждая история рассматривается индивидуально, и решение принимается по усмотрению платформы.\n\nПлатформа не обязана одобрять заявки и не несёт обязательств по их удовлетворению.\nФинансовая поддержка, если она предоставляется, является безвозмездной.",
    icon: "HelpCircle",
  },
  {
    question: "Какие истории можно рассказывать?",
    answer: "Вы можете описать любую реальную жизненную ситуацию, в которой вам сейчас нужна финансовая поддержка. Это могут быть бытовые трудности, неожиданные расходы или временные сложности. Мы не оцениваем «важность» или «масштаб» проблемы — для нас важны честность и понятное объяснение ситуации. Каждая история рассматривается индивидуально, а решение принимается платформой.",
    icon: "FileText",
  },
  {
    question: "Как долго ждать решение?",
    answer: "Сроки рассмотрения не фиксированы. Каждая история попадает в общую очередь и рассматривается индивидуально. Время ожидания может отличаться и зависит от текущей нагрузки и возможностей платформы.",
    icon: "Clock",
  },
  {
    question: "Как работают стримы с решениями?",
    answer: "Стримы используются как формат открытого обсуждения. Зрители могут высказывать своё мнение, но решение всегда остаётся за платформой.",
    icon: "User",
  },
  {
    question: "Зачем нужны игры и рейтинги?",
    answer: "Игры и рейтинги планируются как вспомогательный элемент платформы. Они не являются основным способом получения помощи и не гарантируют финансовую поддержку. Раздел находится в разработке и будет запускаться постепенно.",
    icon: "CheckCircle",
  },
  {
    question: "Что такое донаты в копилку?",
    answer: "Донаты — это добровольная поддержка самой платформы «Копилка». Средства используются для работы и развития проекта, а также для формирования бюджета, из которого платформа самостоятельно оказывает финансовую поддержку пользователям. Донаты не являются пожертвованием конкретным людям и не дают гарантий одобрения каких-либо историй. Информация о поддержке может отображаться в профиле в виде благодарности и достижений, но не влияет на принимаемые решения.",
    icon: "DollarSign",
  },
  {
    question: "Где лежат деньги из копилки и кто платит комиссию?",
    answer:
      "Средства обрабатываются платёжными системами. Комиссии оплачиваются платформой. Баланс на сайте отражает текущий бюджет проекта, используемый для оказания финансовой поддержки.",
    icon: "Coin",
  },
  {
    question: "Можно ли подавать истории повторно?",
    answer: "Вы можете подавать новые истории при необходимости. Каждая из них рассматривается индивидуально. Решения принимаются по содержанию конкретной истории, а не по их количеству.",
    icon: "Shield",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4" id="faq">
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
            Как работает платформа и на каких условиях
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
                  className="w-full text-left bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
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
                            <div className="mt-4 text-base leading-relaxed space-y-3" style={{ color: "#abd1c6" }}>
                              {faq.answer.split("\n\n").map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>
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
            Готовы рассказать свою историю?
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