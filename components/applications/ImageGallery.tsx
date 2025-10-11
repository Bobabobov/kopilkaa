"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageGalleryProps {
  images: { url: string; sort: number }[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    // Блокируем прокрутку страницы
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    // Восстанавливаем прокрутку страницы
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Очищаем стили при размонтировании компонента
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Обработка клавиши Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && lightboxOpen) {
        closeLightbox();
      }
    };

    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="mb-2 sm:mb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
          {images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className="cursor-pointer group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img.url}
                alt={`${title} - Фото ${i + 1}`}
                className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {images.length > 5 && (
            <div
              className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              onClick={() => openLightbox(5)}
            >
              <div className="text-center">
                <div className="w-6 h-6 mx-auto mb-1 text-slate-400">📷</div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  +{images.length - 5}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Portal */}
      {mounted &&
        lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors text-xl font-bold z-20"
                style={{ zIndex: 20 }}
              >
                ✕
              </button>

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Центральная область с изображением */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {images[currentIndex] ? (
                    <div
                      className="w-[90vw] h-[80vh] flex items-center justify-center"
                      style={{
                        width: "90vw",
                        height: "80vh",
                        minHeight: "400px",
                        maxHeight: "80vh",
                      }}
                    >
                      <img
                        src={images[currentIndex].url}
                        alt={`${title} - Фото ${currentIndex + 1}`}
                        className="w-full h-full object-contain"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          console.error(
                            "Image load error:",
                            images[currentIndex],
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-gray-500">
                          Изображение не найдено
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Левая область для закрытия (избегаем кнопку навигации) */}
                <div
                  className="absolute left-0 top-0 w-16 h-full cursor-pointer"
                  onClick={closeLightbox}
                  title="Кликните для закрытия"
                />

                {/* Правая область для закрытия (избегаем кнопку навигации) */}
                <div
                  className="absolute right-0 top-0 w-16 h-full cursor-pointer"
                  onClick={closeLightbox}
                  title="Кликните для закрытия"
                />

                {/* Верхняя область для закрытия */}
                <div
                  className="absolute left-16 top-0 right-16 h-16 cursor-pointer"
                  onClick={closeLightbox}
                  title="Кликните для закрытия"
                />

                {/* Нижняя область для закрытия */}
                <div
                  className="absolute left-16 bottom-0 right-16 h-16 cursor-pointer"
                  onClick={closeLightbox}
                  title="Кликните для закрытия"
                />

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors text-xl font-bold z-20"
                      style={{ zIndex: 20 }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors text-xl font-bold z-20"
                      style={{ zIndex: 20 }}
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Counter */}
                <div
                  className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-lg font-medium z-20"
                  style={{ zIndex: 20 }}
                >
                  {currentIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 justify-center overflow-x-auto max-w-full px-4 z-20"
                  style={{ zIndex: 20 }}
                >
                  {images.map((img, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentIndex
                            ? "border-white scale-110"
                            : "border-transparent hover:border-white/50"
                        }`}
                      >
                        {img ? (
                          <img
                            src={img.url}
                            alt={`${title} - Фото ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(
                                `Thumbnail ${index} load error:`,
                                img,
                              );
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">?</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
