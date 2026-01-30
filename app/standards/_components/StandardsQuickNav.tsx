"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#formats", label: "Форматы" },
  { href: "#sizes", label: "Размеры" },
  { href: "#actions", label: "Оставить заявку" },
];

export function StandardsQuickNav() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10 sm:mb-12"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="px-3 sm:px-4 py-2 rounded-full border border-[#abd1c6]/20 bg-[#001e1d]/45 backdrop-blur-md text-xs sm:text-sm font-semibold text-[#abd1c6] hover:text-[#fffffe] hover:border-[#f9bc60]/40 hover:bg-[#001e1d]/60 transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
