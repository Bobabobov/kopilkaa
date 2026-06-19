import type { TontineGraveDto } from '@/lib/tontine/worldPosition';
import {
  formatGraveDate,
  formatGraveDateCompact,
} from '@/lib/vyzhivanie/graveyard';

const BG = '#02030a';
const PANEL = '#07111f';
const PANEL_DARK = '#030712';
const NEON_CYAN = '#22d3ee';
const NEON_PINK = '#f472b6';
const NEON_PURPLE = '#8b5cf6';
const NEON_RED = '#ef4444';
const NAME_COLOR = '#e0f2fe';
const DATE_COLOR = '#94a3b8';
const SECTOR_W = 960;
const SECTOR_H = 720;

type DrawGraveyardOptions = {
  ctx: CanvasRenderingContext2D;
  camX: number;
  camY: number;
  viewW: number;
  viewH: number;
  zoom: number;
  graves: TontineGraveDto[];
  hoveredGraveId?: string | null;
  highlightedGraveId?: string | null;
  scanPulses?: GraveyardScanPulse[];
};

export type GraveyardScanPulse = {
  id: number;
  x: number;
  y: number;
  startedAt: number;
};

function hash(col: number, row: number, salt = 0): number {
  return ((col * 92837111) ^ (row * 689287499) ^ salt) >>> 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function truncateLabel(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function drawDigitalTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  worldCol: number,
  worldRow: number,
  zoom: number,
) {
  const variant = worldCol + worldRow;
  const tileSize = 32 * zoom;
  ctx.fillStyle = variant % 2 === 0 ? '#030712' : '#050b16';
  ctx.fillRect(x, y, tileSize, tileSize);

  const h = hash(worldCol, worldRow, variant);
  ctx.strokeStyle = 'rgba(34,211,238,0.08)';
  ctx.lineWidth = Math.max(1, zoom);
  ctx.strokeRect(x, y, tileSize, tileSize);

  if (h % 5 === 0) {
    ctx.fillStyle =
      h % 2 === 0 ? 'rgba(34,211,238,0.18)' : 'rgba(244,114,182,0.16)';
    ctx.fillRect(x + 4 * zoom, y + 7 * zoom, 18 * zoom, 2 * zoom);
    ctx.fillRect(x + 4 * zoom, y + 7 * zoom, 2 * zoom, 12 * zoom);
  }

  if (h % 13 === 0) {
    ctx.fillStyle = 'rgba(139,92,246,0.2)';
    ctx.fillRect(x + 22 * zoom, y + 18 * zoom, 7 * zoom, 2 * zoom);
    ctx.fillRect(x + 27 * zoom, y + 18 * zoom, 2 * zoom, 9 * zoom);
  }

  if (h % 29 === 0) {
    ctx.fillStyle = 'rgba(248,113,113,0.12)';
    ctx.fillRect(x + 12 * zoom, y + 5 * zoom, 2 * zoom, 22 * zoom);
  }

  if (h % 41 === 0) {
    ctx.fillStyle = 'rgba(245,158,11,0.12)';
    ctx.fillRect(x + 7 * zoom, y + 24 * zoom, 19 * zoom, 1.5 * zoom);
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
  time: number,
) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, viewW, viewH);

  const gradient = ctx.createRadialGradient(
    viewW * 0.5,
    viewH * 0.28,
    20,
    viewW * 0.5,
    viewH * 0.45,
    Math.max(viewW, viewH),
  );
  gradient.addColorStop(0, 'rgba(34,211,238,0.12)');
  gradient.addColorStop(0.38, 'rgba(139,92,246,0.06)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, viewW, viewH);

  drawDistantHaze(ctx, viewW, viewH);

  const startCol = Math.floor(camX / 32);
  const startRow = Math.floor(camY / 32);
  const endCol = Math.ceil((camX + viewW / zoom) / 32) + 1;
  const endRow = Math.ceil((camY + viewH / zoom) / 32) + 1;

  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const x = (col * 32 - camX) * zoom;
      const y = (row * 32 - camY) * zoom;
      drawDigitalTile(ctx, x, y, col, row, zoom);
    }
  }

  drawSectorCorridors(ctx, camX, camY, viewW, viewH, zoom);
  drawBuriedCables(ctx, camX, camY, viewW, viewH, zoom);
  drawGroundDamage(ctx, camX, camY, viewW, viewH, zoom);
  drawWarningMarks(ctx, camX, camY, viewW, viewH, zoom);
  drawDataStreams(ctx, camX, camY, viewW, viewH, zoom, time);
  drawAshParticles(ctx, camX, camY, viewW, viewH, zoom, time);
}

