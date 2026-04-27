import {
  BASE_SPEED,
  DINO_HEIGHT,
  DINO_WIDTH,
  DINO_X,
  GRAVITY,
  JUMP_VELOCITY,
  randomRange,
  SCORE_RATE,
} from "../_constants/config";
import type { GameState } from "../_types";

export interface SimulationStepResult {
  hit: boolean;
  nearMissCount: number;
}

export function stepSimulation(
  state: GameState,
  dt: number,
  canvasWidth: number,
  groundY: number,
): SimulationStepResult {
  state.speed += dt * 10;
  state.distance += state.speed * dt;
  state.score += dt * SCORE_RATE * (state.speed / BASE_SPEED) * state.multiplier;

  const onGround = state.dinoY <= 0.001;
  if (state.jumpQueued && onGround) {
    state.dinoVelocityY = JUMP_VELOCITY;
    state.jumpCount += 1;
  }
  state.jumpQueued = false;

  state.dinoVelocityY -= GRAVITY * dt;
  state.dinoY += state.dinoVelocityY * dt;
  if (state.dinoY < 0) {
    state.dinoY = 0;
    state.dinoVelocityY = 0;
  }

  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    const canSpawnFlying = state.speed > BASE_SPEED * 1.2;
    const spawnFlying = canSpawnFlying && Math.random() < 0.28;
    state.obstacles.push({
      x: canvasWidth + randomRange(16, 80),
      width: spawnFlying ? randomRange(30, 42) : randomRange(22, 34),
      height: spawnFlying ? randomRange(20, 30) : randomRange(38, 66),
      kind: spawnFlying ? "flying" : "ground",
      flyOffset: spawnFlying ? randomRange(24, 46) : 0,
      passed: false,
    });
    const speedFactor = Math.max(0.7, BASE_SPEED / state.speed);
    state.spawnIn = randomRange(0.95, 1.75) * speedFactor;
  }

  state.obstacles.forEach((obstacle) => {
    obstacle.x -= state.speed * dt;
  });
  state.obstacles = state.obstacles.filter((o) => o.x + o.width > -10);
  let nearMissCount = 0;
  state.obstacles.forEach((obstacle) => {
    if (!obstacle.passed && obstacle.x + obstacle.width < DINO_X) {
      if (isNearMiss(state, obstacle, groundY)) {
        nearMissCount += 1;
        state.nearMissTotal += 1;
      }
      obstacle.passed = true;
      state.streak += 1;
      state.multiplier = Math.min(4, 1 + Math.floor(state.streak / 4));
    }
  });

  return { hit: hasCollision(state, groundY), nearMissCount };
}

function isNearMiss(state: GameState, obstacle: GameState["obstacles"][number], groundY: number) {
  const dinoLeft = DINO_X + 6;
  const dinoRight = DINO_X + DINO_WIDTH - 6;
  const dinoTop = groundY - state.dinoY + 4;
  const dinoBottom = dinoTop + DINO_HEIGHT - 4;

  const obstacleLeft = obstacle.x + 2;
  const obstacleRight = obstacle.x + obstacle.width - 2;
  const baseTop = groundY + DINO_HEIGHT - obstacle.height;
  const obstacleTop = obstacle.kind === "flying" ? baseTop - obstacle.flyOffset + 2 : baseTop + 2;
  const obstacleBottom = obstacleTop + obstacle.height - 2;

  const horizontalOverlap = dinoRight > obstacleLeft - 8 && dinoLeft < obstacleRight + 8;
  if (!horizontalOverlap) {
    return false;
  }

  const verticalGapGround = Math.abs(dinoBottom - obstacleTop);
  const verticalGapFlying = Math.abs(obstacleBottom - dinoTop);
  return verticalGapGround <= 14 || verticalGapFlying <= 14;
}

function hasCollision(state: GameState, groundY: number): boolean {
  const dinoLeft = DINO_X + 6;
  const dinoRight = DINO_X + DINO_WIDTH - 6;
  const dinoTop = groundY - state.dinoY + 4;
  const dinoBottom = dinoTop + DINO_HEIGHT - 4;

  return state.obstacles.some((obstacle) => {
    const obstacleLeft = obstacle.x + 2;
    const obstacleRight = obstacle.x + obstacle.width - 2;
    const baseTop = groundY + DINO_HEIGHT - obstacle.height;
    const obstacleTop =
      obstacle.kind === "flying" ? baseTop - obstacle.flyOffset + 2 : baseTop + 2;
    const obstacleBottom = obstacleTop + obstacle.height - 2;
    return (
      dinoRight > obstacleLeft &&
      dinoLeft < obstacleRight &&
      dinoBottom > obstacleTop &&
      dinoTop < obstacleBottom
    );
  });
}
