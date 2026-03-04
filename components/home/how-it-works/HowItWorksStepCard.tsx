"use client";

import { motion } from "framer-motion";
import { User, FileText, Clock, Banknote } from "lucide-react";
import type { HowItWorksStep } from "./config";

const STEP_ICONS = {
  User,
  FileText,
  Clock,
  DollarSign: Banknote,
} as const;

interface HowItWorksStepCardProps {
  step: HowItWorksStep;
  index: number;
  steps: HowItWorksStep[];
}

export function HowItWorksStepCard({
  step,
  index,
  steps,
}: HowItWorksStepCardProps) {
  const Icon = STEP_ICONS[step.icon as keyof typeof STEP_ICONS];
  const nextStep = steps[index + 1];
  const accent = "#f9bc60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative h-full"
    >
      {index < steps.length - 1 && nextStep && (
        <div
          className="hidden lg:block absolute top-14 left-full w-full h-0.5 -z-10"
          style={{
            background: "linear-gradient(to right, rgba(249,188,96,0.35), transparent)",
          }}
        />
      )}

      <div
        className="relative h-full rounded-2xl p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02] group"
        style={{
          background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-25 group-hover:opacity-40 transition-opacity"
          style={{ backgroundColor: accent }}
        />

        <div className="relative flex items-start gap-4 mb-5">
          <span
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-colors"
            style={{
              background: "rgba(249, 188, 96, 0.15)",
              color: accent,
            }}
          >
            {Icon ? <Icon className="w-6 h-6" /> : null}
          </span>
          <div className="min-w-0">
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: accent }}
            >
              Шаг {index + 1}
            </span>
            <h3 className="text-lg font-bold leading-tight" style={{ color: "#fffffe" }}>
              {step.title}
            </h3>
          </div>
        </div>

        <p className="text-sm font-semibold mb-2" style={{ color: accent }}>
          {step.description}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#abd1c6" }}>
          {step.details}
        </p>
      </div>
    </motion.div>
  );
}
