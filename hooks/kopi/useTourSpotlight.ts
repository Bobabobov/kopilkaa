'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTourStepTargetSelector } from '@/lib/kopi/tourSteps';

export interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const MEASURE_RETRY_MS = 180;
const MAX_MEASURE_ATTEMPTS = 14;
const SCROLL_SETTLE_MS = 320;

export function useTourSpotlight(
  isActive: boolean,
  targetKey: string | undefined,
  stepKey?: string | number,
  padding = 12,
) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const [isTargetFound, setIsTargetFound] = useState(false);
  const retryTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  const measure = useCallback(() => {
    if (!targetKey) {
      setRect(null);
      setIsTargetFound(false);
      return false;
    }

    const element = document.querySelector(getTourStepTargetSelector(targetKey));
    if (!element) {
      setRect(null);
      setIsTargetFound(false);
      return false;
    }

    const domRect = element.getBoundingClientRect();
    if (domRect.width < 2 || domRect.height < 2) {
      setIsTargetFound(false);
      return false;
    }

    setRect({
      top: domRect.top - padding,
      left: domRect.left - padding,
      width: domRect.width + padding * 2,
      height: domRect.height + padding * 2,
    });
    setIsTargetFound(true);
    return true;
  }, [padding, targetKey]);

  useEffect(() => {
    if (!isActive || !targetKey) {
      clearTimers();
      setRect(null);
      setIsTargetFound(false);
      return;
    }

    let attempts = 0;

    const scheduleMeasure = (delay = 0) => {
      clearTimers();
      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null;
        const found = measure();
        if (!found && attempts < MAX_MEASURE_ATTEMPTS) {
          attempts += 1;
          scheduleMeasure(MEASURE_RETRY_MS);
        }
      }, delay);
    };

    const element = document.querySelector(getTourStepTargetSelector(targetKey));
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      scrollTimerRef.current = window.setTimeout(() => {
        scrollTimerRef.current = null;
        scheduleMeasure(80);
      }, SCROLL_SETTLE_MS);
    } else {
      scheduleMeasure(120);
    }

    const onLayout = () => measure();
    window.addEventListener('resize', onLayout);
    document.addEventListener('scroll', onLayout, { capture: true, passive: true });

    return () => {
      clearTimers();
      window.removeEventListener('resize', onLayout);
      document.removeEventListener('scroll', onLayout, { capture: true });
    };
  }, [isActive, targetKey, stepKey, measure, clearTimers]);

  return { rect, isTargetFound };
}
