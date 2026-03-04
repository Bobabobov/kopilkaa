"use client";

import { motion } from "framer-motion";

interface AdRequestSubmitButtonProps {
  isSubmitting: boolean;
  isUploading: boolean;
}

export function AdRequestSubmitButton({
  isSubmitting,
  isUploading,
}: AdRequestSubmitButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="pt-4"
    >
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting || isUploading}
        className="relative w-full text-[#001e1d] py-6 text-xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group transition-all duration-300 hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
          boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#f9bc60] via-[#fff] to-[#f9bc60] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting || isUploading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-5 h-5 border-2 border-[#001e1d] border-t-transparent rounded-full"
              />
              {isUploading ? "Загружаем изображения..." : "Отправляем..."}
            </>
          ) : (
            <>
              Отправить заявку
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </span>
      </motion.button>
    </motion.div>
  );
}