function drawDistantHaze(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
) {
  const horizon = ctx.createLinearGradient(0, 0, 0, viewH);
  horizon.addColorStop(0, 'rgba(15,23,42,0.56)');
  horizon.addColorStop(0.34, 'rgba(2,6,23,0.16)');
  horizon.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.save();
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = 'rgba(34,211,238,0.28)';
  ctx.fillRect(0, Math.floor(viewH * 0.18), viewW, 1);
  ctx.fillStyle = 'rgba(244,114,182,0.18)';
  ctx.fillRect(0, Math.floor(viewH * 0.18) + 8, viewW, 1);
  ctx.restore();
}

function drawSectorCorridors(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
) {
  const worldLeft = camX;
  const worldTop = camY;
  const worldRight = camX + viewW / zoom;
  const worldBottom = camY + viewH / zoom;
  const startCol = Math.floor(worldLeft / SECTOR_W) - 1;
  const endCol = Math.ceil(worldRight / SECTOR_W) + 1;
  const startRow = Math.floor(worldTop / SECTOR_H) - 1;
  const endRow = Math.ceil(worldBottom / SECTOR_H) + 1;

  ctx.save();
  ctx.lineWidth = Math.max(1, 2 * zoom);

  for (let col = startCol; col <= endCol; col += 1) {
    const x = (col * SECTOR_W - camX) * zoom;
    const pulse = hash(col, 17) % 2 === 0 ? NEON_CYAN : NEON_PURPLE;
    ctx.fillStyle = 'rgba(2,6,23,0.72)';
    ctx.fillRect(x - 18 * zoom, 0, 36 * zoom, viewH);
    ctx.strokeStyle =
      pulse === NEON_CYAN ? 'rgba(34,211,238,0.42)' : 'rgba(139,92,246,0.38)';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, viewH);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(x + 12 * zoom, 0);
    ctx.lineTo(x + 12 * zoom, viewH);
    ctx.stroke();

    ctx.fillStyle = 'rgba(148,163,184,0.34)';
    ctx.font = `${clamp(8 * zoom, 7, 11)}px ui-monospace, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(
      `SEC-${Math.abs(col).toString().padStart(2, '0')}`,
      x + 18 * zoom,
      18,
    );
  }

  for (let row = startRow; row <= endRow; row += 1) {
    const y = (row * SECTOR_H - camY) * zoom;
    ctx.fillStyle = 'rgba(2,6,23,0.64)';
    ctx.fillRect(0, y - 14 * zoom, viewW, 28 * zoom);
    ctx.strokeStyle = 'rgba(244,114,182,0.34)';
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewW, y);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(0, y + 10 * zoom);
    ctx.lineTo(viewW, y + 10 * zoom);
    ctx.stroke();

    ctx.fillStyle = 'rgba(244,114,182,0.32)';
    ctx.font = `${clamp(8 * zoom, 7, 11)}px ui-monospace, monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(
      `ROW-${Math.abs(row).toString().padStart(2, '0')}`,
      viewW - 16,
      y - 8 * zoom,
    );
  }
  ctx.restore();
}

