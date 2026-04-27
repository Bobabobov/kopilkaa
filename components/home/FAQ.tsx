"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  FileText,
  Clock,
  User,
  CheckCircle,
  DollarSign,
  Coins,
  Shield,
  ChevronDown,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
const FAQ_ICONS = {
  HelpCircle,
  FileText,
  Clock,
  User,
  CheckCircle,
  DollarSign,
  Coin: Coins,
  Coins,
  Shield,
} as const;

interface FAQItem {
  question: string;
  answer: string;
  icon: keyof typeof FAQ_ICONS;
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
    answer:
      "Вы можете описать любую реальную жизненную ситуацию, в которой вам сейчас нужна финансовая поддержка. Это могут быть бытовые трудности, неожиданные расходы или временные сложности. Мы не оцениваем «важность» или «масштаб» проблемы — для нас важны честность и понятное объяснение ситуации. Каждая история рассматривается индивидуально, а решение принимается платформой.",
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
      "Стримы используются как формат открытого обсуждения. Зрители могут высказывать своё мнение, но решение всегда остаётся за платформой.",
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
      "Донаты — это добровольная поддержка самой платформы «Копилка». Средства используются для работы и развития проекта, а также для формирования бюджета, из которого платформа самостоятельно оказывает финансовую поддержку пользователям. Донаты не являются пожертвованием конкретным людям и не дают гарантий одобрения каких-либо историй. Информация о поддержке может отображаться в профиле в виде благодарности и достижений, но не влияет на принимаемые решения.",
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
    answer:
      "Вы можете подавать новые истории при необходимости. Каждая из них рассматривается индивидуально. Решения принимаются по содержанию конкретной истории, а не по их количеству.",
    icon: "Shield",
  },
  {
    question: "Что такое «Добрые дела» и как это работает?",
    answer:
      "Это отдельный раздел с еженедельными заданиями. Вы выбираете уровень сложности, выполняете задания в реальной жизни и отправляете отчёт с фото или видео.\n\nПосле проверки модератором за подтверждённые задания начисляются бонусы.",
    icon: "CheckCircle",
  },
  {
    question: "Можно ли менять уровень сложности в «Добрых делах»?",
    answer:
      "Да, если у вас ещё нет подтверждённых добрых дел.\n\nПосле первого подтверждения уровень фиксируется, и дальше доступна только работа в выбранной сложности.",
    icon: "Shield",
  },
  {
    question: "Как начисляются бонусы в «Добрых делах»?",
    answer:
      "Бонусы начисляются только за подтверждённые отчёты.\n\nЕсли закрыть все 3 задания своей линейки за неделю, сверху добавляется бонус за 3/3.",
    icon: "Coins",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
          >
            <MessageCircle className="w-4 h-4" />
            Ответы на вопросы
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "#fffffe" }}
          >
            Частые вопросы
          </h2>
          <p className="text-lg md:text-xl" style={{ color: "#abd1c6" }}>
            Как работает платформа и на каких условиях
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const IconComponent = FAQ_ICONS[faq.icon as keyof typeof FAQ_ICONS];
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg group"
                  style={{
                    background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow: isOpen
                      ? "0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(249,188,96,0.2)"
                      : "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                      style={{
                        background: "rgba(249, 188, 96, 0.15)",
                        color: "#f9bc60",
                      }}
                    >
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <HelpCircle className="w-5 h-5" />
                      )}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className="text-base sm:text-lg font-bold leading-snug pt-0.5"
                          style={{ color: "#fffffe" }}
                        >
                          {faq.question}
                        </h3>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex-shrink-0 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.span>
                      </div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mt-4 pt-4 border-t border-white/10 text-sm sm:text-base leading-relaxed space-y-3"
                              style={{ color: "#abd1c6" }}
                            >
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-lg mb-4" style={{ color: "#abd1c6" }}>
            Готовы рассказать свою историю?
          </p>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 8px 32px rgba(249, 188, 96, 0.25)",
            }}
          >
            Рассказать историю
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
