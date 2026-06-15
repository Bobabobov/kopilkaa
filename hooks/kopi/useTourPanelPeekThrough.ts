'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SCROLL_SETTLE_MS = 220;

/**
 * Во время скролла/свайпа панель экскурсии уходит в прозрачность,
 * при остановке или наведении — снова становится читаемой.
 */
export function useTourPanelPeekThrough(
  isActive: boolean,
  stepKey?: string | number,
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isPageMoving, setIsPageMoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const settleTimerRef = useRef<number | null>(null);
  const suppressScrollUntilRef = useRef(0);

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const setHoverFromPoint = useCallback((clientX: number, clientY: number) => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    setIsHovered(inside);
  }, []);

  const markPageMoving = useCallback(() => {
    if (Date.now() < suppressScrollUntilRef.current) return;

    // После клика «Далее» курсор остаётся над панелью — без сброса peek не включается.
    setIsHovered(false);
    setIsPageMoving(true);
    clearSettleTimer();
    settleTimerRef.current = window.setTimeout(() => {
      setIsPageMoving(false);
      settleTimerRef.current = null;
    }, SCROLL_SETTLE_MS);
  }, [clearSettleTimer]);

  useEffect(() => {
    setIsHovered(false);
    setIsPageMoving(false);
    clearSettleTimer();
    suppressScrollUntilRef.current = Date.now() + 450;
  }, [stepKey, clearSettleTimer]);

  useEffect(() => {
    if (!isActive) {
      setIsPageMoving(false);
      setIsHovered(false);
      clearSettleTimer();
      return;
    }

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      setHoverFromPoint(touch.clientX, touch.clientY);
    };

    // capture: scroll не всплывает — ловим скролл внутри overflow-контейнеров (профиль и т.п.)
    document.addEventListener('scroll', markPageMoving, {
      passive: true,
      capture: true,
    });
    window.addEventListener('wheel', markPageMoving, { passive: true });
    window.addEventListener('touchmove', markPageMoving, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      document.removeEventListener('scroll', markPageMoving, { capture: true });
      window.removeEventListener('wheel', markPageMoving);
      window.removeEventListener('touchmove', markPageMoving);
      window.removeEventListener('touchstart', onTouchStart);
      clearSettleTimer();
    };
  }, [isActive, markPageMoving, clearSettleTimer, setHoverFromPoint]);

  useEffect(() => {
    if (!isActive || !isPageMoving) return;

    const updateHoverFromPointer = (event: PointerEvent) => {
      setHoverFromPoint(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', updateHoverFromPointer, {
      passive: true,
    });

    return () => {
      window.removeEventListener('pointermove', updateHoverFromPointer);
    };
  }, [isActive, isPageMoving, setHoverFromPoint]);

  const isPeekMode = isPageMoving && !isHovered;

  const panelInteractionProps = {
    ref: panelRef,
    onPointerEnter: () => setIsHovered(true),
    onPointerLeave: () => setIsHovered(false),
  };

  return { isPeekMode, panelInteractionProps, panelRef };
};