function drawBuriedCables(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
) {
  const worldLeft = camX;
  const worldTop = camY;
  const worldRight = camX + viewW / zoom;
  const worldBottom = camY + viewH / zoom;
  const startCol = Math.floor(worldLeft / 360) - 1;
  const endCol = Math.ceil(worldRight / 360) + 1;
  const startRow = Math.floor(worldTop / 260) - 1;
  const endRow = Math.ceil(worldBottom / 260) + 1;

  ctx.save();
  ctx.lineWidth = Math.max(1, 1.4 * zoom);

  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const h = hash(col, row, 91);
      if (h % 4 === 0) continue;

      const x1 = (col * 360 + (h % 70) - camX) * zoom;
      const y1 = (row * 260 + ((h >> 5) % 80) - camY) * zoom;
      const x2 = x1 + (180 + (h % 140)) * zoom;
      const y2 = y1 + (((h >> 7) % 90) - 45) * zoom;
      const color =
        h % 3 === 0 ? 'rgba(34,211,238,0.16)' : 'rgba(139,92,246,0.14)';

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(
        x1 + 54 * zoom,
        y1 - 28 * zoom,
        x2 - 50 * zoom,
        y2 + 26 * zoom,
        x2,
        y2,
      );
      ctx.stroke();

      if (h % 7 === 0) {
        ctx.fillStyle = 'rgba(245,158,11,0.24)';
        ctx.fillRect(x2 - 3 * zoom, y2 - 3 * zoom, 6 * zoom, 6 * zoom);
      }
    }
  }

  ctx.restore();
}

function drawGroundDamage(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
) {
  const cell = 384;
  const worldLeft = camX;
  const worldTop = camY;
  const worldRight = camX + viewW / zoom;
  const worldBottom = camY + viewH / zoom;
  const startCol = Math.floor(worldLeft / cell) - 1;
  const endCol = Math.ceil(worldRight / cell) + 1;
  const startRow = Math.floor(worldTop / cell) - 1;
  const endRow = Math.ceil(worldBottom / cell) + 1;

  ctx.save();
  ctx.lineCap = 'square';

  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const h = hash(col, row, 41);
      if (h % 2 !== 0) continue;

      const worldX = col * cell + 64 + (h % 210);
      const worldY = row * cell + 72 + ((h >> 8) % 210);
      if (
        worldX < worldLeft - 120 ||
        worldY < worldTop - 120 ||
        worldX > worldRight + 120 ||
        worldY > worldBottom + 120
      ) {
        continue;
      }

      const x = (worldX - camX) * zoom;
      const y = (worldY - camY) * zoom;
      const crackLength = 34 + (h % 42);

      ctx.strokeStyle =
        h % 3 === 0 ? 'rgba(34,211,238,0.18)' : 'rgba(148,163,184,0.13)';
      ctx.lineWidth = Math.max(1, 1.2 * zoom);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + crackLength * zoom, y + (((h >> 4) % 24) - 12) * zoom);
      ctx.lineTo(
        x + (crackLength + 22) * zoom,
        y + (((h >> 9) % 32) - 16) * zoom,
      );
      ctx.stroke();

      if (h % 5 === 0) {
        ctx.fillStyle = 'rgba(15,23,42,0.66)';
        ctx.fillRect(x - 10 * zoom, y + 14 * zoom, 66 * zoom, 8 * zoom);
        ctx.fillStyle = 'rgba(239,68,68,0.18)';
        ctx.fillRect(x - 6 * zoom, y + 17 * zoom, 18 * zoom, 2 * zoom);
        ctx.fillStyle = 'rgba(34,211,238,0.16)';
        ctx.fillRect(x + 18 * zoom, y + 17 * zoom, 30 * zoom, 2 * zoom);
      }
    }
  }
  ctx.restore();
}

function drawWarningMarks(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
) {
  const cell = 640;
  const worldLeft = camX;
  const worldTop = camY;
  const worldRight = camX + viewW / zoom;
  const worldBottom = camY + viewH / zoom;
  const startCol = Math.floor(worldLeft / cell) - 1;
  const endCol = Math.ceil(worldRight / cell) + 1;
  const startRow = Math.floor(worldTop / cell) - 1;
  const endRow = Math.ceil(worldBottom / cell) + 1;

  ctx.save();
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const h = hash(col, row, 203);
      if (h % 3 !== 0) continue;

      const worldX = col * cell + 92 + (h % 360);
      const worldY = row * cell + 90 + ((h >> 8) % 360);
      if (
        worldX < worldLeft - 100 ||
        worldY < worldTop - 100 ||
        worldX > worldRight + 100 ||
        worldY > worldBottom + 100
      ) {
        continue;
      }

      const x = (worldX - camX) * zoom;
      const y = (worldY - camY) * zoom;
      const width = 86 * zoom;
      const height = 12 * zoom;

      ctx.fillStyle = 'rgba(2,6,23,0.58)';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = 'rgba(245,158,11,0.22)';
      ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

      for (let stripe = 0; stripe < 6; stripe += 1) {
        ctx.fillStyle =
          stripe % 2 === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.12)';
        ctx.fillRect(
          x + (stripe * 14 + 4) * zoom,
          y + 3 * zoom,
          8 * zoom,
          6 * zoom,
        );
      }
    }
  }
  ctx.restore();
}

