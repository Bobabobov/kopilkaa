"use client";
import type { AdFormData } from "../types";

interface ContentFieldProps {
  formData: AdFormData;
  onFieldChange: (field: keyof AdFormData, value: any) => void;
}

export default function ContentField({
  formData,
  onFieldChange,
}: ContentFieldProps) {
  const showContent =
    formData.placement !== "stories" &&
    formData.placement !== "home_sidebar" &&
    formData.placement !== "home_banner";

  if (!showContent) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-[#abd1c6] mb-2">
        Содержание
      </label>
      <textarea
        value={formData.content}
        onChange={(e) => onFieldChange("content", e.target.value)}
        rows={4}
        className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
        placeholder="Подробное описание рекламы с призывом к действию"
        maxLength={120}
        required
      />
      <p className="text-xs text-[#abd1c6]/70 mt-1">
        Рекомендуемая длина: 60–120 символов ({formData.content.length}/120)
      </p>
    </div>
  );
}
