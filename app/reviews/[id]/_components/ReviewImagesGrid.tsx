import { useState } from "react";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

interface ReviewImagesGridProps {
  images?: ReviewItem["images"];
  onOpenLightbox: (index: number) => void;
}

export function ReviewImagesGrid({
  images,
  onOpenLightbox,
}: ReviewImagesGridProps) {
  if (!images || images.length === 0) {
    return null;
  }
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  return (
    <section className="w-full min-w-0 space-y-2 sm:space-y-3">
      <h3 className="text-xs font-semibold text-white/80 sm:text-sm">Фото</h3>
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {images.map((img, index) => {
          const previewUrl = buildUploadUrl(img.url, { variant: "thumb" });
          const isFailed = failedUrls[previewUrl] || failedUrls[img.url];
          const shouldBypassOptimization =
            isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
          return (
            <button
              key={img.url}
              type="button"
              onClick={() => {
                if (!isFailed) onOpenLightbox(index);
              }}
              className="group relative w-full h-40 xs:h-44 sm:h-48 md:h-52 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg transition-all hover:border-white/20 sm:rounded-2xl"
              disabled={isFailed}
            >
              {isFailed ? (
                <div className="flex h-40 w-full items-center justify-center text-xs text-white/70 xs:h-44 sm:h-48 md:h-52">
                  <LucideIcons.ImageOff size="sm" />
                  <span className="ml-2">Изображение недоступно</span>
                </div>
              ) : (
                <Image
                  src={previewUrl}
                  alt="Фото отзыва"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={shouldBypassOptimization}
                  onError={(e) => {
                    setFailedUrls((prev) => ({
                      ...prev,
                      [previewUrl]: true,
                      [img.url]: true,
                    }));
                    e.currentTarget.src = "/stories-preview.jpg";
                  }}
                />
              )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent transition-colors group-hover:from-black/50" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <LucideIcons.ZoomIn size="sm" className="text-white" />
                <span className="text-xs font-medium text-white">Открыть</span>
              </div>
            </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
