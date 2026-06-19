'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { resolvePanCamera } from '@/lib/vyzhivanie/camera';
import { GRAVEYARD_HEIGHT_PX, GRAVEYARD_WIDTH_PX } from '@/lib/vyzhivanie/graveyard';

type PanState = {
  camX: number;
  camY: number;
  zoom: number;
};

type PointerPoint = {
  x: number;
  y: number;
};

const KEY_STEP = 64;
const MIN_ZOOM = 0.45;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 1.18;

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('button, a, input, textarea, select, [role="button"], [data-map-control="true"]'),
  );
}

export function useGraveyardPan(containerRef: RefObject<HTMLElement | null>) {
  const camRef = useRef<PanState>({ camX: 0, camY: 0, zoom: 1 });
  const [cam, setCam] = useState<PanState>(camRef.current);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; camX: number; camY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    camX: 0,
    camY: 0,
  });
  const pointersRef = useRef<Map<number, PointerPoint>>(new Map());
  const pinchRef = useRef<{
    active: boolean;
    distance: number;
    zoom: number;
    worldX: number;
    worldY: number;
  }>({
    active: false,
    distance: 0,
    zoom: 1,
    worldX: 0,
    worldY: 0,
  });

  const clampCam = useCallback((nextX: number, nextY: number, zoom = camRef.current.zoom) => {
    const el = containerRef.current;
    const viewW = el?.clientWidth ?? 800;
    const viewH = el?.clientHeight ?? 600;
    return resolvePanCamera(nextX, nextY, viewW, viewH, zoom);
  }, [containerRef]);

  const setCamera = useCallback((nextX: number, nextY: number, nextZoom = camRef.current.zoom) => {
    const zoom = clampZoom(nextZoom);
    const clamped = clampCam(nextX, nextY, zoom);
    const next = { camX: clamped.x, camY: clamped.y, zoom };
    camRef.current = next;
    setCam(next);
  }, [clampCam]);

  const zoomAt = useCallback((factor: number, screenX?: number, screenY?: number) => {
    const el = containerRef.current;
    const rect = el?.getBoundingClientRect();
    const current = camRef.current;
    const nextZoom = clampZoom(current.zoom * factor);

    const pivotX = screenX ?? (rect ? rect.width / 2 : 400);
    const pivotY = screenY ?? (rect ? rect.height / 2 : 300);
    const worldX = current.camX + pivotX / current.zoom;
    const worldY = current.camY + pivotY / current.zoom;

    setCamera(
      worldX - pivotX / nextZoom,
      worldY - pivotY / nextZoom,
      nextZoom,
    );
  }, [containerRef, setCamera]);

  const resetZoom = useCallback(() => {
    const current = camRef.current;
    setCamera(current.camX, current.camY, 1);
  }, [setCamera]);

  const getLocalPoint = useCallback((e: PointerEvent): PointerPoint => {
    const rect = containerRef.current?.getBoundingClientRect();
    return {
      x: rect ? e.clientX - rect.left : e.clientX,
      y: rect ? e.clientY - rect.top : e.clientY,
    };
  }, [containerRef]);

  const getPinchPair = useCallback((): [PointerPoint, PointerPoint] | null => {
    const points = Array.from(pointersRef.current.values());
    if (points.length < 2) return null;
    return [points[0], points[1]];
  }, []);

  const distanceBetween = useCallback((a: PointerPoint, b: PointerPoint): number => {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }, []);

  const midpoint = useCallback((a: PointerPoint, b: PointerPoint): PointerPoint => {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  }, []);

  const startPinch = useCallback(() => {
    const pair = getPinchPair();
    if (!pair) return;

    const [a, b] = pair;
    const center = midpoint(a, b);
    const current = camRef.current;
    pinchRef.current = {
      active: true,
      distance: Math.max(1, distanceBetween(a, b)),
      zoom: current.zoom,
      worldX: current.camX + center.x / current.zoom,
      worldY: current.camY + center.y / current.zoom,
    };
    dragRef.current.active = false;
  }, [distanceBetween, getPinchPair, midpoint]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
      zoomAt(factor, e.clientX - rect.left, e.clientY - rect.top);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isInteractiveTarget(e.target)) return;
      if (e.button !== 0) return;
      const point = getLocalPoint(e);
      pointersRef.current.set(e.pointerId, point);

      if (pointersRef.current.size >= 2) {
        startPinch();
        el.setPointerCapture(e.pointerId);
        return;
      }

      dragRef.current = {
        active: true,
        startX: point.x,
        startY: point.y,
        camX: camRef.current.camX,
        camY: camRef.current.camY,
      };
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, getLocalPoint(e));
      }

      if (pinchRef.current.active) {
        const pair = getPinchPair();
        if (!pair) return;

        const [a, b] = pair;
        const center = midpoint(a, b);
        const nextZoom = clampZoom(
          pinchRef.current.zoom * (distanceBetween(a, b) / pinchRef.current.distance),
        );

        setCamera(
          pinchRef.current.worldX - center.x / nextZoom,
          pinchRef.current.worldY - center.y / nextZoom,
          nextZoom,
        );
        return;
      }

      if (!dragRef.current.active) return;
      const point = getLocalPoint(e);
      const dx = (dragRef.current.startX - point.x) / camRef.current.zoom;
      const dy = (dragRef.current.startY - point.y) / camRef.current.zoom;
      setCamera(dragRef.current.camX + dx, dragRef.current.camY + dy);
    };

    const onPointerUp = (e: PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      dragRef.current.active = false;
      pinchRef.current.active = false;
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }

      if (pointersRef.current.size === 1) {
        const [remaining] = Array.from(pointersRef.current.values());
        dragRef.current = {
          active: true,
          startX: remaining.x,
          startY: remaining.y,
          camX: camRef.current.camX,
          camY: camRef.current.camY,
        };
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const keyMoves: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -KEY_STEP },
        w: { x: 0, y: -KEY_STEP },
        W: { x: 0, y: -KEY_STEP },
        ArrowDown: { x: 0, y: KEY_STEP },
        s: { x: 0, y: KEY_STEP },
        S: { x: 0, y: KEY_STEP },
        ArrowLeft: { x: -KEY_STEP, y: 0 },
        a: { x: -KEY_STEP, y: 0 },
        A: { x: -KEY_STEP, y: 0 },
        ArrowRight: { x: KEY_STEP, y: 0 },
        d: { x: KEY_STEP, y: 0 },
        D: { x: KEY_STEP, y: 0 },
      };

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomAt(ZOOM_STEP);
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomAt(1 / ZOOM_STEP);
        return;
      }
      if (e.key === '0') {
        e.preventDefault();
        resetZoom();
        return;
      }

      const move = keyMoves[e.key];
      if (!move) return;

      e.preventDefault();
      const current = camRef.current;
      setCamera(
        current.camX + move.x / current.zoom,
        current.camY + move.y / current.zoom,
      );
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [
    containerRef,
    distanceBetween,
    getLocalPoint,
    getPinchPair,
    midpoint,
    resetZoom,
    setCamera,
    startPinch,
    zoomAt,
  ]);

  useEffect(() => {
    setCamera(camRef.current.camX, camRef.current.camY);
  }, [setCamera]);

  const centerOn = useCallback((x: number, y: number) => {
    const el = containerRef.current;
    const viewW = el?.clientWidth ?? 800;
    const viewH = el?.clientHeight ?? 600;
    setCamera(
      x - viewW / 2 / camRef.current.zoom,
      y - viewH / 2 / camRef.current.zoom,
    );
  }, [containerRef, setCamera]);

  return {
    camX: cam.camX,
    camY: cam.camY,
    zoom: cam.zoom,
    zoomIn: () => zoomAt(ZOOM_STEP),
    zoomOut: () => zoomAt(1 / ZOOM_STEP),
    resetZoom,
    centerOn,
    graveyardSize: { width: GRAVEYARD_WIDTH_PX, height: GRAVEYARD_HEIGHT_PX },
  };
}
