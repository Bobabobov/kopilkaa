"use client";

import Link from "next/link";
import {
  HelpCircle,
  FileText,
  Clock,
  User,
  CheckCircle,
  DollarSign,
  Coins,
  Shield,
  MessageCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/content/faq";

const FAQ_ICONS: Record<string, LucideIcon> = {
  HelpCircle,
  FileText,
  Clock,
  User,
  CheckCircle,
  DollarSign,
  Coins,
  Shield,
};

export default function FAQ() {
  return (
    <section className="py-20 px-4" id="faq" data-kopi-tour="welcome-faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
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
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const IconComponent = FAQ_ICONS[faq.icon] ?? HelpCircle;

            return (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="rounded-2xl border-0 px-5 sm:px-6"
                style={{
                  background:
                    "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <AccordionTrigger className="py-5 hover:no-underline [&>svg]:text-[#abd1c6]">
                  <span className="flex items-start gap-4 text-left">
                    <span
                      className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(249, 188, 96, 0.15)",
                        color: "#f9bc60",
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </span>
                    <span
                      className="text-base sm:text-lg font-bold leading-snug pt-2"
                      style={{ color: "#fffffe" }}
                    >
                      {faq.question}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-[3.75rem] text-sm sm:text-base leading-relaxed space-y-3 text-[#abd1c6]">
                  {faq.answer.split("\n\n").map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="text-center mt-12">
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
            Написать историю
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
