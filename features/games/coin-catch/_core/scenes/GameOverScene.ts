// Сцена Game Over — адаптивный визуал, карточки, кнопки

import * as PIXI from "pixi.js";

type Viewport = { width: number; height: number };

export class GameOverScene {
  private container: PIXI.Container;
  private app: PIXI.Application;
  private onRestart: () => void;
  private onLeaderboard?: () => void;

  constructor(app: PIXI.Application, onRestart: () => void, onLeaderboard?: () => void) {
    this.container = new PIXI.Container();
    this.app = app;
    this.onRestart = onRestart;
    this.onLeaderboard = onLeaderboard;
    app.stage.addChild(this.container);
  }

  show(score: number): void {
    this.container.removeChildren();

    const width = this.app.screen?.width || 1280;
    const height = this.app.screen?.height || 720;
    const minSide = Math.min(width, height);
    const scale = Math.max(0.6, Math.min(2.5, minSide / 400));

    const titleFontSize = Math.max(24, Math.min(56, 36 * scale));
    const scoreValueFontSize = Math.max(28, Math.min(72, 48 * scale));
    const scoreLabelFontSize = Math.max(14, Math.min(22, 16 * scale));
    const buttonFontSize = Math.max(18, Math.min(28, 22 * scale));
    const pad = Math.max(16, 24 * scale);

    // Затемнённый фон поверх игры
    const overlay = new PIXI.Graphics();
    overlay.rect(0, 0, width, height);
    overlay.fill({ color: 0x000000, alpha: 0.5 });
    this.container.addChild(overlay);

    // Центральная карточка
    const cardW = Math.min(width * 0.9, 440 * scale);
    const cardH = Math.min(height * 0.75, 420 * scale);
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;
    const radius = 20 * scale;

    const card = new PIXI.Graphics();
    card.roundRect(cardX, cardY, cardW, cardH, radius);
    card.fill({ color: 0x001e1d, alpha: 0.96 });
    card.stroke({ width: 3 * scale, color: 0xf9bc60, alpha: 0.9 });
    this.container.addChild(card);

    const cardInner = new PIXI.Graphics();
    cardInner.roundRect(cardX + 3, cardY + 3, cardW - 6, cardH - 6, radius - 3);
    cardInner.stroke({ width: 1, color: 0xf9bc60, alpha: 0.2 });
    this.container.addChild(cardInner);

    const centerX = width / 2;

    const title = new PIXI.Text({
      text: "Игра окончена",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: titleFontSize,
        fill: 0xfffffe,
        align: "center",
        fontWeight: "bold",
        dropShadow: { color: 0x001e1d, blur: 4, distance: 2, alpha: 0.6 },
        stroke: { color: 0xf9bc60, width: 1 },
      },
    });
    title.anchor.set(0.5);
    title.x = centerX;
    title.y = cardY + 55 * scale;
    this.container.addChild(title);

    // Блок счёта
    const scoreBlockW = cardW * 0.6;
    const scoreBlockH = 90 * scale;
    const scoreBlockX = centerX - scoreBlockW / 2;
    const scoreBlockY = cardY + cardH / 2 - scoreBlockH / 2 - 20 * scale;

    const scoreBg = new PIXI.Graphics();
    scoreBg.roundRect(scoreBlockX, scoreBlockY, scoreBlockW, scoreBlockH, 12 * scale);
    scoreBg.fill({ color: 0x0d2827, alpha: 0.95 });
    scoreBg.stroke({ width: 2, color: 0xf9bc60, alpha: 0.5 });
    this.container.addChild(scoreBg);

