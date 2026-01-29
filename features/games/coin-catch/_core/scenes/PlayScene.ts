// Сцена игры

import * as PIXI from "pixi.js";
import type { GameState, Coin, GameConfig } from "../../_types";
import type { Viewport } from "../systems/adaptive";

const BG_PATHS = ["/coin/bg_layer_far.png", "/coin/bg_layer_mid.png", "/coin/bg_layer_near.png"] as const;
/** Кадры анимации монеты: /coin/co/1.png … 6.png */
const COIN_FRAME_PATHS = ["/coin/co/1.png", "/coin/co/2.png", "/coin/co/3.png", "/coin/co/4.png", "/coin/co/5.png", "/coin/co/6.png"] as const;
const COIN_ANIMATION_SPEED = 0.2;

export class PlayScene {
  private container: PIXI.Container;
  private app: PIXI.Application;
  private config: GameConfig;
  private coins: Map<string, PIXI.Container> = new Map();
  private coinFrames: PIXI.Texture[] = [];
  private coinFrameSize = 256;
  private particles: PIXI.Graphics[] = [];
  private uiContainer: PIXI.Container;
  private scoreText: PIXI.Text | null = null;
  private livesText: PIXI.Text | null = null;
  private timeText: PIXI.Text | null = null;
  private currentState: GameState | null = null;
  private sceneWidth: number = 1280;
  private sceneHeight: number = 720;

  private backgroundContainer: PIXI.Container;
  private coinsContainer: PIXI.Container;
  private bgFar: PIXI.Sprite | null = null;
  private bgMid: PIXI.Sprite | null = null;
  private bgNear: PIXI.Sprite | null = null;
  private centerX = 0;
  private centerY = 0;
  private tickerRef: (t: number) => void = () => {};

  constructor(app: PIXI.Application, config: GameConfig) {
    this.container = new PIXI.Container();
    this.app = app;
    this.config = config;
    app.stage.addChild(this.container);

    this.backgroundContainer = new PIXI.Container();
    this.backgroundContainer.eventMode = "none";
    this.backgroundContainer.eventChildren = false;
    this.container.addChildAt(this.backgroundContainer, 0);

    this.coinsContainer = new PIXI.Container();
    this.container.addChildAt(this.coinsContainer, 1);

    this.uiContainer = new PIXI.Container();
    this.container.addChild(this.uiContainer);

    this.sceneWidth = app.screen.width;
    this.sceneHeight = app.screen.height;

    this.setupUI();
  }

  async initBackground(): Promise<void> {
    try {
      const [texFar, texMid, texNear] = await Promise.all([
        PIXI.Assets.load(BG_PATHS[0]),
        PIXI.Assets.load(BG_PATHS[1]),
        PIXI.Assets.load(BG_PATHS[2]),
      ]);
      this.bgFar = new PIXI.Sprite({ texture: texFar });
      this.bgMid = new PIXI.Sprite({ texture: texMid });
      this.bgNear = new PIXI.Sprite({ texture: texNear });
      this.bgFar.anchor.set(0.5);
      this.bgMid.anchor.set(0.5);
      this.bgNear.anchor.set(0.5);
      this.backgroundContainer.addChild(this.bgFar);
      this.backgroundContainer.addChild(this.bgMid);
      this.backgroundContainer.addChild(this.bgNear);
      this.updateBackgroundSize();
      this.tickerRef = this.tickParallax.bind(this);
      this.app.ticker.add(this.tickerRef);
    } catch {
      const fallback = new PIXI.Graphics();
      fallback.rect(0, 0, this.sceneWidth, this.sceneHeight);
      fallback.fill(0x152520);
      this.backgroundContainer.addChildAt(fallback, 0);
    }

    // Загрузка кадров монеты /coin/co/1.png … 6.png
    try {
      const textures = await Promise.all(COIN_FRAME_PATHS.map((p) => PIXI.Assets.load(p)));
      if (textures.length > 0 && textures.every((t) => t?.width)) {
        this.coinFrames = textures as PIXI.Texture[];
        this.coinFrameSize = this.coinFrames[0].width;
      }
    } catch {
      this.coinFrames = [];
    }
  }

  private updateBackgroundSize(): void {
    const w = this.sceneWidth;
    const h = this.sceneHeight;
    this.centerX = w / 2;
    this.centerY = h / 2;
    const layers = [this.bgFar, this.bgMid, this.bgNear].filter(Boolean) as PIXI.Sprite[];
    for (const sprite of layers) {
      const tw = sprite.texture?.width ?? 1;
      const th = sprite.texture?.height ?? 1;
      const scale = Math.max(w / tw, h / th);
      sprite.scale.set(scale);
      sprite.position.set(this.centerX, this.centerY);
    }
  }

  private tickParallax(): void {
    const offset = Math.sin(Date.now() / 8000) * 12;
    if (this.bgFar) this.bgFar.x = this.centerX + offset * 0.1;
    if (this.bgMid) this.bgMid.x = this.centerX + offset * 0.3;
    if (this.bgNear) this.bgNear.x = this.centerX + offset * 0.6;
  }

