"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type DragState = {
  active: boolean;
  startX: number;
  startScrollLeft: number;
  pointerId: number | null;
};

const INITIAL_DRAG_STATE: DragState = {
  active: false,
  startX: 0,
  startScrollLeft: 0,
  pointerId: null,
};

/**
 * Горизонтальная прокрутка: Shift + колёсико и перетаскивание мышью.
 */
export function useHorizontalScrollPan() {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState>(INITIAL_DRAG_STATE);
  const [isDragging, setIsDragging] = useState(false);

  const canScrollHorizontally = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return false;
    }

    return el.scrollWidth > el.clientWidth + 1;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (!event.shiftKey || !canScrollHorizontally()) {
        return;
      }

      event.preventDefault();
      const delta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [canScrollHorizontally]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      const el = ref.current;
      if (!el || !canScrollHorizontally()) {
        return;
      }

      dragState.current = {
        active: true,
        startX: event.clientX,
        startScrollLeft: el.scrollLeft,
        pointerId: event.pointerId,
      };
      setIsDragging(true);
      el.setPointerCapture(event.pointerId);
    },
    [canScrollHorizontally],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      const state = dragState.current;

      if (!el || !state.active || state.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      const deltaX = event.clientX - state.startX;
      el.scrollLeft = state.startScrollLeft - deltaX;
    },
    [],
  );

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const state = dragState.current;

    if (!el || !state.active || state.pointerId !== event.pointerId) {
      return;
    }

    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    dragState.current = INITIAL_DRAG_STATE;
    setIsDragging(false);
  }, []);

  return {
    ref,
    isDragging,
    scrollProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