    const scoreLabel = new PIXI.Text({
      text: "Ваш счёт",
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: scoreLabelFontSize,
        fill: 0xabd1c6,
        align: "center",
      },
    });
    scoreLabel.anchor.set(0.5);
    scoreLabel.x = centerX;
    scoreLabel.y = scoreBlockY + 28 * scale;
    this.container.addChild(scoreLabel);

    const scoreValue = new PIXI.Text({
      text: `${score}`,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize: scoreValueFontSize,
        fill: 0xf9bc60,
        align: "center",
        fontWeight: "bold",
      },
    });
    scoreValue.anchor.set(0.5);
    scoreValue.x = centerX;
    scoreValue.y = scoreBlockY + scoreBlockH / 2 + 12 * scale;
    this.container.addChild(scoreValue);

    const buttonW = Math.max(180, Math.min(260, 220 * scale));
    const buttonH = Math.max(48, Math.min(64, 56 * scale));
    const btnRadius = 12 * scale;

    const restartBtn = this.createButton(
      "Сыграть ещё",
      buttonW,
      buttonH,
      btnRadius,
      scale,
      buttonFontSize,
      0xf9bc60,
      0xffd700,
      () => this.onRestart(),
    );
    restartBtn.x = centerX;
    restartBtn.y = cardY + cardH - 120 * scale;
    this.container.addChild(restartBtn);

    if (this.onLeaderboard) {
      const leaderboardBtn = this.createButton(
        "Таблица недели",
        buttonW,
        buttonH,
        btnRadius,
        scale,
        buttonFontSize,
        0x2cb1b1,
        0x7dd3c0,
        () => this.onLeaderboard?.(),
      );
      leaderboardBtn.x = centerX;
      leaderboardBtn.y = cardY + cardH - 50 * scale;
      this.container.addChild(leaderboardBtn);
    }

    this.container.visible = true;
  }

  private createButton(
    text: string,
    w: number,
    h: number,
    radius: number,
    scale: number,
    fontSize: number,
    fillColor: number,
    hoverColor: number,
    onClick: () => void,
  ): PIXI.Container {
    const bg = new PIXI.Graphics();
    bg.roundRect(-w / 2, -h / 2, w, h, radius);
    bg.fill(fillColor);
    bg.stroke({ width: 2 * scale, color: 0x001e1d });

    const highlight = new PIXI.Graphics();
    highlight.roundRect(-w / 2 + 4, -h / 2 + 4, w - 8, h * 0.4, radius - 4);
    highlight.fill({ color: 0xffffff, alpha: 0.2 });
    bg.addChild(highlight);

    const label = new PIXI.Text({
      text,
      style: {
        fontFamily: "system-ui, sans-serif",
        fontSize,
        fill: 0x001e1d,
        fontWeight: "bold",
      },
    });
    label.anchor.set(0.5);

    const container = new PIXI.Container();
    container.addChild(bg);
    container.addChild(label);
    container.eventMode = "static";
    container.cursor = "pointer";

    container.on("pointerenter", () => {
      bg.clear();
      bg.roundRect(-w / 2, -h / 2, w, h, radius);
      bg.fill(hoverColor);
      bg.stroke({ width: 2 * scale, color: 0x001e1d });
      const hl = new PIXI.Graphics();
      hl.roundRect(-w / 2 + 4, -h / 2 + 4, w - 8, h * 0.4, radius - 4);
      hl.fill({ color: 0xffffff, alpha: 0.25 });
      bg.addChild(hl);
      container.scale.set(1.03);
    });
    container.on("pointerleave", () => {
      bg.removeChildren();
      bg.clear();
      bg.roundRect(-w / 2, -h / 2, w, h, radius);
      bg.fill(fillColor);
      bg.stroke({ width: 2 * scale, color: 0x001e1d });
      const hl = new PIXI.Graphics();
      hl.roundRect(-w / 2 + 4, -h / 2 + 4, w - 8, h * 0.4, radius - 4);
      hl.fill({ color: 0xffffff, alpha: 0.2 });
      bg.addChild(hl);
      container.scale.set(1);
    });
    container.on("pointerdown", () => container.scale.set(0.97));
    container.on("pointerup", () => container.scale.set(1.03));
    container.on("pointerupoutside", () => container.scale.set(1));
    container.on("pointertap", onClick);

    return container;
  }

  hide(): void {
    this.container.visible = false;
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
