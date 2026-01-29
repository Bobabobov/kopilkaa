// Сцена меню — адаптивный визуал и кнопки

import * as PIXI from "pixi.js";

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
    const minSide = Math.min(width, height);
    const baseFontSize = Math.max(20, Math.min(64, 40 * scale));
    const descFontSize = Math.max(14, Math.min(28, 18 * scale));
    const buttonFontSize = Math.max(18, Math.min(32, 22 * scale));
    const pad = Math.max(12, 20 * scale);

    // Фон меню — полупрозрачная панель по центру
    const panelW = Math.min(width * 0.92, 520 * scale);
    const panelH = Math.min(height * 0.7, 380 * scale);
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    const panel = new PIXI.Graphics();
    panel.roundRect(panelX, panelY, panelW, panelH, 20 * scale);
    panel.fill({ color: 0x001e1d, alpha: 0.92 });
    panel.stroke({ width: 3 * scale, color: 0xf9bc60, alpha: 0.9 });
    this.uiRoot.addChild(panel);

    const inner = new PIXI.Graphics();
    inner.roundRect(panelX + 4, panelY + 4, panelW - 8, panelH - 8, 16 * scale);
    inner.stroke({ width: 1, color: 0xf9bc60, alpha: 0.25 });
    this.uiRoot.addChild(inner);

    // Заголовок
    const title = new PIXI.Text({
      text: "Монеткосбор 90-х",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: baseFontSize,
        fill: 0xfffffe,
        align: "center",
        fontWeight: "bold",
        dropShadow: { color: 0x001e1d, blur: 4, distance: 2, alpha: 0.8 },
        stroke: { color: 0xf9bc60, width: 1.5 * scale },
      },
    });
    title.anchor.set(0.5);
    title.x = width / 2;
    title.y = panelY + 70 * scale;
    this.uiRoot.addChild(title);

    // Подзаголовок
    const subtitle = new PIXI.Text({
      text: "30 секунд • 3 жизни",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: descFontSize * 0.9,
        fill: 0xf9bc60,
        align: "center",
      },
    });
    subtitle.anchor.set(0.5);
    subtitle.x = width / 2;
    subtitle.y = title.y + baseFontSize * 0.9;
    this.uiRoot.addChild(subtitle);

    // Описание в блоке
    const description = new PIXI.Text({
      text: "Собирай монеты кликом.\nКлик мимо — минус жизнь.",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: descFontSize,
        fill: 0xabd1c6,
        align: "center",
        lineHeight: descFontSize * 1.35,
      },
    });
    description.anchor.set(0.5);
    description.x = width / 2;
    description.y = panelY + panelH / 2 - 30 * scale;
    this.uiRoot.addChild(description);

    // Кнопка «Начать игру»
    const buttonWidth = Math.max(200, Math.min(panelW * 0.85, 280 * scale));
    const buttonHeight = Math.max(52, Math.min(72, 60 * scale));
    const radius = 14 * scale;

    const buttonBg = new PIXI.Graphics();
    buttonBg.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
    buttonBg.fill({ color: 0xf9bc60, alpha: 1 });
    buttonBg.stroke({ width: 2 * scale, color: 0x001e1d });

    const buttonHighlight = new PIXI.Graphics();
    buttonHighlight.roundRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth - 8, buttonHeight * 0.4, radius - 4);
    buttonHighlight.fill({ color: 0xffffff, alpha: 0.2 });
    buttonBg.addChild(buttonHighlight);

    const buttonText = new PIXI.Text({
      text: "Начать игру",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: buttonFontSize,
        fill: 0x001e1d,
        fontWeight: "bold",
      },
    });
    buttonText.anchor.set(0.5);

    const buttonContainer = new PIXI.Container();
    buttonContainer.addChild(buttonBg);
    buttonContainer.addChild(buttonText);
    buttonContainer.x = width / 2;
    buttonContainer.y = panelY + panelH - 80 * scale;
    buttonContainer.eventMode = "static";
    buttonContainer.cursor = "pointer";

    buttonContainer.on("pointerenter", () => {
      buttonBg.clear();
      buttonBg.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
      buttonBg.fill({ color: 0xffd700, alpha: 1 });
      buttonBg.stroke({ width: 2 * scale, color: 0x001e1d });
      const hl = new PIXI.Graphics();
      hl.roundRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth - 8, buttonHeight * 0.4, radius - 4);
      hl.fill({ color: 0xffffff, alpha: 0.25 });
      buttonBg.addChild(hl);
      buttonContainer.scale.set(1.02);
    });
    buttonContainer.on("pointerleave", () => {
      buttonBg.removeChildren();
      buttonBg.clear();
      buttonBg.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
      buttonBg.fill({ color: 0xf9bc60, alpha: 1 });
      buttonBg.stroke({ width: 2 * scale, color: 0x001e1d });
      const hl = new PIXI.Graphics();
      hl.roundRect(-buttonWidth / 2 + 4, -buttonHeight / 2 + 4, buttonWidth - 8, buttonHeight * 0.4, radius - 4);
      hl.fill({ color: 0xffffff, alpha: 0.2 });
      buttonBg.addChild(hl);
      buttonContainer.scale.set(1);
    });
    buttonContainer.on("pointerdown", () => {
      buttonContainer.scale.set(0.98);
    });
    buttonContainer.on("pointerup", () => {
      buttonContainer.scale.set(1.02);
    });
    buttonContainer.on("pointerupoutside", () => {
      buttonContainer.scale.set(1);
    });
    buttonContainer.on("pointertap", () => {
      this.onStart();
    });

    this.uiRoot.addChild(buttonContainer);
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

  destroy(): void {
    this.uiRoot = null;
    this.container.destroy({ children: true });
  }
}