function drawDataStreams(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
  time: number,
) {
  const streamGap = 192 * zoom;
  const offsetX = -((camX * 0.35 + time * 18) % streamGap);
  const offsetY = -((camY * 0.2 + time * 12) % streamGap);

  ctx.save();
  ctx.globalAlpha = 0.3;
  for (let x = offsetX; x < viewW + streamGap; x += streamGap) {
    ctx.strokeStyle = 'rgba(34,211,238,0.22)';
    ctx.lineWidth = Math.max(1, 2 * zoom);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 80 * zoom, viewH);
    ctx.stroke();
  }

  for (let y = offsetY; y < viewH + streamGap; y += streamGap) {
    ctx.fillStyle = 'rgba(244,114,182,0.16)';
    ctx.fillRect(0, y, viewW, Math.max(1, 2 * zoom));
  }
  ctx.restore();
}

function drawAshParticles(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom: number,
  time: number,
) {
  const cell = 220;
  const worldLeft = camX;
  const worldTop = camY;
  const worldRight = camX + viewW / zoom;
  const worldBottom = camY + viewH / zoom;
  const startCol = Math.floor(worldLeft / cell) - 1;
  const endCol = Math.ceil(worldRight / cell) + 1;
  const startRow = Math.floor(worldTop / cell) - 1;
  const endRow = Math.ceil(worldBottom / cell) + 1;

  ctx.save();
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const h = hash(col, row, 137);
      const drift = (time * (10 + (h % 12))) % cell;
      const worldX = col * cell + (h % cell);
      const worldY = row * cell + ((h >> 8) % cell) + drift;
      const x = (worldX - camX) * zoom;
      const y = (worldY - camY) * zoom;
      const size = clamp((1 + (h % 4)) * zoom, 1, 4);
      const alpha = 0.1 + ((h >> 12) % 8) / 100;

      ctx.fillStyle =
        h % 3 === 0
          ? `rgba(34,211,238,${alpha})`
          : `rgba(148,163,184,${alpha})`;
      ctx.fillRect(x, y % (viewH + 20), size, size);
    }
  }
  ctx.restore();
}

function drawNeonGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = color;
  ctx.filter = 'blur(10px)';
  ctx.fillRect(x + 4, y + 8, 48, 58);
  ctx.restore();
}

function drawMemorialBase(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = 'rgba(2,6,23,0.86)';
  ctx.fillRect(x + 1, y + 64, 62, 10);
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.fillRect(x + 7, y + 58, 50, 10);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 7.5, y + 58.5, 49, 9);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(x + 12, y + 62, 40, 2);
}

function drawDataObelisk(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawNeonGlow(ctx, x, y, NEON_CYAN);
  drawMemorialBase(ctx, x, y, NEON_CYAN);
  ctx.fillStyle = PANEL_DARK;
  ctx.fillRect(x + 12, y + 10, 34, 52);
  ctx.fillStyle = PANEL;
  ctx.fillRect(x + 15, y + 7, 34, 52);
  ctx.fillStyle = NEON_CYAN;
  ctx.fillRect(x + 19, y + 13, 26, 3);
  ctx.fillRect(x + 20, y + 24, 18, 2);
  ctx.fillRect(x + 20, y + 31, 23, 2);
  ctx.fillRect(x + 20, y + 38, 11, 2);
  ctx.fillStyle = 'rgba(34,211,238,0.32)';
  ctx.fillRect(x + 11, y + 62, 46, 5);
  ctx.strokeStyle = NEON_CYAN;
  ctx.strokeRect(x + 15.5, y + 7.5, 33, 51);
}

