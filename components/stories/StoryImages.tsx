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
    <div className="space-y-4 mb-8">
      <h3 className="text-xl font-semibold mb-4" style={{ color: '#fffffe' }}>Изображения:</h3>
      {sortedImages.map((image, index) => (
        <div key={index} className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg" style={{ borderColor: '#abd1c6/30' }}>
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