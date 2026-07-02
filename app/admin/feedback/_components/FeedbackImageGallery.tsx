'use client';

import { useState } from 'react';
import Image from 'next/image';
import { buildUploadUrl, isExternalUrl, isUploadUrl } from '@/lib/uploads/url';

interface FeedbackImageGalleryProps {
  imageUrls: string[];
  onImageClick: (index: number) => void;
}

export function FeedbackImageGallery({
  imageUrls,
  onImageClick,
}: FeedbackImageGalleryProps) {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  if (imageUrls.length === 0) return null;

  return (
    <div className='mt-4 min-w-0 overflow-hidden'>
      <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold text-[#fffffe] sm:text-base'>
        <svg
          className='h-4 w-4 shrink-0 text-[#f9bc60]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
        Фотографии ({imageUrls.length})
      </h4>

      <div className='rounded-2xl border border-[#abd1c6]/25 bg-gradient-to-br from-[#004643]/80 via-[#004643]/70 to-[#001e1d]/80 p-3 sm:p-4'>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5'>
          {imageUrls.map((url, index) => {
            const previewUrl = buildUploadUrl(url, { variant: 'thumb' });
            const shouldBypassOptimization =
              isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
            const isFailed = failedUrls[previewUrl] || failedUrls[url];

            return (
              <button
                key={`${url}-${index}`}
                type='button'
                onClick={() => {
                  if (!isFailed) onImageClick(index);
                }}
                className='group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border border-[#abd1c6]/20 text-left transition-colors hover:border-[#f9bc60]'
                aria-label={`Открыть фото ${index + 1}`}
              >
                {isFailed ? (
                  <div className='flex h-full w-full items-center justify-center rounded-xl border border-[#abd1c6]/20 text-xs text-white/70'>
                    Фото недоступно
                  </div>
                ) : (
                  <Image
                    src={previewUrl}
                    alt={`Фото ${index + 1}`}
                    fill
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 160px'
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    unoptimized={shouldBypassOptimization}
                    onError={() =>
                      setFailedUrls((prev) => ({
                        ...prev,
                        [previewUrl]: true,
                        [url]: true,
                      }))
                    }
                  />
                )}
                <div className='absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/20'>
                  <svg
                    className='h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-8 sm:w-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
