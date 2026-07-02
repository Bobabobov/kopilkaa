'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ChartBoxSize {
  width: number;
  height: number;
}

interface ChartMeasureBoxProps {
  className?: string;
  children: (size: ChartBoxSize) => ReactNode;
}

/** Контейнер с измерением размеров — график монтируется только при width/height > 0. */
export function ChartMeasureBox({ className, children }: ChartMeasureBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartBoxSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      if (width > 0 && height > 0) {
        setSize((prev) =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height },
        );
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn('w-full min-w-0', className)}>
      {size.width > 0 && size.height > 0 ? children(size) : null}
    </div>
  );
}