function drawHoloCross(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawNeonGlow(ctx, x, y, NEON_PURPLE);
  drawMemorialBase(ctx, x, y, NEON_PURPLE);
  ctx.fillStyle = 'rgba(3,7,18,0.9)';
  ctx.fillRect(x + 13, y + 58, 42, 7);
  ctx.fillStyle = NEON_PURPLE;
  ctx.fillRect(x + 28, y + 10, 7, 49);
  ctx.fillRect(x + 15, y + 25, 33, 7);
  ctx.fillStyle = 'rgba(244,114,182,0.65)';
  ctx.fillRect(x + 32, y + 9, 3, 50);
  ctx.fillRect(x + 16, y + 29, 33, 3);
  ctx.fillStyle = 'rgba(34,211,238,0.7)';
  ctx.fillRect(x + 24, y + 17, 3, 10);
  ctx.fillRect(x + 38, y + 35, 3, 12);
}

function drawMemoryTerminal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
) {
  drawNeonGlow(ctx, x, y, NEON_PINK);
  drawMemorialBase(ctx, x, y, NEON_PINK);
  ctx.fillStyle = '#020617';
  ctx.fillRect(x + 6, y + 18, 48, 42);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 10, y + 14, 48, 42);
  ctx.strokeStyle = NEON_PINK;
  ctx.strokeRect(x + 10.5, y + 14.5, 47, 41);
  ctx.fillStyle = 'rgba(244,114,182,0.75)';
  ctx.fillRect(x + 16, y + 21, 33, 3);
  ctx.fillStyle = 'rgba(34,211,238,0.65)';
  ctx.fillRect(x + 16, y + 30, 17, 2);
  ctx.fillRect(x + 16, y + 36, 28, 2);
  ctx.fillRect(x + 16, y + 42, 11, 2);
  ctx.fillStyle = 'rgba(239,68,68,0.55)';
  ctx.fillRect(x + 44, y + 47, 9, 4);
}

function drawGlitchFragments(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number,
) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  for (let i = 0; i < 4; i += 1) {
    const h = hash(seed + i, seed - i);
    const color = i % 2 === 0 ? NEON_CYAN : NEON_RED;
    ctx.fillStyle = color;
    ctx.fillRect(
      x + ((h % 76) - 16),
      y + (((h >> 6) % 70) - 12),
      8 + (h % 16),
      1 + (h % 3),
    );
  }
  ctx.restore();
}

function drawGraveConnector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number,
  seed: number,
  isHovered: boolean,
) {
  const color = isHovered ? 'rgba(244,114,182,0.55)' : 'rgba(34,211,238,0.18)';
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, zoom);
  ctx.beginPath();
  ctx.moveTo(x + 32 * zoom, y + 68 * zoom);
  ctx.lineTo(x + (seed % 2 === 0 ? 84 : -38) * zoom, y + 68 * zoom);
  ctx.lineTo(x + (seed % 2 === 0 ? 84 : -38) * zoom, y + 92 * zoom);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillRect(
    x + (seed % 2 === 0 ? 80 : -42) * zoom,
    y + 88 * zoom,
    8 * zoom,
    8 * zoom,
  );
  ctx.restore();
}

function drawGraveShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number,
  isHovered: boolean,
) {
  ctx.save();
  ctx.fillStyle = isHovered ? 'rgba(34,211,238,0.16)' : 'rgba(0,0,0,0.36)';
  ctx.beginPath();
  ctx.ellipse(
    x + 32 * zoom,
    y + 73 * zoom,
    48 * zoom,
    14 * zoom,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

function drawTombstoneHoverFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number,
) {
  ctx.fillStyle = 'rgba(34,211,238,0.10)';
  ctx.fillRect(x - 20 * zoom, y - 34 * zoom, 104 * zoom, 138 * zoom);
  ctx.strokeStyle = 'rgba(34,211,238,0.9)';
  ctx.lineWidth = Math.max(1, 2 * zoom);
  ctx.strokeRect(x - 20 * zoom, y - 34 * zoom, 104 * zoom, 138 * zoom);
  ctx.strokeStyle = 'rgba(244,114,182,0.55)';
  ctx.strokeRect(x - 14 * zoom, y - 28 * zoom, 92 * zoom, 126 * zoom);

  ctx.fillStyle = 'rgba(245,158,11,0.78)';
  ctx.fillRect(x - 28 * zoom, y - 16 * zoom, 14 * zoom, 2 * zoom);
  ctx.fillRect(x - 28 * zoom, y - 16 * zoom, 2 * zoom, 14 * zoom);
  ctx.fillRect(x + 78 * zoom, y + 88 * zoom, 14 * zoom, 2 * zoom);
  ctx.fillRect(x + 90 * zoom, y + 76 * zoom, 2 * zoom, 14 * zoom);
}

function drawTombstoneShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number,
  isHovered: boolean,
) {
  ctx.save();
  ctx.fillStyle = isHovered ? 'rgba(34,211,238,0.14)' : 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.ellipse(
    x + 32 * zoom,
    y + 72 * zoom,
    50 * zoom,
    15 * zoom,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

function drawTombstoneNamePlate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: string,
  zoom: number,
  isHovered: boolean,
) {
  const plateW = 84 * zoom;
  const plateH = 18 * zoom;
  const plateX = x - 10 * zoom;
  const plateY = y - 30 * zoom;

  ctx.fillStyle = 'rgba(2,6,23,0.9)';
  ctx.fillRect(plateX, plateY, plateW, plateH);
  ctx.strokeStyle = isHovered ? NEON_PINK : 'rgba(34,211,238,0.55)';
  ctx.lineWidth = Math.max(1, zoom);
  ctx.strokeRect(plateX + 0.5, plateY + 0.5, plateW - 1, plateH - 1);

  ctx.fillStyle = isHovered ? NEON_PINK : NEON_CYAN;
  ctx.fillRect(x + 28 * zoom, y - 10 * zoom, 8 * zoom, 2 * zoom);

  ctx.textAlign = 'center';
  ctx.font = `bold ${Math.max(8, 10 * zoom)}px ui-monospace, monospace`;
  ctx.fillStyle = isHovered ? '#f0abfc' : NAME_COLOR;
  ctx.fillText(truncateLabel(name, 12), x + 32 * zoom, y - 17 * zoom);
}

function drawDigitalTombstoneMonument(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number,
  isHovered: boolean,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(zoom, zoom);

  const glowColor = isHovered ? 'rgba(244,114,182,0.55)' : 'rgba(244,114,182,0.32)';
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = glowColor;
  ctx.filter = 'blur(8px)';
  ctx.fillRect(8, 8, 48, 58);
  ctx.restore();

  ctx.fillStyle = 'rgba(2,6,23,0.92)';
  ctx.fillRect(4, 58, 56, 12);
  ctx.fillStyle = 'rgba(15,23,42,0.95)';
  ctx.fillRect(10, 54, 44, 10);
  ctx.strokeStyle = isHovered ? NEON_PINK : 'rgba(244,114,182,0.7)';
  ctx.lineWidth = 1;
  ctx.strokeRect(10.5, 54.5, 43, 9);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(14, 58, 36, 2);

  ctx.fillStyle = '#020617';
  ctx.fillRect(4, 16, 52, 44);
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(8, 12, 52, 44);
  ctx.strokeStyle = isHovered ? NEON_PINK : NEON_PINK;
  ctx.strokeRect(8.5, 12.5, 51, 43);

  ctx.fillStyle = 'rgba(244,114,182,0.85)';
  ctx.fillRect(14, 18, 36, 3);
  ctx.fillStyle = 'rgba(34,211,238,0.75)';
  ctx.fillRect(14, 27, 20, 2);
  ctx.fillRect(14, 33, 30, 2);
  ctx.fillRect(14, 39, 12, 2);
  ctx.fillStyle = 'rgba(239,68,68,0.75)';
  ctx.fillRect(42, 44, 10, 4);

  ctx.strokeStyle = 'rgba(34,211,238,0.35)';
  ctx.beginPath();
  ctx.moveTo(8, 12);
  ctx.lineTo(20, 4);
  ctx.lineTo(52, 4);
  ctx.lineTo(60, 12);
  ctx.stroke();

  ctx.fillStyle = 'rgba(34,211,238,0.22)';
  ctx.fillRect(6, 62, 48, 4);

  drawGlitchFragments(ctx, 0, 0, 17);
  ctx.restore();
}

function drawTombstoneDates(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  grave: TontineGraveDto,
  zoom: number,
  isHovered: boolean,
) {
  const useCompact = zoom < 0.95;
  const format = useCompact ? formatGraveDateCompact : formatGraveDate;
  const joinedText = `вошёл: ${format(grave.joinedAt)}`;
  const eliminatedText = `выбыл: ${format(grave.eliminatedAt)}`;
  const fontSize = Math.max(7, 8 * zoom);

  ctx.textAlign = 'center';
  ctx.font = `${fontSize}px ui-monospace, monospace`;

  ctx.fillStyle = 'rgba(2,6,23,0.82)';
  ctx.fillRect(x - 8 * zoom, y + 78 * zoom, 82 * zoom, 30 * zoom);
  ctx.strokeStyle = isHovered
    ? 'rgba(244,114,182,0.35)'
    : 'rgba(34,211,238,0.22)';
  ctx.lineWidth = Math.max(1, zoom);
  ctx.strokeRect(x - 8 * zoom, y + 78 * zoom, 82 * zoom, 30 * zoom);

  ctx.fillStyle = isHovered ? '#a5f3fc' : 'rgba(34,211,238,0.9)';
  ctx.fillText(
    truncateLabel(joinedText, useCompact ? 28 : 34),
    x + 33 * zoom,
    y + 90 * zoom,
  );

  ctx.fillStyle = isHovered ? '#fda4af' : 'rgba(248,113,113,0.92)';
  ctx.fillText(
    truncateLabel(eliminatedText, useCompact ? 28 : 34),
    x + 33 * zoom,
    y + 102 * zoom,
  );
}

function drawGraveStone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  grave: TontineGraveDto,
  zoom: number,
  isHovered: boolean,
) {
  if (isHovered) {
    drawTombstoneHoverFrame(ctx, x, y, zoom);
  }

  drawTombstoneShadow(ctx, x, y, zoom, isHovered);

  if (zoom >= 0.58) {
    drawTombstoneNamePlate(ctx, x, y, grave.displayName, zoom, isHovered);
  }

  drawDigitalTombstoneMonument(ctx, x, y, zoom, isHovered);

  if (zoom < 0.62) {
    return;
  }

  drawTombstoneDates(ctx, x, y, grave, zoom, isHovered);
}

