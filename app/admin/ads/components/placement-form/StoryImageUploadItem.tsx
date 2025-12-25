"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryImageUploadItemProps {
  index: number;
  url: string;
  uploading: boolean;
  previewFile: { file: File; url: string } | null;
  onFileSelect: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (index: number, url: string) => void;
  onRemove: (index: number) => void;
  onUpload?: (index: number) => void;
}

export default function StoryImageUploadItem({
  index,
  url,
  uploading,
  previewFile,
  onFileSelect,
  onUrlChange,
  onRemove,
  onUpload,
}: StoryImageUploadItemProps) {
  return (
    <div className="space-y-2">
      {/* Загрузка файла */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileSelect(index, e)}
          className="hidden"
          id={`story-image-upload-${index}`}
        />
        <label
          htmlFor={`story-image-upload-${index}`}
          className={`inline-flex items-center gap-2 px-3 py-1.5 bg-[#004643] border-2 border-dashed border-[#abd1c6]/30 rounded-lg text-[#abd1c6] hover:border-[#f9bc60] hover:text-[#f9bc60] cursor-pointer transition-colors text-sm ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <>
              <LucideIcons.Loader2 size="xs" className="animate-spin" />
              <span>Загрузка...</span>
            </>
          ) : (
            <>
              <LucideIcons.Upload size="xs" />
              <span>Загрузить файл {index + 1}</span>
            </>
          )}
        </label>
      </div>

      {/* Превью выбранного файла перед загрузкой */}
      {previewFile && onUpload && (
        <div className="relative group">
          <img
            src={previewFile.url}
            alt={`Preview ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg border border-[#abd1c6]/30"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => onUpload(index)}
              disabled={uploading}
              className="px-3 py-1.5 bg-[#f9bc60] text-[#001e1d] rounded-lg font-medium hover:bg-[#e8a545] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center gap-1"
            >
              {uploading ? (
                <>
                  <LucideIcons.Loader2 size="xs" className="animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <LucideIcons.Upload size="xs" />
                  Загрузить
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-xs"
            >
              <LucideIcons.X size="xs" />
            </button>
          </div>
        </div>
      )}

      {/* Поле для URL или пути к файлу */}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(index, e.target.value)}
          className="flex-1 px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
          placeholder={`https://example.com/story-image-${index + 1}.jpg или загрузите файл выше`}
        />
        {url && !previewFile && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            title="Удалить изображение"
          >
            <LucideIcons.Trash2 size="sm" />
          </button>
        )}
      </div>

      {/* Превью загруженного/введенного изображения */}
      {url && !previewFile && (
        <div className="relative">
          <img
            src={url}
            alt={`Story image ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg border border-[#abd1c6]/30"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

