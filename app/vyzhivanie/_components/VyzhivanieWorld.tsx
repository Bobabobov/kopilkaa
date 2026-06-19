'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  drawGraveyard,
  type GraveyardScanPulse,
} from '@/lib/vyzhivanie/graveyardRender';
import { useGraveyardPan } from '@/hooks/vyzhivanie/useGraveyardPan';
import { useVyzhivanieStageSize } from '@/hooks/vyzhivanie/useVyzhivanieStageSize';
import type { TontineGrave, TontineStatusResponse } from '../types';
import { VyzhivanieGameHud } from './VyzhivanieGameHud';

type Props = {
  data: TontineStatusResponse;
  loading: boolean;
  onJoin: () => void;
  onCheckIn: () => void;
  onOpenStart: () => void;
  onFocusMyGrave?: () => void;
  onRefreshGraves?: () => void;
  hideHud?: boolean;
  focusMyGraveToken?: number;
};

function getUserGrave(data: TontineStatusResponse): TontineGrave | null {
  const { user } = data;
  if (!user.joined) return null;
  if (user.status !== 'ELIMINATED') return null;

  return (
    data.graves.find((grave) => grave.id === user.participantId) ?? null
  );
}

function findGraveAtPoint(
  graves: TontineGrave[],
  worldX: number,
  worldY: number,
): TontineGrave | null {
  for (let index = graves.length - 1; index >= 0; index -= 1) {
    const grave = graves[index];
    if (
      worldX >= grave.x - 20 &&
      worldX <= grave.x + 88 &&
      worldY >= grave.y - 36 &&
      worldY <= grave.y + 112
    ) {
      return grave;
    }
  }

  return null;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'button, a, input, textarea, select, [role="button"], [data-map-control="true"]',
    ),
  );
}

