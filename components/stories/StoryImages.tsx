"use client";

interface StoryImage {
  url: string;
  sort: number;
}

interface StoryImagesProps {
  images?: StoryImage[];
  title?: string;
}

export default function StoryImages({ images = [], title }: StoryImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // Сортируем изображения по полю sort
  const sortedImages = [...images].sort((a, b) => a.sort - b.sort);

  return (
    <div className="space-y-4">
      {sortedImages.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image.url}
            alt={`${title || 'Story'} image ${index + 1}`}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      ))}
    </div>
  );
}