"use client";

import { AdRequestField } from "./AdRequestField";
import { getAdRequestInputClassName } from "./adRequestValidation";
import type { AdRequestFormData } from "./adRequestValidation";

interface AdRequestDurationFieldProps {
  formData: AdRequestFormData;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdRequestDurationField({
  formData,
  errors,
  setErrors,
  handleChange,
}: AdRequestDurationFieldProps) {
  return (
    <AdRequestField
      label="Срок на сколько дней?"
      required
      error={errors.duration}
      delay={0.2}
    >
      <input
        type="number"
        name="duration"
        value={formData.duration}
        onChange={(e) => {
          handleChange(e);
          if (errors.duration) setErrors((prev) => ({ ...prev, duration: "" }));
        }}
        min={1}
        max={365}
        className={getAdRequestInputClassName(!!errors.duration)}
        placeholder="7"
      />
      {!errors.duration && (
        <p className="text-sm text-[#abd1c6] mt-3">От 1 до 365 дней</p>
      )}
    </AdRequestField>
  );
}
