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
    this.buildUI(this.app.screen?.width || 1280, this.app.screen?.height || 720);
  }

  private getScale(width: number, height: number): number {
    const minSide = Math.min(width, height);
    return Math.max(0.6, Math.min(2.5, minSide / 400));
  }

  private buildUI(width: number, height: number): void {
    if (this.uiRoot) {
      this.container.removeChild(this.uiRoot);
      this.uiRoot.destroy({ children: true });
    }
    this.uiRoot = new PIXI.Container();

    const scale = this.getScale(width, height);
    const pad = Math.max(8, Math.floor(12 * scale));
    const radius = Math.max(5, Math.floor(8 * scale));

    const pixelFont = "'Press Start 2P', monospace";
    const titleSize = Math.max(14, Math.min(22, Math.floor(18 * scale)));
    const subtitleSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));
    const descSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));
    const buttonFontSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));

    const content = new PIXI.Container();
    let y = 0;

    const title = new PIXI.Text({
      text: "Монеткосбор 90-х",
      style: {
        fontFamily: pixelFont,
        fontSize: titleSize,
        fill: 0xfffffe,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 3, distance: 2, alpha: 0.9 },
        stroke: { color: 0xf9bc60, width: 1 },
      },
    });
    title.anchor.set(0.5, 0);
    title.x = 0;
    title.y = y;
    content.addChild(title);
    y += title.height + Math.floor(6 * scale);

    const subtitle = new PIXI.Text({
      text: "30 СЕК • 3 ЖИЗНИ",
      style: {
        fontFamily: pixelFont,
        fontSize: subtitleSize,
        fill: 0xf9bc60,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 2, distance: 1, alpha: 0.8 },
      },
    });
    subtitle.anchor.set(0.5, 0);
    subtitle.x = 0;
    subtitle.y = y;
    content.addChild(subtitle);
    y += subtitle.height + Math.floor(8 * scale);

    const line1 = new PIXI.Text({
      text: "СОБИРАЙ МОНЕТЫ КЛИКОМ.",
      style: {
        fontFamily: pixelFont,
        fontSize: descSize,
        fill: 0xabd1c6,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 2, distance: 1, alpha: 0.8 },
      },
    });
    line1.anchor.set(0.5, 0);
    line1.x = 0;
    line1.y = y;
    content.addChild(line1);
    y += line1.height + Math.floor(4 * scale);

    const line2 = new PIXI.Text({
      text: "КЛИК МИМО — МИНУС ЖИЗНЬ.",
      style: {
        fontFamily: pixelFont,
        fontSize: descSize,
        fill: 0xabd1c6,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 2, distance: 1, alpha: 0.8 },
      },
    });
    line2.anchor.set(0.5, 0);
    line2.x = 0;
    line2.y = y;
    content.addChild(line2);
    y += line2.height + Math.floor(10 * scale);

    const buttonText = new PIXI.Text({
      text: "НАЧАТЬ ИГРУ",
      style: {
        fontFamily: pixelFont,
        fontSize: buttonFontSize,
        fill: 0x001e1d,
      },
    });
    buttonText.anchor.set(0.5);

    const maxTextWidth = Math.max(title.width, subtitle.width, line1.width, line2.width);
    const buttonWidth = Math.max(
      Math.ceil(buttonText.width + 40 * scale),
      Math.ceil(maxTextWidth),
    );
    const buttonHeight = Math.max(42, Math.min(52, Math.floor(48 * scale)));
    const btnRadius = Math.max(6, Math.floor(10 * scale));

    const buttonBg = new PIXI.Graphics();
    buttonBg.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, btnRadius);
    buttonBg.fill({ color: 0xf9bc60, alpha: 1 });
    buttonBg.stroke({ width: 2, color: 0x001e1d });

    const buttonHighlight = new PIXI.Graphics();
    buttonHighlight.roundRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth - 8, Math.floor(buttonHeight * 0.4), btnRadius - 4);
    buttonHighlight.fill({ color: 0xffffff, alpha: 0.2 });
    buttonBg.addChild(buttonHighlight);

    const buttonContainer = new PIXI.Container();
    buttonContainer.addChild(buttonBg);
    buttonContainer.addChild(buttonText);
    buttonContainer.x = 0;
    buttonContainer.y = y;
    buttonContainer.eventMode = "static";
    buttonContainer.cursor = "pointer";

    buttonContainer.on("pointerenter", () => {
      playButtonSound();
      buttonBg.clear();
      buttonBg.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, btnRadius);
      buttonBg.fill({ color: 0xffd700, alpha: 1 });
      buttonBg.stroke({ width: 2, color: 0x001e1d });
      const hl = new PIXI.Graphics();
      hl.roundRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth - 8, Math.floor(buttonHeight * 0.4), btnRadius - 4);
      hl.fill({ color: 0xffffff, alpha: 0.25 });
      buttonBg.addChild(hl);
      buttonContainer.scale.set(1.02);
    });
    buttonContainer.on("pointerleave", () => {
      buttonBg.removeChildren();
      buttonBg.clear();
      buttonBg.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, btnRadius);
      buttonBg.fill({ color: 0xf9bc60, alpha: 1 });
      buttonBg.stroke({ width: 2, color: 0x001e1d });
      const hl = new PIXI.Graphics();
      hl.roundRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth - 8, Math.floor(buttonHeight * 0.4), btnRadius - 4);
      hl.fill({ color: 0xffffff, alpha: 0.2 });
      buttonBg.addChild(hl);
      buttonContainer.scale.set(1);
    });
    buttonContainer.on("pointerdown", () => {
      playButtonSound();
      buttonContainer.scale.set(0.98);
    });
    buttonContainer.on("pointerup", () => {
      buttonContainer.scale.set(1.02);
    });
    buttonContainer.on("pointerupoutside", () => {
      buttonContainer.scale.set(1);
    });
    buttonContainer.on("pointertap", () => {
      playButtonSound();
      this.onStart();
    });

    content.addChild(buttonContainer);

    const bounds = content.getLocalBounds();
    const panelW = Math.ceil(bounds.width + pad * 2);
    const panelH = Math.ceil(bounds.height + pad * 2);
    const panelX = Math.floor((width - panelW) / 2);
    const panelY = Math.floor((height - panelH) / 2);

    const panel = new PIXI.Graphics();
    panel.roundRect(panelX, panelY, panelW, panelH, radius);
    panel.fill({ color: 0x001e1d, alpha: 0.5 });
    panel.stroke({ width: 3, color: 0xf9bc60, alpha: 0.9 });
    this.uiRoot.addChild(panel);

    const inner = new PIXI.Graphics();
    inner.roundRect(panelX + 4, panelY + 4, panelW - 8, panelH - 8, Math.max(4, radius - 4));
    inner.stroke({ width: 1, color: 0xf9bc60, alpha: 0.4 });
    this.uiRoot.addChild(inner);

    content.x = panelX + pad - bounds.x;
    content.y = panelY + pad - bounds.y;
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
