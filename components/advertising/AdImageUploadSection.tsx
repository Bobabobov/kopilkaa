"use client";

import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdImageUploadSectionProps {
  label: string;
  description?: string;
  maxImages: number;
  images: { file: File; url: string }[];
  imageUrls: string[];
  urlInput: string;
  inputMode: "upload" | "url";
  onImagesChange: (images: { file: File; url: string }[]) => void;
  onImageUrlsChange: (urls: string[]) => void;
  onUrlInputChange: (url: string) => void;
  onInputModeChange: (mode: "upload" | "url") => void;
  onRemoveImage: (index: number) => void;
  onRemoveImageUrl: (index: number) => void;
  inputId: string;
}

export function AdImageUploadSection({
  label,
  description,
  maxImages,
  images,
  imageUrls,
  urlInput,
  inputMode,
  onImagesChange,
  onImageUrlsChange,
  onUrlInputChange,
  onInputModeChange,
  onRemoveImage,
  onRemoveImageUrl,
  inputId,
}: AdImageUploadSectionProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mappedFiles = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    const newImages = [...images, ...mappedFiles].slice(0, maxImages);
    onImagesChange(newImages);
  };

  const addImageUrl = () => {
    if (urlInput.trim() && imageUrls.length < maxImages) {
      onImageUrlsChange([...imageUrls, urlInput.trim()]);
      onUrlInputChange("");
    }
  };

  return (
    <div>
      <label className="block text-[#fffffe] text-lg mb-3">
        {label} (до {maxImages} штук)
      </label>
      {description && (
        <p className="text-sm text-[#abd1c6] mb-3">{description}</p>
      )}
      <div className="space-y-4">
        {/* Переключатель режима */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onInputModeChange("upload")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === "upload"
                ? "bg-[#f9bc60] text-[#001e1d]"
                : "bg-[#004643] text-[#abd1c6] border border-[#abd1c6]/20"
            }`}
          >
            Загрузить с компьютера
          </button>
          <button
            type="button"
            onClick={() => onInputModeChange("url")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === "url"
                ? "bg-[#f9bc60] text-[#001e1d]"
                : "bg-[#004643] text-[#abd1c6] border border-[#abd1c6]/20"
            }`}
          >
            Ввести ссылку
          </button>
        </div>

        {/* Режим загрузки */}
        {inputMode === "upload" && (
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={inputId}
              disabled={images.length >= maxImages}
            />
            <label
              htmlFor={inputId}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                images.length >= maxImages
                  ? "border-[#abd1c6]/20 text-[#abd1c6]/50 cursor-not-allowed"
                  : "border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60] hover:text-[#f9bc60]"
              }`}
            >
              <LucideIcons.Upload className="w-5 h-5" />
              <span>Выбрать файлы ({images.length}/{maxImages})</span>
            </label>

            {/* Превью загруженных изображений */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-[#abd1c6]/20"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Режим URL */}
        {inputMode === "url" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => onUrlInputChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 bg-[#004643] border border-[#abd1c6]/20 text-[#fffffe] rounded-lg focus:border-[#f9bc60] focus:outline-none"
                disabled={imageUrls.length >= maxImages}
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={!urlInput.trim() || imageUrls.length >= maxImages}
                className="px-4 py-2 bg-[#f9bc60] text-[#001e1d] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить
              </button>
            </div>
            {/* Список URL */}
            {imageUrls.length > 0 && (
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-[#004643] rounded-lg border border-[#abd1c6]/20"
                  >
                    <span className="text-sm text-[#abd1c6] truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveImageUrl(index)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

