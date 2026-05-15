'use client';

import { Children, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const CAROUSEL_NAV = cn(
  'h-9 w-9 rounded-full border border-[#abd1c6]/35 bg-[#001e1d]/95 text-[#f9bc60]',
  'shadow-[0_4px_16px_rgba(0,0,0,0.35)]',
  'hover:bg-[#001e1d] hover:border-[#f9bc60]/50',
  'disabled:opacity-25',
);

interface HomeSectionLayoutProps {
  children: ReactNode;
  /** Подпись региона для скринридеров */
  ariaLabel: string;
  /** Классы сетки на md+ */
  gridClassName?: string;
  /** Ширина слайда на мобильных (Tailwind basis-*) */
  slideBasis?: string;
}

/**
 * Мобильные: карусель shadcn (Embla). Десктоп (md+): обычная сетка.
 */
export function HomeSectionLayout({
  children,
  ariaLabel,
  gridClassName = 'md:grid-cols-3',
  slideBasis = 'basis-[90%]',
}: HomeSectionLayoutProps) {
  const items = Children.toArray(children);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="md:hidden" aria-label={ariaLabel}>
        <Carousel
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
          }}
          className="w-full px-10"
        >
          <CarouselContent className="-ml-3">
            {items.map((child, index) => (
              <CarouselItem
                key={index}
                className={cn('pl-3', slideBasis)}
              >
                {child}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            className={cn(
              CAROUSEL_NAV,
              'left-0 top-1/2 -translate-y-1/2 border-[#abd1c6]/35',
            )}
          />
          <CarouselNext
            variant="outline"
            className={cn(
              CAROUSEL_NAV,
              'right-0 top-1/2 -translate-y-1/2 border-[#abd1c6]/35',
            )}
          />
        </Carousel>
      </div>

      <div
        className={cn('hidden md:grid gap-6 lg:gap-8', gridClassName)}
        aria-label={ariaLabel}
      >
        {items.map((child, index) => (
          <div key={index} className="min-w-0">
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
