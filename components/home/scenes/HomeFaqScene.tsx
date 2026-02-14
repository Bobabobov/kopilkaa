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
      "Копилка - это независимая онлайн-платформа, которая самостоятельно принимает решения о финансовой поддержке пользователей.\n\nГарантий получения помощи нет.\nКаждая история рассматривается индивидуально, и решение принимается по усмотрению платформы.\n\nПлатформа не обязана одобрять заявки и не несёт обязательств по их удовлетворению.\nФинансовая поддержка, если она предоставляется, является безвозмездной.",
    icon: "HelpCircle",
  },
  {
    question: "Какие истории можно рассказывать?",
    answer:
      "Вы можете описать любую реальную жизненную ситуацию, в которой вам сейчас нужна финансовая поддержка. Это могут быть бытовые трудности, неожиданные расходы или временные сложности. Мы не оцениваем «важность» или «масштаб» проблемы - для нас важны честность и понятное объяснение ситуации. Каждая история рассматривается индивидуально, а решение принимается платформой.",
    icon: "FileText",
  },
  {
    question: "Как долго ждать решение?",
    answer:
      "Сроки рассмотрения не фиксированы. Каждая история попадает в общую очередь и рассматривается индивидуально. Время ожидания может отличаться и зависит от текущей нагрузки и возможностей платформы.",
    icon: "Clock",
  },
  {
    question: "Как работают стримы с решениями?",
    answer:
      "Стримы используются как формат открытого обсуждения. Зрители могут высказывать своё мнение, но решение всегда остаётся за платформой.(пока стримов нет) ",
    icon: "User",
  },
  {
    question: "Зачем нужны игры и рейтинги?",
    answer:
      "Игры и рейтинги планируются как вспомогательный элемент платформы. Они не являются основным способом получения помощи и не гарантируют финансовую поддержку. Раздел находится в разработке и будет запускаться постепенно.",
    icon: "CheckCircle",
  },
  {
    question: "Что такое донаты в копилку?",
    answer:
      "Донаты - это добровольная поддержка самой платформы «Копилка». Средства используются для работы и развития проекта, а также для формирования бюджета, из которого платформа самостоятельно оказывает финансовую поддержку пользователям. Донаты не являются пожертвованием конкретным людям и не дают гарантий одобрения каких-либо историй. Информация о поддержке может отображаться в профиле в виде благодарности и достижений, но не влияет на принимаемые решения.",
    icon: "DollarSign",
  },
  {
    question: "Где лежат деньги копилки?",
    answer: "На сайте деньги не храняться.",
    icon: "Coin",
  },
  {
    question: "Можно ли подавать истории повторно?",
    answer:
      "Вы можете подавать новые истории при необходимости. Каждая из них рассматривается индивидуально. Решения принимаются по содержанию конкретной истории, а не по их количеству.",
    icon: "Shield",
  },
];

export default function HomeFaqScene() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 px-4 sm:py-20 md:py-24" id="faq">
      <div className="pointer-events-none absolute left-10 top-12 h-44 w-44 rounded-full bg-[#abd1c6]/10 blur-[100px]" />
      <div className="w-full lg:pl-10 xl:pl-16">
        <div className="max-w-2xl text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
            Частые вопросы
          </h2>
          <p className="mt-3 text-lg text-[#abd1c6]">
            Как работает платформа и на каких условиях
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:pr-16">
          {faqs.map((faq, index) => {
            const Icon = LucideIcons[faq.icon];
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#f9bc60]/40 hover:shadow-lg hover:shadow-[#f9bc60]/5 ${
                  index % 2 === 0 ? "lg:translate-y-4" : "lg:-translate-y-2"
                } ${isOpen ? "border-[#f9bc60]/50" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start gap-4 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9bc60]/15 text-[#f9bc60]">
                    {Icon && <Icon size="sm" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-[#fffffe]">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LucideIcons.ChevronDown
                          size="sm"
                          className="text-[#abd1c6]"
                        />
                      </motion.div>
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 text-sm leading-relaxed text-[#abd1c6] space-y-3">
                        {faq.answer.split("\n\n").map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-start lg:ml-auto lg:max-w-xs">
          <a
            href="#actions"
            className="inline-flex items-center text-sm text-[#abd1c6] transition-colors hover:text-[#f9bc60]"
          >
            Перейти к действиям →
          </a>
        </div>
      </div>
    </section>
  );
}
