"use client";

import { memo } from "react";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryImage {
  url: string;
  sort: number;
}

interface StoryImagesProps {
  images?: StoryImage[];
  title?: string;
}

function StoryImagesInner({ images = [], title }: StoryImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const sortedImages = [...images].sort((a, b) => a.sort - b.sort);

  return (
    <section className="mb-10" aria-label="Галерея изображений истории">
      <h2 className="flex items-center gap-2 text-xl font-bold text-[#fffffe] mb-5">
        <LucideIcons.Image size="md" className="text-[#f9bc60]" aria-hidden />
        Изображения
      </h2>
      <div className="grid gap-5 sm:gap-6">
        {sortedImages.map((image, index) => (
          <figure
            key={`${image.url}-${index}`}
            className="relative overflow-hidden rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/30 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.2)] aspect-[4/3]"
          >
            <Image
              src={image.url}
              alt={`${title || "История"} — изображение ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 720px"
              className="object-cover"
              unoptimized={typeof image.url === "string" && /^https?:\/\//i.test(image.url)}
              onError={(e) => {
                e.currentTarget.src = "/stories-preview.jpg";
              }}
            />
            <figcaption className="sr-only">
              Изображение {index + 1} из {sortedImages.length}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default memo(StoryImagesInner);
