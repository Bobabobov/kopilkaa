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
import { FAQ_ITEMS } from "@/lib/content/faq";

const FAQ_ICONS = {
  HelpCircle,
  FileText,
  Clock,
  User,
  CheckCircle,
  DollarSign,
  Coins,
  Shield,
} as const;

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
          {FAQ_ITEMS.map((faq, index) => {
            const IconComponent = FAQ_ICONS[faq.icon];
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
                    background:
                      "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
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
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl transition-all duration-300 md:hover:scale-[1.02] md:hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
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
