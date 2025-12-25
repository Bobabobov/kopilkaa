"use client";
import StoryImageUploadItem from "./StoryImageUploadItem";

interface StoryImagesSectionProps {
  storyImageUrls: string[];
  storyImageFiles: Record<number, { file: File; url: string }>;
  uploadingStoryImages: Record<number, boolean>;
  onFileSelect: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (index: number, url: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  onUpload?: (index: number) => void;
}

export default function StoryImagesSection({
  storyImageUrls,
  storyImageFiles,
  uploadingStoryImages,
  onFileSelect,
  onUrlChange,
  onRemove,
  onAdd,
  onUpload,
}: StoryImagesSectionProps) {
  return (
    <div className="md:col-span-2 space-y-3">
      <label className="block text-sm font-medium text-[#abd1c6]">
        Картинки для истории (до 5 штук)
      </label>
      {storyImageUrls.map((url, index) => (
        <StoryImageUploadItem
          key={index}
          index={index}
          url={url}
          uploading={uploadingStoryImages[index] || false}
          previewFile={storyImageFiles[index] || null}
          onFileSelect={onFileSelect}
          onUrlChange={onUrlChange}
          onRemove={onRemove}
          onUpload={onUpload}
        />
      ))}
      {storyImageUrls.length < 5 && (
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-[#f9bc60] hover:text-[#e8a545] font-semibold"
        >
          + Добавить ещё картинку
        </button>
      )}
      <p className="text-xs text-[#abd1c6]/70">
        Эти картинки показываются внутри самой истории в /stories/ad. Превью карточки на странице{" "}
        <code>/stories</code> берётся из поля выше «Картинка для превью».
      </p>
    </div>
  );
}

