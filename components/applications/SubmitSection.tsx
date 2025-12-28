"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { msToHuman } from "@/lib/time";

interface SubmitSectionProps {
  submitting: boolean;
  uploading: boolean;
  left: number | null;
  err: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmitSection({
  submitting,
  uploading,
  left,
  err,
  onSubmit,
}: SubmitSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={submitting || uploading}
        className="relative w-full px-8 py-4 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] hover:from-[#e8a545] hover:via-[#f9bc60] hover:to-[#e8a545] disabled:from-gray-400 disabled:to-gray-500 text-[#001e1d] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#f9bc60]/40 disabled:shadow-none disabled:cursor-not-allowed overflow-hidden group"
      >
        {/* Анимированный фон */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent block"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        ></motion.span>
        <span className="relative z-10 inline-flex items-center justify-center gap-3">
          {submitting ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Refresh size="sm" />
              </motion.span>
              <span>Отправка заявки...</span>
            </>
          ) : uploading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Upload size="sm" />
              </motion.span>
              <span>Загрузка фото...</span>
            </>
          ) : (
            <>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <LucideIcons.Send size="sm" />
              </motion.span>
              <span>Отправить заявку</span>
            </>
          )}
        </span>
      </motion.button>

      {left !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              left > 0
                ? "text-lime-700 dark:text-lime-300"
                : "text-green-700 dark:text-green-300"
            }`}
          >
            <LucideIcons.Clock size="sm" />
            <span>
              {left > 0
                ? `Лимит: 1 заявка в 24 часа (осталось ${msToHuman(left)})`
                : "Можете отправить заявку"}
            </span>
          </div>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 border-2 border-[#e16162]/50 rounded-xl bg-gradient-to-br from-[#e16162]/10 to-[#d14d4e]/5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 text-[#e16162]">
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <LucideIcons.Alert size="sm" />
            </motion.span>
            <span className="font-semibold">{err}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
