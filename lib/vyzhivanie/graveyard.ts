/** Размеры прокручиваемого поля кладбища (px). */
export const GRAVEYARD_WIDTH_PX = 6400;
export const GRAVEYARD_HEIGHT_PX = 40000;

const MARGIN_X = 160;
const MARGIN_Y = 120;
const CELL_W = 150;
const CELL_H = 130;
const GRID_COLS = 40;
const START_ROW_OFFSET = 3;
const CLUSTER_ROWS = 4;
const CLUSTER_GAP_ROWS = 1;
const CLUSTER_SLOTS = GRID_COLS * CLUSTER_ROWS;

function hash(n: number): number {
  return ((n * 92837111) ^ (n * 689287499) ^ 0x9e3779b9) >>> 0;
}

export function getGraveNickname(user: {
  username: string | null;
  name: string | null;
}): string {
  return user.name?.trim() || user.username?.trim() || 'Игрок';
}

/** Раскладывает могилы перемешанными кварталами — не у верхней кромки и не очередью. */
export function layoutGraveScattered(index: number): { x: number; y: number } {
  const cluster = Math.floor(index / CLUSTER_SLOTS);
  const slotInCluster = index % CLUSTER_SLOTS;
  // Первая могила — у стартовой камеры (0,0), остальные — перемешанные слоты.
  const shuffledSlot =
    index === 0 ? 0 : (slotInCluster * 73 + 19) % CLUSTER_SLOTS;
  const col = shuffledSlot % GRID_COLS;
  const row =
    START_ROW_OFFSET +
    cluster * (CLUSTER_ROWS + CLUSTER_GAP_ROWS) +
    Math.floor(shuffledSlot / GRID_COLS);
  const h = hash(index);

  const jitterX = (h % 62) - 31;
  const jitterY = ((h >> 8) % 54) - 27;

  return {
    x: MARGIN_X + col * CELL_W + jitterX,
    y: MARGIN_Y + row * CELL_H + jitterY,
  };
}

export function formatGraveDate(iso: string | null | undefined): string {
  if (!iso) return 'неизвестно';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'неизвестно';

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Короткая дата для подписи под надгробием при сильном отдалении. */
export function formatGraveDateCompact(iso: string | null | undefined): string {
  if (!iso) return '—';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
