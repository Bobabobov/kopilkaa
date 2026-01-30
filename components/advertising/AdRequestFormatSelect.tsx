"use client";

import { AdRequestField } from "./AdRequestField";
import {
  AD_FORMAT_OPTIONS,
  getAdRequestInputClassName,
} from "./adRequestValidation";
import type { AdRequestFormData } from "./adRequestValidation";

interface AdRequestFormatSelectProps {
  formData: AdRequestFormData;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function AdRequestFormatSelect({
  formData,
  errors,
  setErrors,
  handleChange,
}: AdRequestFormatSelectProps) {
  return (
    <AdRequestField
      label="Формат размещения"
      required
      error={errors.format}
      delay={0.15}
    >
      <select
        name="format"
        value={formData.format}
        onChange={(e) => {
          handleChange(e);
          if (errors.format) setErrors((prev) => ({ ...prev, format: "" }));
        }}
        className={getAdRequestInputClassName(!!errors.format)}
        style={{
          paddingRight: "3rem",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23abd1c6%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem",
          backgroundSize: "20px",
        }}
      >
        {AD_FORMAT_OPTIONS.map((opt) => (
          <option
            key={opt.value || "empty"}
            value={opt.value}
            className="bg-[#001e1d] text-[#fffffe]"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </AdRequestField>
  );
}