  private setupUI(): void {
    const width = this.sceneWidth;
    const height = this.sceneHeight;
    const minSide = Math.min(width, height);
    const scale = Math.max(0.5, Math.min(2, minSide / 400));
    const baseFontSize = Math.max(16, Math.min(32, 20 * scale));
    const padding = Math.max(8, 14 * scale);
    const gap = Math.max(6, 10 * scale);

    // Панель — стеклянный эффект, адаптивная ширина
    const panelWidth = Math.min(width * 0.9, Math.max(260, 320 * scale));
    const panelHeight = Math.max(56, Math.min(88, 72 * scale));
    const radius = 12 * scale;

    const panel = new PIXI.Graphics();
    panel.roundRect(padding, padding, panelWidth, panelHeight, radius);
    panel.fill({ color: 0x001e1d, alpha: 0.94 });
    panel.stroke({ width: 2 * scale, color: 0xf9bc60, alpha: 0.85 });
    const inner = new PIXI.Graphics();
    inner.roundRect(padding + 2, padding + 2, panelWidth - 4, panelHeight - 4, radius - 2);
    inner.stroke({ width: 1, color: 0xf9bc60, alpha: 0.2 });
    panel.addChild(inner);
    this.uiContainer.addChild(panel);

    const rowY = padding + panelHeight / 2;
    const scoreX = padding + 16 * scale;
    const livesX = padding + panelWidth * 0.35;
    const timeX = padding + panelWidth * 0.68;
    const labelOffset = baseFontSize * 0.75;

    const scoreLabel = new PIXI.Text({
      text: "Очки",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize * 0.65,
        fill: 0xabd1c6,
      },
    });
    scoreLabel.anchor.set(0, 0.5);
    scoreLabel.x = scoreX;
    scoreLabel.y = rowY - labelOffset;
    this.uiContainer.addChild(scoreLabel);

