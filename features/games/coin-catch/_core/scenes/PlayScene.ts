// Сцена игры

import * as PIXI from "pixi.js";
import type { GameState, Coin, GameConfig } from "../../_types";
import { playCoinCollectSound } from "../../_services/sfx";
import type { Viewport } from "../systems/adaptive";

const BG_PATH = "/coin/bg.png";
/** Кадры анимации монеты: /coin/co/1.png … 6.png */
const COIN_FRAME_PATHS = [
  "/coin/co/1.png",
  "/coin/co/2.png",
  "/coin/co/3.png",
  "/coin/co/4.png",
  "/coin/co/5.png",
  "/coin/co/6.png",
] as const;
const COIN_ANIMATION_SPEED = 0.2;

export class PlayScene {
  private container: PIXI.Container;
  private app: PIXI.Application;
  private config: GameConfig;
  private coins: Map<string, PIXI.Container> = new Map();
  private coinFrames: PIXI.Texture[] = [];
  private coinFrameSize = 256;
  private particles: PIXI.Graphics[] = [];
  private missEffects: PIXI.Graphics[] = [];
  private uiContainer: PIXI.Container;
  private scoreText: PIXI.Text | null = null;
  private livesText: PIXI.Text | null = null;
  private timeText: PIXI.Text | null = null;
  private currentState: GameState | null = null;
  private sceneWidth: number = 1280;
  private sceneHeight: number = 720;

  private backgroundContainer: PIXI.Container;
  private coinsContainer: PIXI.Container;
  private bgSprite: PIXI.Sprite | null = null;

  constructor(app: PIXI.Application, config: GameConfig) {
    this.container = new PIXI.Container();
    this.app = app;
    this.config = config;
    app.stage.addChild(this.container);

    this.backgroundContainer = new PIXI.Container();
    this.backgroundContainer.eventMode = "none";
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
      const texBg = await PIXI.Assets.load(BG_PATH);
      this.bgSprite = PIXI.Sprite.from(texBg);
      this.bgSprite.anchor.set(0.5);
      this.backgroundContainer.addChild(this.bgSprite);
      this.updateBackgroundSize();
    } catch {
      const fallback = new PIXI.Graphics();
      fallback.rect(0, 0, this.sceneWidth, this.sceneHeight);
      fallback.fill(0x152520);
      this.backgroundContainer.addChildAt(fallback, 0);
    }

