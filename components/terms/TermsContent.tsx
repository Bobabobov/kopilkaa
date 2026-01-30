"use client";

import { motion } from "framer-motion";
import TermsSection from "./TermsSection";
import { TERMS_SECTIONS } from "./sectionsConfig";

export default function TermsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#abd1c6]/20"
    >
      <div className="relative z-10 max-w-none">
        {TERMS_SECTIONS.map(({ number, title, delay, Content }) => (
          <TermsSection
            key={number}
            number={number}
            title={title}
            delay={delay}
          >
            <Content />
          </TermsSection>
        ))}
      </div>
    </motion.div>
  );
}
