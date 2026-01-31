import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function SupportHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-6 sm:mb-8"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f9bc60]/10 border border-[#f9bc60]/30 mb-3">
        <LucideIcons.Trophy className="w-4 h-4 text-[#f9bc60]" />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#e16162" }}
        >
          Добровольная поддержка
        </span>
      </div>
      <h2
        className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3"
        style={{ color: "#fffffe" }}
      >
        Выберите сумму поддержки проекта
      </h2>
      <p
        className="text-sm sm:text-base max-w-xl mx-auto px-2 leading-relaxed"
        style={{ color: "#abd1c6" }}
      >
        Любая сумма — это вклад в развитие платформы и помощь тем, кому она
        действительно нужна.
      </p>
    </motion.div>
  );
}