    // Загрузка кадров монеты /coin/co/1.png … 6.png
    try {
      const textures = await Promise.all(
        COIN_FRAME_PATHS.map((p) => PIXI.Assets.load(p)),
      );
      if (textures.length > 0 && textures.every((t) => t?.width)) {
        this.coinFrames = textures as PIXI.Texture[];
        this.coinFrameSize = this.coinFrames[0].width;
      }
    } catch {
      this.coinFrames = [];
    }
  }

  private updateBackgroundSize(): void {
    if (!this.bgSprite) return;
    const w = this.sceneWidth;
    const h = this.sceneHeight;
    const tw = this.bgSprite.texture?.width ?? 1;
    const th = this.bgSprite.texture?.height ?? 1;
    const scale = Math.max(w / tw, h / th);
    this.bgSprite.scale.set(scale);
    this.bgSprite.position.set(w / 2, h / 2);
  }

  private setupUI(): void {
    const width = this.sceneWidth;
    const height = this.sceneHeight;
    const minSide = Math.min(width, height);
    const scale = Math.max(0.5, Math.min(2, minSide / 400));
    const baseFontSize = Math.max(16, Math.min(22, Math.floor(18 * scale)));
    const labelFontSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));
    const pad = Math.max(8, Math.floor(14 * scale));
    const radius = Math.max(6, Math.floor(10 * scale));

    const panelWidth = Math.min(
      width - pad * 2,
      Math.max(300, Math.floor(360 * scale)),
    );
    const panelHeight = Math.max(64, Math.min(88, Math.floor(72 * scale)));
    const px = Math.floor(pad);
    const py = Math.floor(pad);

    const panel = new PIXI.Graphics();
    panel.roundRect(px, py, panelWidth, panelHeight, radius);
    panel.fill({ color: 0x001e1d, alpha: 0.65 });
    panel.stroke({ width: 2, color: 0xf9bc60, alpha: 0.9 });
    const inner = new PIXI.Graphics();
    inner.roundRect(
      px + 2,
      py + 2,
      panelWidth - 4,
      panelHeight - 4,
      Math.max(2, radius - 2),
    );
    inner.stroke({ width: 1, color: 0xf9bc60, alpha: 0.35 });
    panel.addChild(inner);

    const colW = panelWidth / 3;
    const center1 = px + colW * 0.5;
    const center2 = px + colW * 1.5;
    const center3 = px + colW * 2.5;
    const rowY = py + panelHeight / 2;
    const labelY = Math.floor(rowY - panelHeight * 0.2);
    const valueY = Math.floor(rowY + panelHeight * 0.12);

    const divider1 = new PIXI.Graphics();
    divider1.rect(Math.floor(px + colW - 1), py + 8, 2, panelHeight - 16);
    divider1.fill({ color: 0xf9bc60, alpha: 0.45 });
    panel.addChild(divider1);
    const divider2 = new PIXI.Graphics();
    divider2.rect(Math.floor(px + colW * 2 - 1), py + 8, 2, panelHeight - 16);
    divider2.fill({ color: 0xf9bc60, alpha: 0.45 });
    panel.addChild(divider2);

    this.uiContainer.addChild(panel);

    const pixelFont = "'Press Start 2P', monospace";
    const labelStyle = {
      fontFamily: pixelFont,
      fontSize: labelFontSize,
      fill: 0xabd1c6,
    };

    const scoreLabel = new PIXI.Text({ text: "ОЧКИ", style: labelStyle });
    scoreLabel.anchor.set(0.5, 0.5);
    scoreLabel.x = Math.floor(center1);
    scoreLabel.y = labelY;
    this.uiContainer.addChild(scoreLabel);

    this.scoreText = new PIXI.Text({
      text: "0",
      style: {
        fontFamily: pixelFont,
        fontSize: baseFontSize,
        fill: 0xfffffe,
      },
    });
    this.scoreText.resolution = 2;
    this.scoreText.anchor.set(0.5, 0.5);
    this.scoreText.x = Math.floor(center1);
    this.scoreText.y = valueY;
    this.uiContainer.addChild(this.scoreText);

    const livesLabel = new PIXI.Text({ text: "ЖИЗНИ", style: labelStyle });
    livesLabel.anchor.set(0.5, 0.5);
    livesLabel.x = Math.floor(center2);
    livesLabel.y = labelY;
    this.uiContainer.addChild(livesLabel);

    this.livesText = new PIXI.Text({
      text: "3",
      style: {
        fontFamily: pixelFont,
        fontSize: baseFontSize,
        fill: 0xff6b6b,
      },
    });
    this.livesText.resolution = 2;
    this.livesText.anchor.set(0.5, 0.5);
    this.livesText.x = Math.floor(center2);
    this.livesText.y = valueY;
    this.uiContainer.addChild(this.livesText);

    const timeLabel = new PIXI.Text({ text: "СЕК", style: labelStyle });
    timeLabel.anchor.set(0.5, 0.5);
    timeLabel.x = Math.floor(center3);
    timeLabel.y = labelY;
    this.uiContainer.addChild(timeLabel);

    this.timeText = new PIXI.Text({
      text: "30",
      style: {
        fontFamily: pixelFont,
        fontSize: baseFontSize,
        fill: 0xf9bc60,
      },
    });
    this.timeText.resolution = 2;
    this.timeText.anchor.set(0.5, 0.5);
    this.timeText.x = Math.floor(center3);
    this.timeText.y = valueY;
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
      graphics.circle(
        coin.x - coin.radius * 0.3,
        coin.y - coin.radius * 0.3,
        highlightRadius,
      );
      graphics.fill({ color: 0xffffff, alpha: 0.4 });
      graphics.circle(coin.x, coin.y, coin.radius + 2);
      graphics.stroke({ width: 1, color: 0xf9bc60, alpha: 0.5 });
      display = graphics;
    }

    display.x = coin.x;
    display.y = coin.y;
    display.eventMode = "static";
    display.cursor = "pointer";
    (
      display as PIXI.Container & {
        userData?: { x: number; y: number; radius: number };
      }
    ).userData = {
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
    display.destroy({ children: true, texture: false });
    this.coins.delete(coinId);
  }

  collectCoin(coinId: string): void {
    const display = this.coins.get(coinId);
    if (!display) return;
    playCoinCollectSound();
    const data = (
      display as PIXI.Container & {
        userData?: { x: number; y: number; radius: number };
      }
    ).userData;
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
        ring.destroy({ children: true, texture: false });
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
          particle.destroy({ children: true, texture: false });
          const index = this.particles.indexOf(particle);
          if (index > -1) {
            this.particles.splice(index, 1);
          }
        }
      };
      animateParticle();
    }

    display.removeAllListeners?.();
    display.destroy({ children: true, texture: false });
    this.coins.delete(coinId);
  }

  showMissEffect(x: number, y: number): void {
    const ring = new PIXI.Graphics();
    ring.circle(0, 0, 26);
    ring.stroke({ width: 4, color: 0xff3b3b, alpha: 0.9 });
    ring.position.set(x, y);
    this.container.addChild(ring);
    this.missEffects.push(ring);

    const startTime = Date.now();
    const duration = 260;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const t = elapsed / duration;
        ring.scale.set(1 + t * 1.2);
        ring.alpha = 0.9 * (1 - t);
        requestAnimationFrame(animate);
      } else {
        ring.removeAllListeners?.();
        ring.destroy({ children: true, texture: false });
        const idx = this.missEffects.indexOf(ring);
        if (idx > -1) this.missEffects.splice(idx, 1);
      }
    };
    animate();
  }

  clearCoins(): void {
    for (const node of this.coins.values()) {
      node.removeAllListeners?.();
      node.destroy({ children: true, texture: false });
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

  getContainer(): PIXI.Container {
    return this.container;
  }

  destroy(): void {
    if (this.bgSprite) {
      this.bgSprite.destroy({ children: true, texture: false });
      this.bgSprite = null;
    }
    this.backgroundContainer.removeChildren();
    this.backgroundContainer.destroy({ children: true, texture: false });
    this.clearCoins();
    for (const particle of this.particles) {
      particle.destroy({ children: true, texture: false });
    }
    this.particles = [];
    for (const miss of this.missEffects) {
      miss.destroy({ children: true, texture: false });
    }
    this.missEffects = [];
    this.container.destroy({ children: true });
  }
}
