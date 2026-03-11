// app/admin/applications/[id]/_components/AdminSection.tsx
"use client";

import { motion } from "framer-motion";

interface AdminSectionProps {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Не оборачивать в карточку, только якорь и заголовок */
  plain?: boolean;
}

export default function AdminSection({
  id,
  number,
  title,
  subtitle,
  children,
  plain = false,
}: AdminSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32 min-w-0"
    >
      <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-4 min-w-0">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold"
          style={{
            background: "rgba(249, 188, 96, 0.2)",
            border: "1px solid rgba(249, 188, 96, 0.4)",
            color: "#f9bc60",
          }}
        >
          {number}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <h2
            className="text-base sm:text-lg lg:text-xl font-bold break-words leading-tight"
            style={{ color: "#fffffe" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm mt-0.5 break-words" style={{ color: "#94a1b2" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {plain ? (
        <div className="min-w-0">{children}</div>
      ) : (
        <div
          className="rounded-2xl border border-[#abd1c6]/30 bg-gradient-to-br from-[#004643]/90 via-[#004643]/80 to-[#001e1d]/90 p-3 sm:p-5 lg:p-6 min-w-0 overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
        >
          {children}
        </div>
      )}
    </motion.section>
  );
}