export function VyzhivanieWorld({
  data,
  loading,
  onJoin,
  onCheckIn,
  onOpenStart,
  onFocusMyGrave,
  onRefreshGraves,
  hideHud = false,
  focusMyGraveToken = 0,
}: Props) {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRafRef = useRef<number | null>(null);
  const cameraRef = useRef({ camX: 0, camY: 0, zoom: 1 });
  const gravesRef = useRef(data.graves ?? []);
  const hoveredGraveIdRef = useRef<string | null>(null);
  const highlightedGraveIdRef = useRef<string | null>(null);
  const focusHighlightTimeoutRef = useRef<number | null>(null);
  const scanPulsesRef = useRef<GraveyardScanPulse[]>([]);
  const scanPulseIdRef = useRef(0);
  const clickStartRef = useRef<{
    x: number;
    y: number;
    graveId: string | null;
  }>({
    x: 0,
    y: 0,
    graveId: null,
  });
  const [hoveredGraveId, setHoveredGraveId] = useState<string | null>(null);

  const { stage } = useVyzhivanieStageSize(shellRef);
  const { camX, camY, zoom, zoomIn, zoomOut, resetZoom, centerOn } =
    useGraveyardPan(containerRef);
  const hasEmptyGraveyard = data.graves.length === 0;
  const centeredGravesKeyRef = useRef<string | null>(null);

  useEffect(() => {
    cameraRef.current = { camX, camY, zoom };
  }, [camX, camY, zoom]);

  useEffect(() => {
    gravesRef.current = data.graves;
  }, [data.graves]);

  useEffect(() => {
    if (data.graves.length === 0) return;

    const gravesKey = data.graves.map((grave) => grave.id).join(',');
    if (centeredGravesKeyRef.current === gravesKey) return;
    centeredGravesKeyRef.current = gravesKey;

    const userGrave = getUserGrave(data);
    const targetGrave = userGrave ?? data.graves[data.graves.length - 1];
    if (!targetGrave) return;

    centerOn(targetGrave.x + 32, targetGrave.y + 52);
  }, [centerOn, data]);

  useEffect(() => {
    if (focusMyGraveToken <= 0) return;

    const userGrave = getUserGrave(data);
    if (!userGrave) return;

    centerOn(userGrave.x + 32, userGrave.y + 52);
    resetZoom();

    highlightedGraveIdRef.current = userGrave.id;

    const now = Date.now();
    scanPulsesRef.current = [
      ...scanPulsesRef.current.filter((pulse) => now - pulse.startedAt < 900),
      {
        id: ++scanPulseIdRef.current,
        x: userGrave.x + 32,
        y: userGrave.y + 40,
        startedAt: now,
      },
      {
        id: ++scanPulseIdRef.current,
        x: userGrave.x + 32,
        y: userGrave.y + 40,
        startedAt: now + 180,
      },
      {
        id: ++scanPulseIdRef.current,
        x: userGrave.x + 32,
        y: userGrave.y + 40,
        startedAt: now + 360,
      },
    ].slice(-8);

    if (focusHighlightTimeoutRef.current !== null) {
      window.clearTimeout(focusHighlightTimeoutRef.current);
    }

    focusHighlightTimeoutRef.current = window.setTimeout(() => {
      highlightedGraveIdRef.current = null;
      focusHighlightTimeoutRef.current = null;
    }, 5000);

    return () => {
      if (focusHighlightTimeoutRef.current !== null) {
        window.clearTimeout(focusHighlightTimeoutRef.current);
        focusHighlightTimeoutRef.current = null;
      }
    };
    // Только по клику «Моя могила» — не перехватывать камеру при панорамировании.
  }, [focusMyGraveToken, centerOn, resetZoom]);

  useEffect(() => {
    hoveredGraveIdRef.current = hoveredGraveId;
  }, [hoveredGraveId]);

  useEffect(() => {
    if (!onRefreshGraves) return;
    const id = window.setInterval(onRefreshGraves, 30_000);
    return () => window.clearInterval(id);
  }, [onRefreshGraves]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const localToWorld = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const camera = cameraRef.current;
      return {
        screenX: clientX - rect.left,
        screenY: clientY - rect.top,
        worldX: camera.camX + (clientX - rect.left) / camera.zoom,
        worldY: camera.camY + (clientY - rect.top) / camera.zoom,
      };
    };

    const getGraveFromEvent = (event: PointerEvent) => {
      const point = localToWorld(event.clientX, event.clientY);
      return {
        point,
        grave: findGraveAtPoint(gravesRef.current, point.worldX, point.worldY),
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isInteractiveTarget(event.target)) {
        if (hoveredGraveIdRef.current !== null) {
          hoveredGraveIdRef.current = null;
          setHoveredGraveId(null);
        }
        container.style.cursor = '';
        return;
      }

      const { grave } = getGraveFromEvent(event);
      const nextId = grave?.id ?? null;
      if (hoveredGraveIdRef.current !== nextId) {
        hoveredGraveIdRef.current = nextId;
        setHoveredGraveId(nextId);
        container.style.cursor = nextId ? 'pointer' : '';
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (isInteractiveTarget(event.target)) return;
      const { point, grave } = getGraveFromEvent(event);
      clickStartRef.current = {
        x: point.screenX,
        y: point.screenY,
        graveId: grave?.id ?? null,
      };
    };

    const onPointerUp = (event: PointerEvent) => {
      if (isInteractiveTarget(event.target)) return;
      const { point, grave } = getGraveFromEvent(event);
      const start = clickStartRef.current;
      const moved = Math.hypot(
        point.screenX - start.x,
        point.screenY - start.y,
      );

      if (
        moved <= 7 &&
        grave &&
        grave.id === start.graveId &&
        !grave.userId.startsWith('demo-')
      ) {
        router.push(`/profile/${grave.userId}`);
        return;
      }

      if (moved <= 7 && !grave) {
        scanPulseIdRef.current += 1;
        const now = Date.now();
        scanPulsesRef.current = [
          ...scanPulsesRef.current.filter(
            (pulse) => now - pulse.startedAt < 900,
          ),
          {
            id: scanPulseIdRef.current,
            x: point.worldX,
            y: point.worldY,
            startedAt: now,
          },
        ].slice(-8);
      }
    };

    const onPointerLeave = () => {
      hoveredGraveIdRef.current = null;
      setHoveredGraveId(null);
      container.style.cursor = '';
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.style.cursor = '';
    };
  }, [router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = false;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const render = () => {
      const ctx = canvas.getContext('2d');
      const rect = container.getBoundingClientRect();
      const camera = cameraRef.current;

      if (ctx && rect.width > 0 && rect.height > 0) {
        drawGraveyard({
          ctx,
          camX: camera.camX,
          camY: camera.camY,
          viewW: rect.width,
          viewH: rect.height,
          zoom: camera.zoom,
          graves: gravesRef.current,
          hoveredGraveId: hoveredGraveIdRef.current,
          highlightedGraveId: highlightedGraveIdRef.current,
          scanPulses: scanPulsesRef.current,
        });

        const now = Date.now();
        if (
          scanPulsesRef.current.some((pulse) => now - pulse.startedAt > 900)
        ) {
          scanPulsesRef.current = scanPulsesRef.current.filter(
            (pulse) => now - pulse.startedAt <= 900,
          );
        }
      }

      renderRafRef.current = requestAnimationFrame(render);
    };

    renderRafRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
    };
  }, []);

  return (
    <div ref={shellRef} className="relative h-full min-h-0 w-full">
      <div
        ref={containerRef}
        className="absolute inset-0 touch-none cursor-grab overflow-hidden bg-[#020403] active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-none select-none"
          aria-label="Кладбище выбывших игроков"
        />

        {hideHud ? null : (
          <VyzhivanieGameHud
            data={data}
            loading={loading}
            compact={stage.compact}
            onJoin={onJoin}
            onCheckIn={onCheckIn}
            onOpenStart={onOpenStart}
            onFocusMyGrave={onFocusMyGrave}
            hasEmptyGraveyard={hasEmptyGraveyard}
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
          />
        )}
      </div>
    </div>
  );
}
