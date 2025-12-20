"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFoundActions() {
  const mainLinks = [
    {
      href: "/",
      label: "На главную",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      primary: true,
    },
    {
      href: "/stories",
      label: "К историям",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      primary: false,
    },
  ];

  const quickLinks = [
    { href: "/heroes", label: "Герои проекта" },
    { href: "/support", label: "Поддержать" },
    { href: "/advertising", label: "Реклама" },
    { href: "/standards", label: "Стандарты" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Главные кнопки */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 md:mb-16">
        {mainLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl text-base sm:text-lg md:text-xl font-black overflow-hidden ${
              link.primary
                ? "bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d]"
                : "bg-[#001e1d]/60 hover:bg-[#001e1d]/80 text-[#abd1c6] hover:text-[#fffffe] border-2 border-[#abd1c6]/30 hover:border-[#f9bc60]/50 backdrop-blur-sm"
            }`}
          >
            {link.primary && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
            <span className={`relative z-10 ${link.primary ? "" : "group-hover:translate-x-1 transition-transform"}`}>
              {link.icon}
            </span>
            <span className="relative z-10">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Быстрые ссылки */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center"
      >
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
            className="flex items-center"
          >
            <Link
              href={link.href}
              className="text-sm sm:text-base md:text-lg text-[#abd1c6] hover:text-[#f9bc60] transition-all duration-300 font-bold underline decoration-[#abd1c6]/30 hover:decoration-[#f9bc60]/50 underline-offset-4 hover:underline-offset-8"
            >
              {link.label}
            </Link>
            {index < quickLinks.length - 1 && (
              <span className="mx-2 sm:mx-4 text-[#abd1c6]/50 text-lg">•</span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}


