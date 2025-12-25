"use client";
import PreviewImageUpload from "./PreviewImageUpload";
import type { AdFormData } from "../types";

interface SidebarMobileFieldsProps {
  formData: AdFormData;
  previewImageFile?: { file: File; url: string } | null;
  uploadingPreview?: boolean;
  onFieldChange: (field: keyof AdFormData, value: any) => void;
  onMobileImageFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMobileImageUrlChange?: (url: string) => void;
  onMobileImageRemove?: () => void;
}

export default function SidebarMobileFields({
  formData,
  previewImageFile,
  uploadingPreview,
  onFieldChange,
  onMobileImageFileSelect,
  onMobileImageUrlChange,
  onMobileImageRemove,
}: SidebarMobileFieldsProps) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-r from-[#001e1d]/40 to-[#002724]/40 border border-[#abd1c6]/10">
      <div className="md:col-span-2">
        <h3 className="text-sm font-semibold text-[#f9bc60] mb-3 flex items-center gap-2">
          <span className="text-lg">📱</span>
          Мобильная версия (для экранов меньше 768px)
        </h3>
        <p className="text-xs text-[#abd1c6]/70 mb-4">
          Эти настройки используются только на мобильных устройствах. Если не заполнены, будут использоваться данные из десктопной версии.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Изображение для мобильной версии (рекомендуется квадрат 48×48px или больше)
        </label>
        {previewImageFile !== undefined && uploadingPreview !== undefined && onMobileImageFileSelect && onMobileImageUrlChange && onMobileImageRemove ? (
          <PreviewImageUpload
            imageUrl={formData.sidebarMobileImageUrl}
            uploading={uploadingPreview}
            previewImageFile={previewImageFile}
            onFileSelect={onMobileImageFileSelect}
            onUrlChange={onMobileImageUrlChange}
            onRemove={onMobileImageRemove}
            inputId="sidebar-mobile-image-upload"
          />
        ) : (
          <input
            type="text"
            value={formData.sidebarMobileImageUrl}
            onChange={(e) => onFieldChange("sidebarMobileImageUrl", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            placeholder="https://example.com/mobile-image.jpg или загрузите файл"
          />
        )}
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Квадратное изображение, отображаемое слева от текста на мобильных устройствах. Рекомендуемый размер: 48×48px или больше (квадрат).
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Заголовок для мобильной версии
        </label>
        <input
          type="text"
          value={formData.sidebarMobileTitle}
          onChange={(e) => onFieldChange("sidebarMobileTitle", e.target.value)}
          className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
          placeholder="Оставьте пустым, чтобы использовать заголовок из десктопной версии"
          maxLength={80}
        />
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Этот текст отображается вместо слова "Реклама" в мобильной версии. Если оставить пустым, будет использоваться заголовок из основного блока.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Описание для мобильной версии
        </label>
        <textarea
          value={formData.sidebarMobileContent}
          onChange={(e) => onFieldChange("sidebarMobileContent", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
          placeholder="Оставьте пустым, чтобы использовать описание из десктопной версии"
          maxLength={200}
        />
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Краткое описание для мобильной версии. Если оставить пустым, будет использоваться описание из основного блока.
        </p>
      </div>
    </div>
  );
}

