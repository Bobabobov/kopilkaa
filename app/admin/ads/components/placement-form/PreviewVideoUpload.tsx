"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PreviewVideoUploadProps {
  videoUrl: string;
  uploading: boolean;
  previewVideoFile: { file: File; url: string } | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
  inputId?: string;
}

export default function PreviewVideoUpload({
  videoUrl,
  uploading,
  previewVideoFile,
  onFileSelect,
  onUrlChange,
  onRemove,
  inputId = "preview-video-upload",
}: PreviewVideoUploadProps) {
  return (
    <div className="space-y-3">
      {/* Загрузка файла */}
      <div>
        <input
          type="file"
          accept="video/mp4,video/webm"
          onChange={onFileSelect}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#004643] border-2 border-dashed border-[#abd1c6]/30 rounded-lg text-[#abd1c6] hover:border-[#f9bc60] hover:text-[#f9bc60] cursor-pointer transition-colors"
        >
          <LucideIcons.Upload size="sm" />
          <span>Загрузить видео</span>
        </label>
      </div>

      {/* Индикатор загрузки */}
      {uploading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg">
          <LucideIcons.Loader2 size="sm" className="animate-spin text-[#f9bc60]" />
          <span className="text-sm text-[#abd1c6]">Загрузка видео...</span>
        </div>
      )}

      {/* Поле URL */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            placeholder="https://example.com/video.mp4 или загрузите файл выше"
          />
          {videoUrl && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <LucideIcons.CheckCircle size="xs" className="text-[#10B981]" />
            </div>
          )}
        </div>
        {videoUrl && !previewVideoFile && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            title="Удалить видео"
          >
            <LucideIcons.Trash2 size="sm" />
          </button>
        )}
      </div>

      {/* Превью видео */}
      {videoUrl && !previewVideoFile && (
        <div className="relative">
          <video
            src={videoUrl}
            controls
            muted
            playsInline
            className="w-full h-48 object-cover rounded-lg border border-[#abd1c6]/30 bg-black"
            onError={(e) => {
              (e.target as HTMLVideoElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}


