"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type CarouselEdges = { left: boolean; right: boolean };

/**
 * Бесконечная горизонтальная лента: две одинаковые копии контента.
 * При scrollLeft >= половины scrollWidth сдвигаем на -half (бесшовный цикл).
 *
 * На очень широких экранах maxScroll может быть < half — тогда цикл не срабатывал.
 * useLayoutEffect добавляет симметричный min-width копиям, чтобы половина трека
 * всегда была достижима при наличии горизонтального скролла.
 */
export function useTopStoriesCarousel(storyCount: number) {
  const stripRef = useRef<HTMLDivElement>(null);
  const metricsRafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const suppressCardClickRef = useRef(false);
  /** Без немедленного setPointerCapture — иначе на ПК теряется click по карточкам (события уходят на ленту). Захват и скролл только после порога «перетаскивания». */
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    captured: false,
  });

  const DRAG_PX = 14;

  const [edges, setEdges] = useState<CarouselEdges>({
    left: false,
    right: true,
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncScrollMetrics = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = Math.max(0, scrollWidth - clientWidth);
    setEdges({
      left: scrollLeft > 6,
      right: max > 0 && scrollLeft < max - 6,
    });
    setScrollProgress(max > 0 ? scrollLeft / max : 0);

    if (storyCount > 0) {
      const half = scrollWidth / 2;
      const normalized =
        half > 1 ? ((scrollLeft % half) + half) % half : scrollLeft;
      const first = el.querySelector('[role="listitem"]') as HTMLElement | null;
      const cs = getComputedStyle(el);
      const gap = parseInt(cs.columnGap || cs.gap || "20", 10) || 20;
      const stride = (first?.offsetWidth ?? 280) + gap;
      if (stride > 0) {
        const idx = Math.round(normalized / stride) % storyCount;
        setActiveIndex(
          Number.isFinite(idx) ? Math.max(0, Math.min(storyCount - 1, idx)) : 0,
        );
      }
    }
  }, [storyCount]);

  /** Бесшовный цикл: при быстром скролле может понадобиться несколько шагов за один проход */
  const loopScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el || storyCount < 1) return;
    const half = el.scrollWidth / 2;
    if (half <= 1) return;
    let guard = 0;
    while (el.scrollLeft >= half - 1.5 && guard < 24) {
      el.scrollLeft -= half;
      guard += 1;
    }
  }, [storyCount]);

  /** Не вызываем setState на каждый scroll — только раз за кадр (меньше лагов при свайпе) */
  const scheduleMetricsSync = useCallback(() => {
    if (metricsRafRef.current != null) return;
    metricsRafRef.current = requestAnimationFrame(() => {
      metricsRafRef.current = null;
      syncScrollMetrics();
    });
  }, [syncScrollMetrics]);

  const handleStripScroll = useCallback(() => {
    loopScroll();
    scheduleMetricsSync();
  }, [loopScroll, scheduleMetricsSync]);

  /**
   * Если maxScroll < half (очень широкое окно), зациклить нельзя.
   * Симметричный padding у каждой копии увеличивает scrollWidth до >= 2*cw.
   */
  const balanceTrackForLoop = useCallback(() => {
    const el = stripRef.current;
    if (!el || storyCount < 1) return;
    const cw = el.clientWidth;
    const copies = el.querySelectorAll<HTMLElement>("[data-top-copy]");
    copies.forEach((node) => {
      node.style.paddingLeft = "";
      node.style.paddingRight = "";
    });
    void el.offsetWidth;
    const sw = el.scrollWidth;
    if (sw <= cw) return;
    const shortage = 2 * cw - sw;
    if (shortage <= 0) return;
    const pad = shortage / 4;
    copies.forEach((node) => {
      node.style.paddingLeft = `${pad}px`;
      node.style.paddingRight = `${pad}px`;
    });
  }, [storyCount]);

  useLayoutEffect(() => {
    balanceTrackForLoop();
    syncScrollMetrics();
  }, [balanceTrackForLoop, syncScrollMetrics, storyCount]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleStripScroll, { passive: true });
    syncScrollMetrics();
    return () => {
      el.removeEventListener("scroll", handleStripScroll);
      if (metricsRafRef.current != null) {
        cancelAnimationFrame(metricsRafRef.current);
        metricsRafRef.current = null;
      }
    };
  }, [handleStripScroll, syncScrollMetrics]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el || storyCount < 1) return;
    const onWheel = (e: WheelEvent) => {
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (maxScroll <= 1) return;

      let delta = 0;
      let verticalWheel = false;
      if (e.shiftKey) {
        delta = e.deltaY;
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        delta = e.deltaX;
      } else {
        delta = e.deltaY;
        verticalWheel = true;
      }
      if (delta === 0) return;

      const sl = el.scrollLeft;

      if (verticalWheel) {
        // Вертикальное колесо: перехватываем только пока лента реально может ехать в эту сторону; иначе — скролл страницы
        if (delta > 0 && sl < maxScroll - 0.5) {
          e.preventDefault();
          el.scrollLeft += delta;
        } else if (delta < 0 && sl > 0.5) {
          e.preventDefault();
          el.scrollLeft += delta;
        }
        return;
      }

      // Shift или горизонтальный жест трекпада: лента; у края не блокируем страницу
      if (delta > 0 && sl >= maxScroll - 0.5) return;
      if (delta < 0 && sl <= 0.5) return;
      e.preventDefault();
      el.scrollLeft += delta;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [storyCount]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (resizeRafRef.current != null) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        balanceTrackForLoop();
        syncScrollMetrics();
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (resizeRafRef.current != null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [balanceTrackForLoop, syncScrollMetrics, storyCount]);

  const scrollStripByCards = useCallback((direction: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    const first = el.querySelector('[role="listitem"]') as HTMLElement | null;
    const cardW = first?.offsetWidth ?? 300;
    const cs = getComputedStyle(el);
    const gap = parseInt(cs.columnGap || cs.gap || "20", 10) || 20;
    el.scrollBy({
      left: direction * (cardW + gap),
      behavior: "auto",
    });
  }, []);

  const onStripPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = stripRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      captured: false,
    };
  };

  const onStripPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const el = stripRef.current;
    if (!el) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > DRAG_PX) {
      dragRef.current.moved = true;
      if (!dragRef.current.captured) {
        dragRef.current.captured = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
    }
    if (dragRef.current.moved) {
      el.scrollLeft = dragRef.current.startScroll - dx;
    }
  };

  const endStripDrag = (e?: React.PointerEvent) => {
    const moved = dragRef.current.moved;
    const captured = dragRef.current.captured;
    dragRef.current.active = false;
    dragRef.current.moved = false;
    dragRef.current.captured = false;
    if (moved) suppressCardClickRef.current = true;
    try {
      if (
        captured &&
        e?.pointerId != null &&
        stripRef.current?.releasePointerCapture
      ) {
        stripRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }
  };

  return {
    stripRef,
    edges,
    scrollProgress,
    activeIndex,
    scrollStripByCards,
    suppressCardClickRef,
    onStripPointerDown,
    onStripPointerMove,
    endStripDrag,
  };
}
