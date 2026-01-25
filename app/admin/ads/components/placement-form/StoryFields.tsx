"use client";
import RichTextEditor from "@/components/applications/RichTextEditor";
import StoryImagesSection from "./StoryImagesSection";
import type { AdFormData } from "../types";

interface StoryFieldsProps {
  formData: AdFormData;
  storyImageFiles: Record<number, { file: File; url: string }>;
  uploadingStoryImages: Record<number, boolean>;
  onFieldChange: (field: keyof AdFormData, value: any) => void;
  onStoryImageFileSelect: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onStoryImageUrlChange: (index: number, url: string) => void;
  onStoryImageRemove: (index: number) => void;
  onAddStoryImage: () => void;
  onStoryImageUpload?: (index: number) => void;
}

export default function StoryFields({
  formData,
  storyImageFiles,
  uploadingStoryImages,
  onFieldChange,
  onStoryImageFileSelect,
  onStoryImageUrlChange,
  onStoryImageRemove,
  onAddStoryImage,
  onStoryImageUpload,
}: StoryFieldsProps) {
  return (
    <>
      {/* Дополнительные поля для историй */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#abd1c6] mb-2">
            Заголовок рекламной истории
          </label>
          <input
            type="text"
            value={formData.storyTitle}
            onChange={(e) => onFieldChange("storyTitle", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            placeholder="Например: Как мы помогли авторам собрать 100 000 ₽"
            maxLength={80}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#abd1c6] mb-2">
            Текст истории
          </label>
          <RichTextEditor
            value={formData.storyText || ""}
            onChange={(value) => onFieldChange("storyText", value)}
            placeholder="Кратко опишите историю, которая будет показана в ленте /stories"
            rows={6}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#abd1c6] mb-2">
            Название проекта в подписи
          </label>
          <input
            type="text"
            value={formData.advertiserName}
            onChange={(e) => onFieldChange("advertiserName", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            placeholder="Например: Кофейня «Утренний кот»"
            maxLength={80}
          />
          <p className="text-xs text-[#abd1c6]/70 mt-1">
            Это название будет показано рядом с зелёным кружком «Команда
            проекта» и будет кликабельным.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#abd1c6] mb-2">
            Ссылка для подписи проекта (URL)
          </label>
          <input
            type="url"
            value={formData.advertiserLink}
            onChange={(e) => onFieldChange("advertiserLink", e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
            placeholder="https://example.com"
          />
          <p className="text-xs text-[#abd1c6]/70 mt-1">
            Клик по названию проекта откроет эту ссылку в новой вкладке. Если
            оставить пустой — подпись будет без ссылки.
          </p>
        </div>

        <StoryImagesSection
          storyImageUrls={formData.storyImageUrls}
          storyImageFiles={storyImageFiles}
          uploadingStoryImages={uploadingStoryImages}
          onFileSelect={onStoryImageFileSelect}
          onUrlChange={onStoryImageUrlChange}
          onRemove={onStoryImageRemove}
          onAdd={onAddStoryImage}
          onUpload={onStoryImageUpload}
        />
      </div>
    </>
  );
}
