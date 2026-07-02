'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { buildUploadUrl } from '@/lib/uploads/url';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function ImageLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onCloseRef = useRef(onClose);
  const onIndexChangeRef = useRef(onIndexChange);

  useEffect(() => {
    onCloseRef.current = onClose;
    onIndexChangeRef.current = onIndexChange;
  }, [onClose, onIndexChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goPrevious = useCallback(() => {
    if (images.length <= 1) return;
    onIndexChangeRef.current(
      (currentIndex - 1 + images.length) % images.length,
    );
  }, [currentIndex, images.length]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    onIndexChangeRef.current((currentIndex + 1) % images.length);
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener('keydown', onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, goPrevious, goNext]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !touch || images.length <= 1) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

      event.preventDefault();
      if (deltaX > 0) goPrevious();
      else goNext();
    },
    [goNext, goPrevious, images.length],
  );

  if (!mounted || !isOpen || images.length === 0) return null;

  const safeIndex = Math.min(Math.max(currentIndex, 0), images.length - 1);
  const fullUrl = buildUploadUrl(images[safeIndex], { variant: 'full' });
  const isFailed = failedUrls[fullUrl];
  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4'
      role='dialog'
      aria-modal='true'
      aria-label='Просмотр фотографий'
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className='relative flex h-[min(80vh,900px)] w-full max-w-5xl flex-col'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          aria-label='Закрыть'
          className='absolute right-0 top-0 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 sm:h-11 sm:w-11'
          onClick={onClose}
        >
          <X className='h-5 w-5' aria-hidden />
        </button>

        <div className='relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16'>
          {hasMultiple ? (
            <button
              type='button'
              aria-label='Предыдущее фото'
              className='absolute left-0 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:h-12 sm:w-12'
              onClick={(event) => {
                event.stopPropagation();
                goPrevious();
              }}
            >
              <ChevronLeft className='h-6 w-6' aria-hidden />
            </button>
          ) : null}

          <div className='relative z-0 flex h-full w-full items-center justify-center'>
            {isFailed ? (
              <div className='flex h-full w-full items-center justify-center text-white/70'>
                Изображение недоступно
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={fullUrl}
                alt={`Фото ${safeIndex + 1}`}
                className='max-h-full max-w-full select-none rounded-xl object-contain shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65)]'
                draggable={false}
                decoding='async'
                onError={() =>
                  setFailedUrls((prev) => ({ ...prev, [fullUrl]: true }))
                }
              />
            )}
          </div>

          {hasMultiple ? (
            <button
              type='button'
              aria-label='Следующее фото'
              className='absolute right-0 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:h-12 sm:w-12'
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
            >
              <ChevronRight className='h-6 w-6' aria-hidden />
            </button>
          ) : null}
        </div>

        {hasMultiple ? (
          <div className='z-20 mt-3 flex flex-col items-center gap-3'>
            <p className='text-sm text-white/80'>
              {safeIndex + 1} / {images.length}
            </p>
            <div className='flex max-w-full flex-wrap justify-center gap-2'>
              {images.map((url, index) => {
                const thumbUrl = buildUploadUrl(url, { variant: 'thumb' });
                const isActive = index === safeIndex;

                return (
                  <button
                    key={`${url}-${index}`}
                    type='button'
                    onClick={() => onIndexChangeRef.current(index)}
                    className={cn(
                      'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                      isActive
                        ? 'scale-105 border-[#f9bc60] shadow-[0_0_0_2px_rgba(249,188,96,0.25)]'
                        : 'border-transparent opacity-70 hover:border-white/30 hover:opacity-100',
                    )}
                    aria-label={`Показать фото ${index + 1}`}
                    aria-current={isActive}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl}
                      alt=''
                      className='h-full w-full object-cover'
                      loading='lazy'
                      decoding='async'
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
