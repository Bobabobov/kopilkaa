// app/admin/components/ApplicationsListItemImages.tsx
"use client";

interface ApplicationsListItemImagesProps {
  images: { url: string; sort: number }[];
  onImageClick: (images: string[], index: number) => void;
}

export default function ApplicationsListItemImages({
  images,
  onImageClick,
}: ApplicationsListItemImagesProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {images.map((img, i) => (
        <div key={i} className="group relative overflow-hidden rounded-2xl">
          <img
            src={img.url}
            alt=""
            className="w-full h-32 object-cover rounded-2xl border border-gray-200 dark:border-gray-600 cursor-zoom-in transition-all duration-300 group-hover:scale-105"
            onClick={() =>
              onImageClick(
                images.map((x) => x.url),
                i,
              )
            }
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