export function drawGraveyard({
  ctx,
  camX,
  camY,
  viewW,
  viewH,
  zoom,
  graves,
  hoveredGraveId = null,
  highlightedGraveId = null,
  scanPulses = [],
}: DrawGraveyardOptions): void {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const time = Date.now() / 1000;
  const timeMs = time * 1000;

  drawBackground(ctx, camX, camY, viewW, viewH, zoom, time);
  drawScanPulses(ctx, camX, camY, zoom, scanPulses, timeMs);

  const visibleGraves = graves
    .filter((grave) => {
      const margin = 170 / zoom;
      return (
        grave.x >= camX - margin &&
        grave.y >= camY - margin &&
        grave.x <= camX + viewW / zoom + margin &&
        grave.y <= camY + viewH / zoom + margin
      );
    })
    .sort((a, b) => a.y - b.y);

  for (const grave of visibleGraves) {
    const margin = 140 / zoom;
    if (
      grave.x < camX - margin ||
      grave.y < camY - margin ||
      grave.x > camX + viewW / zoom + margin ||
      grave.y > camY + viewH / zoom + margin
    ) {
      continue;
    }

    const sx = (grave.x - camX) * zoom;
    const sy = (grave.y - camY) * zoom;
    drawGraveStone(
      ctx,
      sx,
      sy,
      grave,
      zoom,
      grave.id === hoveredGraveId || grave.id === highlightedGraveId,
    );
  }

  drawScanlineOverlay(ctx, viewW, viewH, time);
  drawVignette(ctx, viewW, viewH);

  if (graves.length === 0) {
    drawEmptyGraveyardState(ctx, viewW, viewH, time);
  }

  ctx.restore();
}

