export interface Obstacle {
  x: number;
  width: number;
  height: number;
  kind: "ground" | "flying";
  flyOffset: number;
  passed: boolean;
}

export interface GameState {
  dinoY: number;
  dinoVelocityY: number;
  jumpQueued: boolean;
  jumpCount: number;
  obstacles: Obstacle[];
  speed: number;
  score: number;
  multiplier: number;
  streak: number;
  nearMissTotal: number;
  distance: number;
  spawnIn: number;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
}

export interface SubmitDinoRunScorePayload {
  score: number;
  runDurationMs: number;
}
