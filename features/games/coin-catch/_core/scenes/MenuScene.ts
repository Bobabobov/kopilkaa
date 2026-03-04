// Сцена меню — адаптивный визуал и кнопки

import * as PIXI from "pixi.js";
import { playButtonSound } from "../../_services/sfx";

type Viewport = { width: number; height: number };

export class MenuScene {
  private container: PIXI.Container;
  private app: PIXI.Application;
  private onStart: () => void;
  private uiRoot: PIXI.Container | null = null;

  constructor(app: PIXI.Application, onStart: () => void) {
    this.container = new PIXI.Container();
    this.app = app;
    this.onStart = onStart;
    app.stage.addChild(this.container);
    this.buildUI(
      this.app.screen?.width || 1280,
      this.app.screen?.height || 720,
    );
  }

  private getScale(width: number, height: number): number {
    const minSide = Math.min(width, height);
    return Math.max(0.5, Math.min(2.5, minSide / 380));
  }

  private buildUI(width: number, height: number): void {
    if (this.uiRoot) {
      this.container.removeChild(this.uiRoot);
      this.uiRoot.destroy({ children: true });
    }
    this.uiRoot = new PIXI.Container();

    const scale = this.getScale(width, height);
    const isSmall = Math.min(width, height) < 420;

    const FONT = "'Press Start 2P', monospace";
    const PAD = Math.max(20, Math.floor(24 * scale));
    const R = Math.max(10, Math.floor(14 * scale));
    const SPACE_S = Math.floor(6 * scale);
    const SPACE_M = Math.floor(12 * scale);
    const SPACE_L = Math.floor(20 * scale);

    const content = new PIXI.Container();
    let y = 0;

    const coinSize = Math.max(36, Math.min(56, Math.floor(46 * scale)));
    const coinBox = new PIXI.Container();
    coinBox.x = 0;
    coinBox.y = y;

    let coinTexture: PIXI.Texture | undefined;
    try {
      coinTexture = PIXI.Assets.get("/coin/co/1.png") ?? PIXI.Texture.from("/coin/co/1.png");
    } catch {
      coinTexture = undefined;
    }
    const tw = Number(coinTexture?.width) || coinSize;
    const th = Number(coinTexture?.height) || coinSize;
    const w = tw > 0 ? tw : coinSize;
    const h = th > 0 ? th : coinSize;

    if (coinTexture && w > 0 && h > 0) {
      const coin = new PIXI.Sprite(coinTexture);
      coin.anchor.set(0.5, 0);
      const s = Math.min(coinSize / w, coinSize / h, 2);
      coin.scale.set(s);
      coinBox.addChild(coin);
    } else {
      const coin = new PIXI.Graphics();
      coin.circle(0, coinSize / 2, coinSize / 2);
      coin.fill({ color: 0xf9bc60, alpha: 1 });
      coin.stroke({ width: 2, color: 0xe8a545 });
      const inner = new PIXI.Graphics();
      inner.circle(0, coinSize / 2, coinSize / 6);
      inner.fill({ color: 0x0c1f1e, alpha: 0.6 });
      coin.addChild(inner);
      coinBox.addChild(coin);
    }

    content.addChild(coinBox);
    y += coinSize + SPACE_M;

    const titleSize = Math.max(12, Math.min(20, Math.floor(16 * scale)));
    const title = new PIXI.Text({
      text: "Монетка",
      style: {
        fontFamily: FONT,
        fontSize: titleSize,
        fill: 0xffffff,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 2, distance: 0, alpha: 0.8 },
      },
    });
    title.anchor.set(0.5, 0);
    title.x = 0;
    title.y = y;
    content.addChild(title);
    y += title.height + SPACE_S;

