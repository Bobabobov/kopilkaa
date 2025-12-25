"use client";
import type { AdFormData } from "../types";
import PreviewImageUpload from "./PreviewImageUpload";
import PreviewVideoUpload from "./PreviewVideoUpload";

interface BannerMobileFieldProps {
  formData: AdFormData;
  previewImageFile?: { file: File; url: string } | null;
  uploadingPreview?: boolean;
  onFieldChange: (field: keyof AdFormData, value: any) => void;
  onMobileImageFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMobileImageUrlChange?: (url: string) => void;
  onMobileImageRemove?: () => void;

  bannerVideoPreviewFile?: { file: File; url: string } | null;
  uploadingBannerVideo?: boolean;
  onBannerVideoFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerVideoUrlChange?: (url: string) => void;
  onBannerVideoRemove?: () => void;

  bannerMobileVideoPreviewFile?: { file: File; url: string } | null;
  uploadingBannerMobileVideo?: boolean;
  onBannerMobileVideoFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerMobileVideoUrlChange?: (url: string) => void;
  onBannerMobileVideoRemove?: () => void;
}

export default function BannerMobileField({
  formData,
  previewImageFile,
  uploadingPreview,
  onFieldChange,
  onMobileImageFileSelect,
  onMobileImageUrlChange,
  onMobileImageRemove,
  bannerVideoPreviewFile,
  uploadingBannerVideo,
  onBannerVideoFileSelect,
  onBannerVideoUrlChange,
  onBannerVideoRemove,
  bannerMobileVideoPreviewFile,
  uploadingBannerMobileVideo,
  onBannerMobileVideoFileSelect,
  onBannerMobileVideoUrlChange,
  onBannerMobileVideoRemove,
}: BannerMobileFieldProps) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Изображение для мобильного баннера (опционально)
        </label>
        {previewImageFile !== undefined &&
        uploadingPreview !== undefined &&
        onMobileImageFileSelect &&
        onMobileImageUrlChange &&
        onMobileImageRemove ? (
          <PreviewImageUpload
            imageUrl={formData.bannerMobileImageUrl}
            uploading={uploadingPreview}
            previewImageFile={previewImageFile}
            onFileSelect={onMobileImageFileSelect}
            onUrlChange={onMobileImageUrlChange}
            onRemove={onMobileImageRemove}
            inputId="banner-mobile-image-upload"
          />
        ) : (
          <input
            type="url"
            value={formData.bannerMobileImageUrl}
            onChange={(e) => onFieldChange("bannerMobileImageUrl", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
            placeholder="https://example.com/mobile-banner.jpg"
          />
        )}
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Если заполнить, этот баннер будет показан на телефонах. Рекомендуемый размер 800–1080px
          по ширине, ориентир по высоте 200–300px.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Видео для десктопного баннера (опционально)
        </label>
        {bannerVideoPreviewFile !== undefined &&
        uploadingBannerVideo !== undefined &&
        onBannerVideoFileSelect &&
        onBannerVideoUrlChange &&
        onBannerVideoRemove ? (
          <PreviewVideoUpload
            videoUrl={formData.bannerVideoUrl}
            uploading={uploadingBannerVideo}
            previewVideoFile={bannerVideoPreviewFile}
            onFileSelect={onBannerVideoFileSelect}
            onUrlChange={onBannerVideoUrlChange}
            onRemove={onBannerVideoRemove}
            inputId="banner-desktop-video-upload"
          />
        ) : (
          <input
            type="url"
            value={formData.bannerVideoUrl}
            onChange={(e) => onFieldChange("bannerVideoUrl", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
            placeholder="https://example.com/video.mp4"
          />
        )}
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Если указать видео, оно будет показано вместо изображения на десктопе. Поддерживаются форматы MP4, WebM.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#abd1c6] mb-2">
          Видео для мобильного баннера (опционально)
        </label>
        {bannerMobileVideoPreviewFile !== undefined &&
        uploadingBannerMobileVideo !== undefined &&
        onBannerMobileVideoFileSelect &&
        onBannerMobileVideoUrlChange &&
        onBannerMobileVideoRemove ? (
          <PreviewVideoUpload
            videoUrl={formData.bannerMobileVideoUrl}
            uploading={uploadingBannerMobileVideo}
            previewVideoFile={bannerMobileVideoPreviewFile}
            onFileSelect={onBannerMobileVideoFileSelect}
            onUrlChange={onBannerMobileVideoUrlChange}
            onRemove={onBannerMobileVideoRemove}
            inputId="banner-mobile-video-upload"
          />
        ) : (
          <input
            type="url"
            value={formData.bannerMobileVideoUrl}
            onChange={(e) => onFieldChange("bannerMobileVideoUrl", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
            placeholder="https://example.com/mobile-video.mp4"
          />
        )}
        <p className="text-xs text-[#abd1c6]/70 mt-1">
          Если указать видео, оно будет показано вместо изображения на мобильных устройствах. Поддерживаются форматы MP4, WebM.
        </p>
      </div>
    </div>
  );
}

