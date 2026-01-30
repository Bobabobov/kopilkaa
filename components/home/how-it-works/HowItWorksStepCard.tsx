"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { HowItWorksStep } from "./config";

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
  const Icon = LucideIcons[step.icon as keyof typeof LucideIcons];
  const nextStep = steps[index + 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {index < steps.length - 1 && nextStep && (
        <div
          className="hidden lg:block absolute top-12 left-full w-full h-0.5 -z-10"
          style={{
            background: `linear-gradient(to right, ${step.color}, ${nextStep.color})`,
            opacity: 0.3,
          }}
        />
      )}

      <div className="relative bg-white/[0.04] backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] h-full group overflow-hidden">
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
          style={{ backgroundColor: step.color }}
        />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col items-start gap-2">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: `${step.color}20`,
                borderColor: `${step.color}55`,
                color: step.color,
              }}
            >
              Шаг {index + 1}
            </span>
            <div
              className="text-5xl font-black leading-none"
              style={{
                color: step.color,
                textShadow: `0 0 20px ${step.color}40`,
              }}
            >
              {index + 1}
            </div>
          </div>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: `${step.color}30`,
              boxShadow: `0 4px 20px ${step.color}20`,
            }}
          >
            {Icon && (
              <div style={{ color: step.color }}>
                <Icon size="lg" />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2" style={{ color: "#fffffe" }}>
          {step.title}
        </h3>

        <p className="text-lg font-semibold mb-2" style={{ color: step.color }}>
          {step.description}
        </p>

        <p className="text-sm leading-relaxed" style={{ color: "#abd1c6" }}>
          {step.details}
        </p>
      </div>
    </motion.div>
  );
}