    this.scoreText = new PIXI.Text({
      text: "0",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize,
        fill: 0xfffffe,
        fontWeight: "bold",
      },
    });
    this.scoreText.anchor.set(0, 0.5);
    this.scoreText.x = scoreX;
    this.scoreText.y = rowY;
    this.uiContainer.addChild(this.scoreText);

    const livesLabel = new PIXI.Text({
      text: "Жизни",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize * 0.65,
        fill: 0xabd1c6,
      },
    });
    livesLabel.anchor.set(0.5, 0.5);
    livesLabel.x = livesX;
    livesLabel.y = rowY - labelOffset;
    this.uiContainer.addChild(livesLabel);

    this.livesText = new PIXI.Text({
      text: "3",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize,
        fill: 0xff6b6b,
        fontWeight: "bold",
      },
    });
    this.livesText.anchor.set(0.5, 0.5);
    this.livesText.x = livesX;
    this.livesText.y = rowY;
    this.uiContainer.addChild(this.livesText);

    const timeLabel = new PIXI.Text({
      text: "Сек",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize * 0.65,
        fill: 0xabd1c6,
      },
    });
    timeLabel.anchor.set(0.5, 0.5);
    timeLabel.x = timeX;
    timeLabel.y = rowY - labelOffset;
    this.uiContainer.addChild(timeLabel);

    this.timeText = new PIXI.Text({
      text: "30",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize * 1.15,
        fill: 0xf9bc60,
        fontWeight: "bold",
      },
    });
    this.timeText.anchor.set(0.5, 0.5);
    this.timeText.x = timeX;
    this.timeText.y = rowY;
    this.uiContainer.addChild(this.timeText);
  }

  addCoin(coin: Coin): void {
    const diameter = coin.radius * 2;
    const size = this.coinFrameSize > 0 ? this.coinFrameSize : 256;
    const scale = diameter / size;

    let display: PIXI.Container;
    if (this.coinFrames.length > 0) {
      const anim = new PIXI.AnimatedSprite(this.coinFrames);
      anim.anchor.set(0.5);
      anim.animationSpeed = COIN_ANIMATION_SPEED;
      anim.scale.set(scale);
      anim.play();
      display = anim;
    } else {
      const graphics = new PIXI.Graphics();
      graphics.circle(coin.x, coin.y, coin.radius);
      graphics.fill(0xf9bc60);
      graphics.stroke({ width: 3, color: 0x001e1d });
      const innerRadius = coin.radius * 0.7;
      graphics.circle(coin.x, coin.y, innerRadius);
      graphics.fill(0xffd700);
      const highlightRadius = coin.radius * 0.3;
      graphics.circle(coin.x - coin.radius * 0.3, coin.y - coin.radius * 0.3, highlightRadius);
      graphics.fill({ color: 0xffffff, alpha: 0.4 });
      graphics.circle(coin.x, coin.y, coin.radius + 2);
      graphics.stroke({ width: 1, color: 0xf9bc60, alpha: 0.5 });
      display = graphics;
    }

    display.x = coin.x;
    display.y = coin.y;
    display.eventMode = "static";
    display.cursor = "pointer";
    (display as PIXI.Container & { userData?: { x: number; y: number; radius: number } }).userData = {
      x: coin.x,
      y: coin.y,
      radius: coin.radius,
    };

    this.coinsContainer.addChild(display);
    this.coins.set(coin.id, display);
  }

  /** Убрать монету с экрана без анимации сбора (например, истёк срок жизни) */
  removeCoin(coinId: string): void {
    const display = this.coins.get(coinId);
    if (!display) return;
    display.removeAllListeners?.();
    display.destroy({ children: true, texture: false, baseTexture: false });
    this.coins.delete(coinId);
  }

  collectCoin(coinId: string): void {
    const display = this.coins.get(coinId);
    if (!display) return;
    const data = (display as PIXI.Container & { userData?: { x: number; y: number; radius: number } }).userData;
    const cx = data?.x ?? 0;
    const cy = data?.y ?? 0;
    const coinRadius = data?.radius ?? 30;

    // Эффект кольца
    const ring = new PIXI.Graphics();
    ring.circle(0, 0, coinRadius);
    ring.stroke({ width: 3, color: 0xf9bc60 });
    ring.position.set(cx, cy);
    this.container.addChild(ring);

    // Анимация кольца
    const startTime = Date.now();
    const duration = 300;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const scale = 1 + progress * 2;
          const alpha = 1 - progress;
          ring.scale.set(scale);
          ring.alpha = alpha;
          requestAnimationFrame(animate);
        } else {
          ring.removeAllListeners?.();
          ring.destroy({ children: true, texture: false, baseTexture: false });
        }
      };
    animate();

    // Простые частицы
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const particle = new PIXI.Graphics();
      particle.circle(0, 0, 4);
      particle.fill(0xf9bc60);
      particle.x = cx;
      particle.y = cy;
      this.container.addChild(particle);
      this.particles.push(particle);

      const speed = 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const startTime = Date.now();
      const duration = 500;

      const animateParticle = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
          const progress = elapsed / duration;
          particle.x += vx;
          particle.y += vy;
          particle.alpha = 1 - progress;
          requestAnimationFrame(animateParticle);
        } else {
          particle.removeAllListeners?.();
          particle.destroy({ children: true, texture: false, baseTexture: false });
          const index = this.particles.indexOf(particle);
          if (index > -1) {
            this.particles.splice(index, 1);
          }
        }
      };
      animateParticle();
    }

    display.removeAllListeners?.();
    display.destroy({ children: true, texture: false, baseTexture: false });
    this.coins.delete(coinId);
  }

  clearCoins(): void {
    for (const node of this.coins.values()) {
      node.removeAllListeners?.();
      node.destroy({ children: true, texture: false, baseTexture: false });
    }
    this.coins.clear();
  }

  updateState(state: GameState): void {
    this.currentState = state;
    if (this.scoreText) {
      this.scoreText.text = `${state.score}`;
    }
    if (this.livesText) {
      this.livesText.text = `${state.lives}`;
      // Меняем цвет при низком количестве жизней
      if (state.lives === 1) {
        this.livesText.style.fill = 0xff0000;
      } else if (state.lives === 2) {
        this.livesText.style.fill = 0xff8800;
      } else {
        this.livesText.style.fill = 0xff6b6b;
      }
    }
    if (this.timeText) {
      this.timeText.text = `${state.timeLeft}`;
      // Меняем цвет при малом времени
      if (state.timeLeft <= 10) {
        this.timeText.style.fill = 0xff0000;
      } else if (state.timeLeft <= 20) {
        this.timeText.style.fill = 0xff8800;
      } else {
        this.timeText.style.fill = 0xf9bc60;
      }
    }
  }

  onResize(viewport: Viewport): void {
    this.sceneWidth = viewport.width;
    this.sceneHeight = viewport.height;
    this.updateBackgroundSize();
    this.uiContainer.removeChildren();
    this.setupUI();
    if (this.currentState) {
      this.updateState(this.currentState);
    }
  }

  show(): void {
    this.container.visible = true;
  }

  hide(): void {
    this.container.visible = false;
  }

  destroy(): void {
    this.app.ticker.remove(this.tickerRef);
    if (this.bgFar) {
      this.bgFar.destroy({ children: true, texture: false, baseTexture: false });
      this.bgFar = null;
    }
    if (this.bgMid) {
      this.bgMid.destroy({ children: true, texture: false, baseTexture: false });
      this.bgMid = null;
    }
    if (this.bgNear) {
      this.bgNear.destroy({ children: true, texture: false, baseTexture: false });
      this.bgNear = null;
    }
    this.backgroundContainer.removeChildren();
    this.backgroundContainer.destroy({ children: true, texture: false, baseTexture: false });
    this.clearCoins();
    for (const particle of this.particles) {
      particle.destroy({ children: true, texture: false, baseTexture: false });
    }
    this.particles = [];
    this.container.destroy({ children: true });
  }
}
