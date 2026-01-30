"use client";

import { motion } from "framer-motion";

interface AdRequestFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AdRequestField({
  label,
  required,
  error,
  children,
  delay = 0,
  className = "",
}: AdRequestFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`pb-6 border-b border-[#abd1c6]/10 ${className}`}
    >
      <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-3 flex items-center gap-2"
        >
          <span>⚠</span> {error}
        </motion.p>
      )}
    </motion.div>
  );
}
