// Игровой движок на PixiJS

import * as PIXI from "pixi.js";
import type { GameState, Coin, GameConfig } from "../_types";
import { GAME_CONFIG } from "../_types";
import { isMobile, getVisibleViewport } from "./systems/adaptive";
import type { Viewport } from "./systems/adaptive";
import { spawnCoin, getMaxCoinsOnScreen } from "./systems/spawn";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
import { GameOverScene } from "./scenes/GameOverScene";

export type SceneType = "menu" | "play" | "gameover";

export class GameEngine {
  private app: PIXI.Application | null = null;
  private container: HTMLElement;
  private currentScene: SceneType = "menu";
  private gameState: GameState;
  private config: GameConfig;
  private coins: Map<string, Coin> = new Map();
  private coinCounter = 0;
  private spawnTimer: number | null = null;
  private gameTimer: number | null = null;
  private menuScene: MenuScene | null = null;
  private playScene: PlayScene | null = null;
  private gameOverScene: GameOverScene | null = null;
  private onGameOver?: (score: number) => void;
  private onLeaderboardClick?: () => void;
  private clickHandler: ((event: PIXI.FederatedPointerEvent) => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  /** Время старта раунда — игнорируем промах от клика по кнопке "Начать игру" */
  private gameStartTime = 0;
  private destroyed = false;
  private lastResizeW = 0;
  private lastResizeH = 0;
  private resizeRafId: number | null = null;

  constructor(
    container: HTMLElement,
    onGameOver?: (score: number) => void,
    onLeaderboardClick?: () => void,
  ) {
    this.container = container;
    this.config = GAME_CONFIG;
    this.onGameOver = onGameOver;
    this.onLeaderboardClick = onLeaderboardClick;
    this.gameState = {
      score: 0,
      lives: this.config.maxLives,
      timeLeft: this.config.gameDuration,
      isPlaying: false,
      isGameOver: false,
    };
  }

  async init(): Promise<void> {
    if (typeof window === "undefined") return;

    const { w, h } = this.getGameSize();
    this.lastResizeW = w;
    this.lastResizeH = h;

    this.app = new PIXI.Application();
    await this.app.init({
      width: w,
      height: h,
      backgroundColor: 0x1a1a1a,
      antialias: false,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });

    if (!this.app.canvas) {
      throw new Error("Failed to create PixiJS canvas");
    }

    this.container.appendChild(this.app.canvas);

    this.app.canvas.style.position = "absolute";
    this.app.canvas.style.left = "0";
    this.app.canvas.style.top = "0";
    this.app.canvas.style.width = "100%";
    this.app.canvas.style.height = "100%";
    this.app.canvas.style.display = "block";
    this.app.canvas.style.touchAction = "none";

    this.resizeHandler = this.throttledResize.bind(this);
    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("orientationchange", this.resizeHandler);
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", this.resizeHandler);
      window.visualViewport.addEventListener("scroll", this.resizeHandler);
    }
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resizeHandler?.());
      this.resizeObserver.observe(this.container);
    }

    this.menuScene = new MenuScene(this.app, () => this.startGame());
    this.playScene = new PlayScene(this.app, this.config);
    await this.playScene.initBackground();
    this.gameOverScene = new GameOverScene(
      this.app,
      () => this.startGame(),
      this.onLeaderboardClick,
    );

    this.showScene("menu");
  }

  /** Защита от дребезга ресайза (requestAnimationFrame) */
  private throttledResize(): void {
    if (this.resizeRafId !== null) return;
    this.resizeRafId = requestAnimationFrame(() => {
      this.resizeRafId = null;
      this.handleResize();
    });
  }

  /** Размер игровой области: контейнер или видимая вьюпорт, не меньше 320px */
  private getGameSize(): { w: number; h: number } {
    const cw = this.container?.clientWidth ?? 0;
    const ch = this.container?.clientHeight ?? 0;
    if (cw >= 1 && ch >= 1) {
      return {
        w: Math.max(320, Math.floor(cw)),
        h: Math.max(320, Math.floor(ch)),
      };
    }
    const vp = getVisibleViewport();
    return { w: vp.width, h: vp.height };
  }

  private handleResize(): void {
    if (this.destroyed || !this.app?.canvas) return;
    const { w, h } = this.getGameSize();
    if (w === this.lastResizeW && h === this.lastResizeH) return;
    this.lastResizeW = w;
    this.lastResizeH = h;

    this.app.renderer.resize(w, h);
    const viewport: Viewport = {
      width: w,
      height: h,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    };
    this.menuScene?.onResize(viewport);
    this.playScene?.onResize(viewport);
  }

  private showScene(scene: SceneType): void {
    if (!this.app) return;

    this.currentScene = scene;

    // Скрываем все сцены
    this.menuScene?.hide();
    this.playScene?.hide();
    this.gameOverScene?.hide();

    // Показываем нужную сцену
    switch (scene) {
      case "menu":
        this.menuScene?.show();
        break;
      case "play":
        this.playScene?.show();
        this.playScene?.updateState(this.gameState);
        break;
      case "gameover":
        this.gameOverScene?.show(this.gameState.score);
        break;
    }
  }

  startGame(): void {
    if (!this.app) return;

    this.gameState = {
      score: 0,
      lives: this.config.maxLives,
      timeLeft: this.config.gameDuration,
      isPlaying: true,
      isGameOver: false,
    };

    this.coins.clear();
    this.coinCounter = 0;
    this.gameStartTime = Date.now(); // сброс grace 500ms при каждом рестарте

    this.showScene("play");

    // Запускаем таймер игры
    this.gameTimer = window.setInterval(() => {
      this.gameState.timeLeft--;
      if (this.gameState.timeLeft <= 0) {
        this.endGame();
      } else {
        this.playScene?.updateState(this.gameState);
      }
    }, 1000);

    // Спавн монет: сразу 1–4 штуки, дальше по интервалу пачками 1–4
    this.spawnCoinBatch();
    this.spawnTimer = window.setInterval(() => {
      if (this.gameState.isPlaying && !this.gameState.isGameOver) {
        this.removeExpiredCoins();
        this.spawnCoinBatch();
      }
    }, this.config.coinSpawnInterval);

    // Обработка кликов (stage = размер экрана) — снимаем старый, чтобы при повторной игре не было двойного срабатывания
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, w, h);
    if (this.clickHandler) {
      this.app.stage.off("pointerdown", this.clickHandler);
    }
    this.clickHandler = this.handleClick.bind(this);
    this.app.stage.on("pointerdown", this.clickHandler);
  }

  /** Удалить монеты, у которых истёк срок жизни */
  private removeExpiredCoins(): void {
    if (!this.playScene) return;
    const now = Date.now();
    const lifetime = this.config.coinLifetimeMs ?? 4500;
    for (const [id, coin] of this.coins.entries()) {
      if (coin.collected) continue;
      if (now - coin.spawnedAt >= lifetime) {
        this.coins.delete(id);
        this.playScene.removeCoin(id);
      }
    }
  }

  /** За один раз появляется от 1 до 4 монет, но не больше лимита на экране */
  private spawnCoinBatch(): void {
    if (!this.app || !this.playScene) return;

    const mobile = isMobile();
    const maxCoins = getMaxCoinsOnScreen(mobile);
    const activeCount = this.coins.size;
    if (activeCount >= maxCoins) return;

    const wantCount = 1 + Math.floor(Math.random() * 4);
    const count = Math.min(wantCount, maxCoins - activeCount);
    const w = this.app.screen.width;
    const h = this.app.screen.height;

    for (let i = 0; i < count; i++) {
      const coinId = `coin-${++this.coinCounter}`;
      const coin = spawnCoin(coinId, w, h, this.config, mobile);
      this.coins.set(coinId, coin);
      this.playScene.addCoin(coin);
    }
  }

  private handleClick(event: PIXI.FederatedPointerEvent): void {
    if (!this.app || this.currentScene !== "play" || !this.playScene) return;
    if (!this.gameState.isPlaying || this.gameState.isGameOver) return;

    const point = event.global;
    let hitCoin: Coin | null = null;

    for (const coin of this.coins.values()) {
      if (coin.collected) continue;

      const dx = point.x - coin.x;
      const dy = point.y - coin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= coin.radius) {
        hitCoin = coin;
        break;
      }
    }

    if (hitCoin) {
      // Попадание по монете
      hitCoin.collected = true;
      this.gameState.score++;
      this.coins.delete(hitCoin.id);
      this.playScene.collectCoin(hitCoin.id);
      this.playScene.updateState(this.gameState);
    } else {
      // Промах — не считаем клик по кнопке "Начать игру" (первые 500 мс после старта)
      const sinceStart = Date.now() - this.gameStartTime;
      if (sinceStart < 500) return;

      this.gameState.lives--;
      this.playScene.updateState(this.gameState);

      if (this.gameState.lives <= 0) {
        this.endGame();
      }
    }
  }

  private endGame(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }

    this.gameState.isPlaying = false;
    this.gameState.isGameOver = true;

    // Очищаем монеты
    this.coins.clear();
    if (this.playScene) {
      this.playScene.clearCoins();
    }

    this.showScene("gameover");

    if (this.onGameOver) {
      this.onGameOver(this.gameState.score);
    }
  }

  destroy(): void {
    this.destroyed = true;

    if (this.resizeRafId !== null) {
      cancelAnimationFrame(this.resizeRafId);
      this.resizeRafId = null;
    }
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }

    const ref = this.resizeHandler;
    if (typeof window !== "undefined" && ref) {
      window.removeEventListener("resize", ref);
      window.removeEventListener("orientationchange", ref);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", ref);
        window.visualViewport.removeEventListener("scroll", ref);
      }
      this.resizeHandler = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    const app = this.app;
    if (app) {
      if (app.ticker && typeof app.ticker.stop === "function") {
        app.ticker.stop();
      }
      if (app.stage && this.clickHandler) {
        app.stage.off("pointerdown", this.clickHandler);
        this.clickHandler = null;
        app.stage.eventMode = "auto";
        app.stage.hitArea = null;
      }
      if (app.stage && app.stage.children) {
        app.stage.removeChildren();
      }
    }

    this.menuScene?.destroy();
    this.playScene?.destroy();
    this.gameOverScene?.destroy();
    this.menuScene = null;
    this.playScene = null;
    this.gameOverScene = null;

    this.app = null;
    if (app) {
      try {
        if (app.canvas && app.canvas.parentNode) {
          try {
            app.canvas.parentNode.removeChild(app.canvas);
          } catch {
            /* already removed */
          }
        }
        if (typeof app.destroy === "function") {
          app.destroy(true, { children: true, texture: false, baseTexture: false });
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Error destroying Pixi Application:", error);
        }
      }
    }
  }
}
