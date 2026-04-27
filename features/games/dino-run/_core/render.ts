import {
  CANVAS_HEIGHT,
  DINO_HEIGHT,
  DINO_RUN_SPRITES,
  DINO_X,
  DINO_WIDTH,
} from "../_constants/config";
import type { DinoBiome } from "./biomes";
import type { GameState } from "../_types";

function drawPixelSprite(
  context: CanvasRenderingContext2D,
  sprite: readonly string[],
  x: number,
  y: number,
  pixelSize: number,
  palette: Record<string, string>,
) {
  for (let row = 0; row < sprite.length; row += 1) {
    for (let col = 0; col < sprite[row].length; col += 1) {
      const pixel = sprite[row][col];
      if (pixel !== "0" && palette[pixel]) {
        context.fillStyle = palette[pixel];
        context.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

interface RenderArgs {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  groundY: number;
  state: GameState;
  bestScore: number;
  isRunning: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  bonusLabel: string | null;
  flashAlpha: number;
  biome: DinoBiome;
}

export function renderDinoRunFrame({
  context,
  canvasWidth,
  groundY,
  state,
  bestScore,
  isRunning,
  isGameOver,
  isPaused,
  bonusLabel,
  flashAlpha,
  biome,
}: RenderArgs) {
  context.clearRect(0, 0, canvasWidth, CANVAS_HEIGHT);
  context.imageSmoothingEnabled = false;

  const cycle = (Math.sin(state.distance * 0.0015) + 1) / 2;
  const sky = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(
    0,
    `rgba(${biome.skyTop[0]}, ${biome.skyTop[1]}, ${biome.skyTop[2]}, 1)`,
  );
  sky.addColorStop(
    1,
    `rgba(${biome.skyBottom[0]}, ${biome.skyBottom[1]}, ${biome.skyBottom[2]}, 1)`,
  );
  context.fillStyle = sky;
  context.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);

  context.fillStyle = biome.celestial;
  context.beginPath();
  context.arc(canvasWidth - 72, 52, 20, 0, Math.PI * 2);
  context.fill();

  for (let i = 0; i < 16; i += 1) {
    const starX = (i * 97 + state.distance * 0.08) % (canvasWidth + 50);
    const starY = 18 + ((i * 37) % 80);
    context.fillStyle = `rgba(255,255,255,${(1 - cycle) * 0.5})`;
    context.fillRect(canvasWidth - starX, starY, 2, 2);
  }

  const cloudOffsetFar = (state.distance * 0.22) % (canvasWidth + 120);
  const cloudOffsetNear = (state.distance * 0.45) % (canvasWidth + 140);
  context.fillStyle = biome.cloud;
  context.fillRect(canvasWidth - cloudOffsetFar, 36, 86, 14);
  context.fillRect(canvasWidth - cloudOffsetFar + 22, 26, 40, 12);
  context.fillRect(canvasWidth - cloudOffsetNear, 82, 110, 18);
  context.fillRect(canvasWidth - cloudOffsetNear + 26, 70, 34, 14);

  const mountainOffset = (state.distance * 0.7) % (canvasWidth + 240);
  context.fillStyle = biome.mountain;
  context.beginPath();
  context.moveTo(-240 - mountainOffset, groundY + DINO_HEIGHT);
  context.lineTo(-120 - mountainOffset, 120);
  context.lineTo(10 - mountainOffset, groundY + DINO_HEIGHT);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(40 - mountainOffset, groundY + DINO_HEIGHT);
  context.lineTo(180 - mountainOffset, 110);
  context.lineTo(320 - mountainOffset, groundY + DINO_HEIGHT);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(300 - mountainOffset, groundY + DINO_HEIGHT);
  context.lineTo(430 - mountainOffset, 130);
  context.lineTo(560 - mountainOffset, groundY + DINO_HEIGHT);
  context.closePath();
  context.fill();

  context.strokeStyle = "rgba(255,255,255,0.16)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, groundY + DINO_HEIGHT);
  context.lineTo(canvasWidth, groundY + DINO_HEIGHT);
  context.stroke();
  context.fillStyle = "#15324c";
  context.fillRect(
    0,
    groundY + DINO_HEIGHT,
    canvasWidth,
    CANVAS_HEIGHT - (groundY + DINO_HEIGHT),
  );

  const frameIndex = isRunning && !isPaused ? Math.floor(state.distance * 0.06) % 2 : 0;
  const dinoSprite = DINO_RUN_SPRITES[frameIndex];
  const spritePixelSize = Math.floor(DINO_WIDTH / dinoSprite[0].length);
  const spriteHeight = dinoSprite.length * spritePixelSize;
  const dinoScreenY = groundY - state.dinoY + (DINO_HEIGHT - spriteHeight);

  drawPixelSprite(context, dinoSprite, DINO_X, dinoScreenY, spritePixelSize, {
    "1": "#f9bc60",
    "2": "#d59143",
    "3": "#072b2a",
  });

  context.fillStyle = "#abd1c6";
  state.obstacles.forEach((obstacle) => {
    const obstacleY =
      groundY +
      DINO_HEIGHT -
      obstacle.height -
      (obstacle.kind === "flying" ? obstacle.flyOffset : 0);
    context.fillStyle = obstacle.kind === "flying" ? "#9ad4ff" : "#abd1c6";
    context.fillRect(obstacle.x, obstacleY, obstacle.width, obstacle.height);
    if (obstacle.kind === "flying") {
      context.fillRect(obstacle.x - 6, obstacleY + 4, 6, 3);
      context.fillRect(obstacle.x + obstacle.width, obstacleY + 8, 6, 3);
    } else {
      context.fillRect(obstacle.x - 4, obstacleY + obstacle.height * 0.45, 4, 6);
      context.fillRect(obstacle.x + obstacle.width, obstacleY + obstacle.height * 0.3, 4, 6);
    }
  });

  context.fillStyle = "rgba(255,255,255,0.94)";
  context.font = "700 18px Inter, sans-serif";
  context.textAlign = "left";
  context.fillText(`${Math.floor(state.score)}`, 16, 30);
  context.textAlign = "right";
  context.fillStyle = "rgba(255,255,255,0.7)";
  context.fillText(`BEST ${bestScore}`, canvasWidth - 16, 30);
  context.textAlign = "left";

  for (let i = 0; i < 4; i += 1) {
    const lineX = ((state.distance * (1.4 + i * 0.35)) % (canvasWidth + 50)) - 30;
    context.fillStyle = "rgba(255,255,255,0.12)";
    context.fillRect(canvasWidth - lineX, groundY + DINO_HEIGHT + 8 + i * 6, 18, 2);
  }

  if (bonusLabel) {
    context.fillStyle = "rgba(0,0,0,0.45)";
    context.fillRect(canvasWidth / 2 - 120, 22, 240, 34);
    context.fillStyle = "#f9bc60";
    context.textAlign = "center";
    context.font = "700 18px Inter, sans-serif";
    context.fillText(bonusLabel, canvasWidth / 2, 45);
    context.textAlign = "left";
  }

  if (flashAlpha > 0.01) {
    context.fillStyle = `rgba(249,188,96,${Math.min(0.6, flashAlpha)})`;
    context.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
  }

  if (!isRunning && !isGameOver && !isPaused) {
    context.fillStyle = "rgba(0,0,0,0.45)";
    context.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
    context.fillStyle = "#fffffe";
    context.textAlign = "center";
    context.font = "700 22px Inter, sans-serif";
    context.fillText("Выбери биом и начни забег", canvasWidth / 2, CANVAS_HEIGHT / 2);
    context.font = "600 16px Inter, sans-serif";
    context.fillText("Нажми P для паузы", canvasWidth / 2, CANVAS_HEIGHT / 2 + 28);
  }

  if (isPaused && !isGameOver) {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
    context.fillStyle = "#fffffe";
    context.textAlign = "center";
    context.font = "700 28px Inter, sans-serif";
    context.fillText("Пауза", canvasWidth / 2, CANVAS_HEIGHT / 2 - 8);
    context.font = "600 16px Inter, sans-serif";
    context.fillText("Нажми P или кнопку паузы", canvasWidth / 2, CANVAS_HEIGHT / 2 + 22);
  }

  if (isGameOver) {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
    context.fillStyle = "#fffffe";
    context.textAlign = "center";
    context.font = "700 28px Inter, sans-serif";
    context.fillText("Игра окончена", canvasWidth / 2, CANVAS_HEIGHT / 2 - 8);
    context.font = "600 18px Inter, sans-serif";
    context.fillText(
      "Нажми рестарт, чтобы попробовать еще",
      canvasWidth / 2,
      CANVAS_HEIGHT / 2 + 26,
    );
  }
}

export function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return context;
}