function drawEmptyGraveyardState(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  time: number,
) {
  const centerX = viewW / 2;
  const centerY = viewH * 0.42;
  const pulse = 0.5 + Math.sin(time * 2.2) * 0.5;

  ctx.save();
  ctx.textAlign = 'center';

  const glow = ctx.createRadialGradient(
    centerX,
    centerY,
    12,
    centerX,
    centerY,
    190,
  );
  glow.addColorStop(0, `rgba(34,211,238,${0.1 + pulse * 0.05})`);
  glow.addColorStop(0.48, 'rgba(139,92,246,0.06)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(centerX - 220, centerY - 150, 440, 300);

  ctx.strokeStyle = 'rgba(34,211,238,0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(centerX - 150.5, centerY - 46.5, 301, 94);
  ctx.strokeStyle = 'rgba(244,114,182,0.2)';
  ctx.strokeRect(centerX - 138.5, centerY - 34.5, 277, 70);

  ctx.fillStyle = 'rgba(2,6,23,0.68)';
  ctx.fillRect(centerX - 150, centerY - 46, 300, 94);

  ctx.fillStyle = 'rgba(16,185,129,0.9)';
  ctx.font = '700 10px ui-monospace, monospace';
  ctx.fillText('КЛАДБИЩЕ ПУСТО', centerX, centerY - 16);

  ctx.fillStyle = 'rgba(203,213,225,0.86)';
  ctx.font = '500 13px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Пока никто не выбыл.', centerX, centerY + 8);

  ctx.fillStyle = 'rgba(148,163,184,0.72)';
  ctx.font = '500 11px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Все держатся. Смотритель скучает.', centerX, centerY + 28);

  ctx.fillStyle = `rgba(34,211,238,${0.35 + pulse * 0.25})`;
  ctx.fillRect(centerX - 82, centerY + 54, 164, 1);
  ctx.fillStyle = `rgba(244,114,182,${0.24 + pulse * 0.18})`;
  ctx.fillRect(centerX - 38, centerY + 61, 76, 1);
  ctx.restore();
}

function drawScanPulses(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  zoom: number,
  pulses: GraveyardScanPulse[],
  timeMs: number,
) {
  ctx.save();
  ctx.lineWidth = Math.max(1, 1.4 * zoom);

  for (const pulse of pulses) {
    const age = timeMs - pulse.startedAt;
    if (age < 0 || age > 900) continue;

    const progress = age / 900;
    const alpha = (1 - progress) * 0.52;
    const x = (pulse.x - camX) * zoom;
    const y = (pulse.y - camY) * zoom;
    const radius = (18 + progress * 70) * zoom;

    ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(244,114,182,${alpha * 0.65})`;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(245,158,11,${alpha * 0.8})`;
    ctx.fillRect(x - 12 * zoom, y - 1 * zoom, 24 * zoom, 2 * zoom);
    ctx.fillRect(x - 1 * zoom, y - 12 * zoom, 2 * zoom, 24 * zoom);
  }

  ctx.restore();
}

function drawScanlineOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  time: number,
) {
  const y = (time * 34) % Math.max(1, viewH);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = 'rgba(34,211,238,0.28)';
  ctx.fillRect(0, y, viewW, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (let lineY = 0; lineY < viewH; lineY += 4) {
    ctx.fillRect(0, lineY, viewW, 1);
  }
  ctx.restore();
}

function drawVignette(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
) {
  const gradient = ctx.createRadialGradient(
    viewW / 2,
    viewH / 2,
    Math.min(viewW, viewH) * 0.15,
    viewW / 2,
    viewH / 2,
    Math.max(viewW, viewH) * 0.68,
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.72, 'rgba(0,0,0,0.18)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.72)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, viewW, viewH);
}
