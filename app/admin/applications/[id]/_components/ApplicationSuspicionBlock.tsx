"use client";

import { motion } from "framer-motion";
import { checkApplicationSuspicion } from "@/lib/applications/suspicionCheck";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ApplicationSuspicionBlockProps {
  story: string;
  filledMs?: number | null;
}

export default function ApplicationSuspicionBlock({
  story,
  filledMs,
}: ApplicationSuspicionBlockProps) {
  const suspicion = checkApplicationSuspicion(story, filledMs);

  if (!suspicion.hasSuspicion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-6"
      >
        <div
          className="rounded-xl sm:rounded-2xl p-4 sm:p-5 border inline-flex items-center gap-2"
          style={{
            backgroundColor: "rgba(171, 209, 198, 0.12)",
            borderColor: "rgba(171, 209, 198, 0.35)",
          }}
        >
          <LucideIcons.CheckCircle size="sm" className="text-[#abd1c6]" />
          <span className="text-sm font-medium" style={{ color: "#abd1c6" }}>
            Всё хорошо, заявка чистая
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-6"
    >
      <div
        className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border"
        style={{
          backgroundColor: suspicion.fastFillHigh
            ? "rgba(225, 97, 98, 0.12)"
            : "rgba(249, 188, 96, 0.12)",
          borderColor: suspicion.fastFillHigh
            ? "rgba(225, 97, 98, 0.4)"
            : "rgba(249, 188, 96, 0.4)",
        }}
      >
        <h4
          className="flex items-center gap-2 font-semibold mb-3"
          style={{
            color: suspicion.fastFillHigh ? "#e16162" : "#f9bc60",
          }}
        >
          <LucideIcons.AlertTriangle size="sm" />
          Возможная вставка / AI-текст
        </h4>
        <ul className="space-y-2 text-sm">
          {suspicion.fastFillDetails && (
            <li style={{ color: "#d7e9e0" }}>
              <strong>Скорость заполнения:</strong>{" "}
              {suspicion.fastFillDetails.chars} симв. за{" "}
              {Math.round(suspicion.fastFillDetails.seconds)} сек (
              {suspicion.fastFillDetails.charsPerSec.toFixed(1)} сим/сек).
              {suspicion.fastFillHigh ? (
                <span className="block mt-1 text-[#e16162]">
                  Очень быстро — вероятна вставка (ручной ввод ~3–5 сим/сек).
                </span>
              ) : suspicion.fastFill ? (
                <span className="block mt-1 text-[#f9bc60]">
                  Быстрее обычного — возможно вставка или очень быстрый набор.
                </span>
              ) : null}
            </li>
          )}
          {suspicion.aiPhrasesFound.length >= 2 && (
            <li style={{ color: "#d7e9e0" }}>
              <strong>Типичные AI-фразы:</strong>{" "}
              {suspicion.aiPhrasesFound.join(", ")}
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
