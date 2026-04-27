import type { GameState } from "../_types";

export const BEST_SCORE_STORAGE_KEY = "dino-run-best-score";
export const CANVAS_HEIGHT = 280;
export const DINO_X = 72;
export const DINO_WIDTH = 42;
export const DINO_HEIGHT = 44;
export const GROUND_OFFSET = 42;
export const BASE_SPEED = 280;
export const GRAVITY = 2200;
export const JUMP_VELOCITY = 760;
export const SCORE_RATE = 8;

export const DINO_RUN_SPRITES = [
  [
    "00000111100000",
    "00011111111000",
    "00111111111100",
    "00111232111110",
    "01111222221110",
    "01111122211110",
    "01111111111100",
    "00111111111100",
    "00111111111000",
    "01110111000000",
    "11100111100000",
    "11000101110000",
    "00000100110000",
    "00001100011000",
  ],
  [
    "00000111100000",
    "00011111111000",
    "00111111111100",
    "00111232111110",
    "01111222221110",
    "01111122211110",
    "01111111111100",
    "00111111111100",
    "00111111111000",
    "01110011100000",
    "11100011110000",
    "11000010111000",
    "00001100001100",
    "00011000000110",
  ],
] as const;

export function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function createInitialGameState(): GameState {
  return {
    dinoY: 0,
    dinoVelocityY: 0,
    jumpQueued: false,
    jumpCount: 0,
    obstacles: [],
    speed: BASE_SPEED,
    score: 0,
    multiplier: 1,
    streak: 0,
    nearMissTotal: 0,
    distance: 0,
    spawnIn: randomRange(0.9, 1.5),
  };
}
