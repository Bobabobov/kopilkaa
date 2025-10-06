"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { msToHuman } from "@/lib/time";

interface SubmitSectionProps {
  submitting: boolean;
  uploading: boolean;
  left: number | null;
  msg: string | null;
  err: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmitSection({
  submitting,
  uploading,
  left,
  msg,
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={submitting || uploading}
        className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-3">
          {submitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Refresh size="sm" />
              </motion.div>
              <span>Отправка заявки...</span>
            </>
          ) : uploading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LucideIcons.Upload size="sm" />
              </motion.div>
              <span>Загрузка фото...</span>
            </>
          ) : (
            <>
              <LucideIcons.Send size="sm" />
              <span>Отправить заявку</span>
            </>
          )}
        </div>
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

      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-green-200 dark:border-green-800 rounded-xl"
        >
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <LucideIcons.CheckCircle size="sm" />
            <span className="font-medium">{msg}</span>
          </div>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-red-200 dark:border-red-800 rounded-xl"
        >
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <LucideIcons.Alert size="sm" />
            <span className="font-medium">{err}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