    const metaSize = Math.max(8, Math.min(12, Math.floor(10 * scale)));
    const stats = new PIXI.Text({
      text: "30 СЕК • 3 ЖИЗНИ",
      style: {
        fontFamily: FONT,
        fontSize: metaSize,
        fill: 0xf9bc60,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 1, distance: 0, alpha: 0.6 },
      },
    });
    stats.anchor.set(0.5, 0);
    stats.x = 0;
    stats.y = y;
    content.addChild(stats);
    y += stats.height + SPACE_L;

    const descSize = Math.max(8, Math.min(11, Math.floor(10 * scale)));
    const rule1 = new PIXI.Text({
      text: "СОБИРАЙ МОНЕТЫ КЛИКОМ.",
      style: {
        fontFamily: FONT,
        fontSize: descSize,
        fill: 0x9bb5ad,
        align: "center",
      },
    });
    rule1.anchor.set(0.5, 0);
    rule1.x = 0;
    rule1.y = y;
    content.addChild(rule1);
    y += rule1.height + SPACE_S;

    const rule2 = new PIXI.Text({
      text: "КЛИК МИМО — МИНУС ЖИЗНЬ.",
      style: {
        fontFamily: FONT,
        fontSize: descSize,
        fill: 0x9bb5ad,
        align: "center",
      },
    });
    rule2.anchor.set(0.5, 0);
    rule2.x = 0;
    rule2.y = y;
    content.addChild(rule2);
    y += rule2.height;

    const btnFontSize = Math.max(8, Math.min(12, Math.floor(10 * scale)));
    const buttonLabel = new PIXI.Text({
      text: "НАЧАТЬ ИГРУ",
      style: {
        fontFamily: FONT,
        fontSize: btnFontSize,
        fill: 0x0c1f1e,
        align: "center",
      },
    });
    buttonLabel.anchor.set(0.5);

    const btnPadH = Math.floor(24 * scale);
    const btnPadV = Math.floor(12 * scale);
    const btnW = Math.ceil(buttonLabel.width) + btnPadH * 2;
    const btnH = Math.max(32, Math.min(44, Math.floor(38 * scale)));
    const btnR = Math.max(8, Math.floor(10 * scale));

    const gapBeforeBtn = Math.max(
      SPACE_L,
      Math.ceil(btnH * 0.5) + (isSmall ? Math.max(12, Math.floor(14 * scale)) : Math.floor(12 * scale)),
    );
    y += gapBeforeBtn;

    const btn = new PIXI.Container();
    const btnBg = new PIXI.Graphics();
    btnBg.roundRect(-btnW / 2, -btnH / 2, btnW, btnH, btnR);
    btnBg.fill({ color: 0xf9bc60, alpha: 1 });
    btnBg.stroke({ width: 1, color: 0xe8a545 });
    const btnTop = new PIXI.Graphics();
    btnTop.roundRect(-btnW / 2 + 2, -btnH / 2 + 2, btnW - 4, Math.floor(btnH * 0.32), btnR - 2);
    btnTop.fill({ color: 0xffffff, alpha: 0.15 });
    btnBg.addChild(btnTop);
    btn.addChild(btnBg);
    btn.addChild(buttonLabel);
    btn.x = 0;
    btn.y = y;
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const redrawBtn = (hover: boolean) => {
      btnBg.removeChildren();
      btnBg.clear();
      btnBg.roundRect(-btnW / 2, -btnH / 2, btnW, btnH, btnR);
      btnBg.fill({ color: hover ? 0xffd166 : 0xf9bc60, alpha: 1 });
      btnBg.stroke({ width: 1, color: hover ? 0xf0c050 : 0xe8a545 });
      const top = new PIXI.Graphics();
      top.roundRect(-btnW / 2 + 2, -btnH / 2 + 2, btnW - 4, Math.floor(btnH * 0.32), btnR - 2);
      top.fill({ color: 0xffffff, alpha: hover ? 0.2 : 0.15 });
      btnBg.addChild(top);
    };

    btn.on("pointerenter", () => {
      playButtonSound();
      redrawBtn(true);
      btn.scale.set(1.02);
    });
    btn.on("pointerleave", () => {
      redrawBtn(false);
      btn.scale.set(1);
    });
    btn.on("pointerdown", () => {
      playButtonSound();
      btn.scale.set(0.98);
    });
    btn.on("pointerup", () => btn.scale.set(1.02));
    btn.on("pointerupoutside", () => btn.scale.set(1));
    btn.on("pointertap", () => {
      playButtonSound();
      this.onStart();
    });

    content.addChild(btn);

    const bounds = content.getLocalBounds();
    const panelW = Math.ceil(bounds.width + PAD * 2);
    const panelH = Math.ceil(bounds.height + PAD * 2);
    const px = Math.floor((width - panelW) / 2);
    const py = Math.floor((height - panelH) / 2);

    const card = new PIXI.Graphics();
    card.roundRect(px, py, panelW, panelH, R);
    card.fill({ color: 0x0c1f1e, alpha: 0.98 });
    card.stroke({ width: 1, color: 0x1e4a47 });
    this.uiRoot.addChild(card);

    content.x = px + PAD - bounds.x;
    content.y = py + PAD - bounds.y;
    this.uiRoot.addChild(content);
    this.container.addChild(this.uiRoot);
  }

  onResize(viewport: Viewport): void {
    this.buildUI(viewport.width, viewport.height);
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
    this.uiRoot = null;
    this.container.destroy({ children: true });
  }
}
