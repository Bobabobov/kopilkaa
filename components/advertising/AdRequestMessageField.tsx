"use client";

import { motion } from "framer-motion";
import { getAdRequestInputClassName } from "./adRequestValidation";
import type { AdRequestFormData } from "./adRequestValidation";

interface AdRequestMessageFieldProps {
  formData: AdRequestFormData;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function AdRequestMessageField({
  formData,
  errors,
  setErrors,
  handleChange,
}: AdRequestMessageFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-4">
        <label className="block text-[#fffffe] text-lg md:text-xl font-semibold">
          Что-то ещё? <span className="text-red-400">*</span>
        </label>
        <span
          className={`text-sm font-medium transition-colors ${formData.message.length > 400 ? "text-red-400" : "text-[#abd1c6]"}`}
        >
          {formData.message.length} / 400
        </span>
      </div>
      <textarea
        name="message"
        value={formData.message}
        onChange={(e) => {
          handleChange(e);
          if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
        }}
        maxLength={400}
        rows={5}
        className={getAdRequestInputClassName(!!errors.message)}
        placeholder="Например: у меня интернет-магазин цветов, хочу больше заказов"
      />
      {errors.message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-3 flex items-center gap-2"
        >
          <span>⚠</span> {errors.message}
        </motion.p>
      )}
      {!errors.message && formData.message.length > 400 && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-3 flex items-center gap-2"
        >
          <span>⚠</span> Превышено максимальное количество символов (400)
        </motion.p>
      )}
    </motion.div>
  );
}
