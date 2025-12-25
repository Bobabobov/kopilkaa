"use client";
import PreviewImageUpload from "./PreviewImageUpload";
import type { AdFormData } from "../types";

interface BasicFieldsProps {
  formData: AdFormData;
  previewImageFile?: { file: File; url: string } | null;
  uploadingPreview?: boolean;
  onFieldChange: (field: keyof AdFormData, value: any) => void;
  onPreviewFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreviewUrlChange?: (url: string) => void;
  onPreviewRemove?: () => void;
}

export default function BasicFields({
  formData,
  previewImageFile,
  uploadingPreview,
  onFieldChange,
  onPreviewFileSelect,
  onPreviewUrlChange,
  onPreviewRemove,
}: BasicFieldsProps) {
  const showTitle = formData.placement !== "stories" &&
    formData.placement !== "home_sidebar" &&
    formData.placement !== "home_banner";

  const showImageUrl = formData.placement !== "stories";
  const isStories = formData.placement === "stories";
  const isHomeSidebar = formData.placement === "home_sidebar";
  const isHomeBanner = formData.placement === "home_banner";
  const showImageUpload = isStories || isHomeSidebar || isHomeBanner;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {showTitle && (
        <div>
          <label className="block text-sm font-medium text-[#abd1c6] mb-2">
            Заголовок
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            placeholder="Краткий привлекательный заголовок"
            maxLength={40}
            required={formData.placement !== "stories"}
          />
          <p className="text-xs text-[#abd1c6]/70 mt-1">
            Рекомендуемая длина: 20–40 символов ({formData.title.length}/40)
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Ссылка (опционально)
        </label>
        <input
          type="url"
          value={formData.linkUrl}
          onChange={(e) => onFieldChange("linkUrl", e.target.value)}
          className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
        />
      </div>

      {(showImageUrl || showImageUpload) && (
        <div>
          <label className="block text-sm font-medium text-[#abd1c6] mb-2">
            {isStories
              ? "Картинка для превью в /stories"
              : isHomeSidebar
                ? "Изображение для блока под кнопками"
                : isHomeBanner
                  ? "Изображение для большого баннера (десктоп)"
                  : "URL изображения (опционально)"}
          </label>
          {showImageUpload &&
          previewImageFile !== undefined &&
          uploadingPreview !== undefined &&
          onPreviewFileSelect &&
          onPreviewUrlChange &&
          onPreviewRemove ? (
            <PreviewImageUpload
              imageUrl={formData.imageUrl}
              uploading={uploadingPreview}
              previewImageFile={previewImageFile}
              onFileSelect={onPreviewFileSelect}
              onUrlChange={onPreviewUrlChange}
              onRemove={onPreviewRemove}
              inputId={isStories ? "stories-preview-image-upload" : isHomeSidebar ? "sidebar-desktop-image-upload" : "banner-desktop-image-upload"}
            />
          ) : (
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => onFieldChange("imageUrl", e.target.value)}
              className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
              placeholder="https://example.com/banner.jpg"
            />
          )}
          <p className="text-xs text-[#abd1c6]/70 mt-1">
            {formData.placement === "home_banner" && (
              <>
                <strong>Большой баннер наверху (для десктопа):</strong> по ширине блока, высота
                ~180–250px. Лучше использовать картинку 1600–1920px по ширине.
              </>
            )}
            {formData.placement === "home_sidebar" && (
              <>
                <strong>Блок под кнопками на главной:</strong> горизонтальный баннер примерно
                600–900×220–260px.
              </>
            )}
            {isStories && (
              <>
                <strong>Для раздела историй:</strong> эта картинка используется только как превью
                карточки на странице <code>/stories</code>. Картинки ниже — внутри самой истории.
              </>
            )}
            {formData.placement === "other" && (
              <>Рекомендуемый размер зависит от места размещения.</>
            )}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Истекает (опционально)
        </label>
        <input
          type="date"
          value={formData.expiresAt}
          onChange={(e) => onFieldChange("expiresAt", e.target.value)}
          className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Тип размещения
        </label>
        <select
          value={formData.placement}
          onChange={(e) => onFieldChange("placement", e.target.value)}
          className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
        >
          <option value="home_sidebar">Главная — блок под кнопками</option>
          <option value="home_banner">Главная — большой баннер</option>
          <option value="stories">Раздел историй</option>
          <option value="other">Другое / вручную</option>
        </select>
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Это влияет только на то, где на сайте будет использоваться это размещение.
        </p>
      </div>
    </div>
  );
}

