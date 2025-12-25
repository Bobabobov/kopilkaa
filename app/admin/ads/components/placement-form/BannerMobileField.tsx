"use client";
import type { AdFormData } from "../types";

interface BannerMobileFieldProps {
  formData: AdFormData;
  onFieldChange: (field: keyof AdFormData, value: any) => void;
}

export default function BannerMobileField({
  formData,
  onFieldChange,
}: BannerMobileFieldProps) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          URL изображения для мобильного баннера (опционально)
        </label>
        <input
          type="url"
          value={formData.bannerMobileImageUrl}
          onChange={(e) => onFieldChange("bannerMobileImageUrl", e.target.value)}
          className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
          placeholder="https://example.com/mobile-banner.jpg"
        />
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Если заполнить, этот баннер будет показан на телефонах. Рекомендуемый размер 800–1080px
          по ширине, ориентир по высоте 200–300px.
        </p>
      </div>
    </div>
  );
}

