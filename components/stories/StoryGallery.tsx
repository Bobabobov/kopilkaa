// components/stories/StoryGallery.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryGalleryProps {
  images: { url: string; sort: number }[];
  onImageClick: (index: number) => void;
}

export function StoryGallery({ images, onImageClick }: StoryGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <LucideIcons.Image size="md" />
          Фотографии
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
              onClick={() => onImageClick(i)}
            >
              <img 
                src={img.url} 
                alt={`Фото ${i + 1}`}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <LucideIcons.ZoomIn size="sm" className="text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
