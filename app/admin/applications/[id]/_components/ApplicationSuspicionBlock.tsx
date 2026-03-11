"use client";

import { motion } from "framer-motion";
import { checkApplicationSuspicion } from "@/lib/applications/suspicionCheck";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ApplicationSuspicionBlockProps {
  story: string;
  filledMs?: number | null;
  storyEditMs?: number | null;
}

export default function ApplicationSuspicionBlock({
  story,
  filledMs,
  storyEditMs,
}: ApplicationSuspicionBlockProps) {
  const suspicion = checkApplicationSuspicion(story, filledMs, storyEditMs);
  const riskLabel = !suspicion.hasSuspicion
    ? "Риск: низкий"
    : suspicion.fastFillHigh
      ? "Риск: высокий"
      : "Риск: нужно внимание";
  const wasEdited =
    typeof storyEditMs === "number" &&
    typeof filledMs === "number" &&
    Number.isFinite(storyEditMs) &&
    Number.isFinite(filledMs) &&
    storyEditMs > filledMs + 1000;

  if (!suspicion.hasSuspicion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-6 min-w-0"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#abd1c6]/40 bg-[#004643]/40 px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <LucideIcons.CheckCircle size="sm" className="text-[#abd1c6]" />
          <span className="text-sm font-medium" style={{ color: "#d7e9e0" }}>
            Всё хорошо, подозрительных признаков нет
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
        className="rounded-2xl border min-w-0 overflow-hidden p-4 sm:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.4)]"
        style={{
          background:
            suspicion.fastFillHigh
              ? "linear-gradient(135deg, rgba(225,97,98,0.18), rgba(0,30,29,0.9))"
              : "linear-gradient(135deg, rgba(249,188,96,0.18), rgba(0,30,29,0.9))",
          borderColor: suspicion.fastFillHigh
            ? "rgba(225, 97, 98, 0.7)"
            : "rgba(249, 188, 96, 0.7)",
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <h4
            className="flex items-center gap-2 font-semibold"
            style={{
              color: suspicion.fastFillHigh ? "#e16162" : "#f9bc60",
            }}
          >
            <LucideIcons.AlertTriangle size="sm" />
            Возможная вставка / AI‑текст
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 font-semibold text-[#fefce8]">
              {riskLabel}
            </span>
            {suspicion.aiPhrasesFound.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/15 px-2 py-0.5 text-[#e5e7eb]">
                <LucideIcons.Lightbulb size="xs" />
                AI‑фраз: {suspicion.aiPhrasesFound.length}
              </span>
            )}
            {wasEdited && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/15 px-2 py-0.5 text-[#e5e7eb]">
                <LucideIcons.Edit3 size="xs" />
                Текст редактировали
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-2 text-sm">
          {suspicion.fastFillDetails && (
            <li style={{ color: "#d7e9e0" }}>
              <strong>Как быстро ввели текст:</strong>{" "}
              {suspicion.fastFillDetails.chars} симв. за{" "}
              {Math.round(suspicion.fastFillDetails.seconds)} сек (
              {suspicion.fastFillDetails.charsPerSec.toFixed(1)} сим/сек).
              {suspicion.fastFillHigh ? (
                <span className="block mt-1 text-[#e16162]">
                  Очень быстро — почти наверняка вставка (ручной ввод обычно
                  ~3–5 сим/сек).
                </span>
              ) : suspicion.fastFill ? (
                <span className="block mt-1 text-[#f9bc60]">
                  Быстрее обычного — возможна вставка или очень быстрый набор.
                </span>
              ) : null}
            </li>
          )}
          {suspicion.aiPhrasesFound.length >= 2 && (
            <li style={{ color: "#d7e9e0" }}>
              <strong>Что выдало ИИ‑стиль:</strong>{" "}
              {suspicion.aiPhrasesFound.join(", ")}
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
