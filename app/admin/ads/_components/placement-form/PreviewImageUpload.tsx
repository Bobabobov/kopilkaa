"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PreviewImageUploadProps {
  imageUrl: string;
  uploading: boolean;
  previewImageFile: { file: File; url: string } | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
  inputId?: string;
}

export default function PreviewImageUpload({
  imageUrl,
  uploading,
  previewImageFile,
  onFileSelect,
  onUrlChange,
  onRemove,
  inputId = "preview-image-upload",
}: PreviewImageUploadProps) {
  return (
    <div className="space-y-3">
      {/* Загрузка файла */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#004643] border-2 border-dashed border-[#abd1c6]/30 rounded-lg text-[#abd1c6] hover:border-[#f9bc60] hover:text-[#f9bc60] cursor-pointer transition-colors"
        >
          <LucideIcons.Upload size="sm" />
          <span>Загрузить файл</span>
        </label>
      </div>

      {/* Индикатор загрузки */}
      {uploading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg">
          <LucideIcons.Loader2
            size="sm"
            className="animate-spin text-[#f9bc60]"
          />
          <span className="text-sm text-[#abd1c6]">
            Загрузка изображения...
          </span>
        </div>
      )}

      {/* Поле для URL или пути к файлу */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            placeholder="https://example.com/banner.jpg или загрузите файл выше"
          />
          {imageUrl && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <LucideIcons.CheckCircle size="xs" className="text-[#10B981]" />
            </div>
          )}
        </div>
        {imageUrl && !previewImageFile && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            title="Удалить изображение"
          >
            <LucideIcons.Trash2 size="sm" />
          </button>
        )}
      </div>

      {/* Превью загруженного/введенного изображения */}
      {imageUrl && !previewImageFile && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-[#abd1c6]/30"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
