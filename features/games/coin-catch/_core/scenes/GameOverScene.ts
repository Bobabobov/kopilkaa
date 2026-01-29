// Сцена Game Over — адаптивный визуал, карточки, кнопки

import * as PIXI from "pixi.js";
import { playButtonSound } from "../../_services/sfx";

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

    const pixelFont = "'Press Start 2P', monospace";
    const titleFontSize = Math.max(14, Math.min(22, Math.floor(18 * scale)));
    const scoreValueFontSize = Math.max(18, Math.min(28, Math.floor(24 * scale)));
    const scoreLabelFontSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));
    const buttonFontSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));
    const pad = Math.max(12, Math.floor(18 * scale));
    const radius = Math.max(8, Math.floor(12 * scale));

    // Затемнённый фон поверх игры
    const overlay = new PIXI.Graphics();
    overlay.rect(0, 0, width, height);
    overlay.fill({ color: 0x000000, alpha: 0.25 });
    this.container.addChild(overlay);

    const content = new PIXI.Container();
    let y = 0;

    const title = new PIXI.Text({
      text: "Игра окончена",
      style: {
        fontFamily: pixelFont,
        fontSize: titleFontSize,
        fill: 0xfffffe,
        align: "center",
        dropShadow: { color: 0x001e1d, blur: 3, distance: 2, alpha: 0.8 },
        stroke: { color: 0xf9bc60, width: 1 },
      },
    });
    title.anchor.set(0.5, 0);
    title.x = 0;
    title.y = y;
    content.addChild(title);
    y += title.height + Math.floor(10 * scale);

    // Блок счёта
    const scoreBlockW = Math.max(180, Math.floor(240 * scale));
    const scoreBlockH = Math.max(72, Math.floor(80 * scale));

    const scoreBg = new PIXI.Graphics();
    scoreBg.roundRect(-scoreBlockW / 2, 0, scoreBlockW, scoreBlockH, Math.max(6, Math.floor(10 * scale)));
    scoreBg.fill({ color: 0x001e1d, alpha: 0.55 });
    scoreBg.stroke({ width: 2, color: 0xf9bc60, alpha: 0.6 });
    content.addChild(scoreBg);

    const scoreLabel = new PIXI.Text({
      text: "Ваш счёт",
      style: {
        fontFamily: pixelFont,
        fontSize: scoreLabelFontSize,
        fill: 0xabd1c6,
        align: "center",
      },
    });
    scoreLabel.anchor.set(0.5, 0);
    scoreLabel.x = 0;
    scoreLabel.y = y + Math.floor(14 * scale);
    content.addChild(scoreLabel);

    const scoreValue = new PIXI.Text({
      text: `${score}`,
      style: {
        fontFamily: pixelFont,
        fontSize: scoreValueFontSize,
        fill: 0xf9bc60,
        align: "center",
      },
    });
    scoreValue.anchor.set(0.5, 0);
    scoreValue.x = 0;
    scoreValue.y = y + Math.floor(32 * scale);
    content.addChild(scoreValue);

    // центрируем блок счета
    scoreBg.y = y;
    y += scoreBlockH + Math.floor(10 * scale);

    const divider = new PIXI.Graphics();
    divider.rect(-scoreBlockW / 2, y, scoreBlockW, 2);
    divider.fill({ color: 0xf9bc60, alpha: 0.25 });
    content.addChild(divider);
    y += Math.floor(12 * scale);

    const buttonW = Math.max(180, Math.floor(220 * scale));
    const buttonH = Math.max(42, Math.min(56, Math.floor(48 * scale)));
    const btnRadius = Math.max(6, Math.floor(10 * scale));

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
    restartBtn.x = 0;
    restartBtn.y = y;
    content.addChild(restartBtn);
    y += buttonH + Math.floor(12 * scale);

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
      leaderboardBtn.x = 0;
      leaderboardBtn.y = y;
      content.addChild(leaderboardBtn);
      y += buttonH;
    }

    const bounds = content.getLocalBounds();
    const cardW = Math.ceil(bounds.width + pad * 2);
    const cardH = Math.ceil(bounds.height + pad * 2);
    const cardX = Math.floor((width - cardW) / 2);
    const cardY = Math.floor((height - cardH) / 2);

    const cardShadow = new PIXI.Graphics();
    cardShadow.roundRect(cardX + 4, cardY + 6, cardW, cardH, radius);
    cardShadow.fill({ color: 0x000000, alpha: 0.25 });
    this.container.addChild(cardShadow);

    const card = new PIXI.Graphics();
    card.roundRect(cardX, cardY, cardW, cardH, radius);
    card.fill({ color: 0x001e1d, alpha: 0.35 });
    card.stroke({ width: 3, color: 0xf9bc60, alpha: 0.9 });
    this.container.addChild(card);

    const cardInner = new PIXI.Graphics();
    cardInner.roundRect(cardX + 3, cardY + 3, cardW - 6, cardH - 6, Math.max(4, radius - 4));
    cardInner.stroke({ width: 1, color: 0xf9bc60, alpha: 0.35 });
    this.container.addChild(cardInner);

    const topHighlight = new PIXI.Graphics();
    topHighlight.roundRect(cardX + 6, cardY + 6, cardW - 12, 6, Math.max(3, radius - 6));
    topHighlight.fill({ color: 0xffffff, alpha: 0.06 });
    this.container.addChild(topHighlight);

    const cornerSize = Math.max(4, Math.floor(6 * scale));
    const corners = new PIXI.Graphics();
    corners.rect(cardX + 6, cardY + 6, cornerSize, cornerSize);
    corners.rect(cardX + cardW - 6 - cornerSize, cardY + 6, cornerSize, cornerSize);
    corners.rect(cardX + 6, cardY + cardH - 6 - cornerSize, cornerSize, cornerSize);
    corners.rect(cardX + cardW - 6 - cornerSize, cardY + cardH - 6 - cornerSize, cornerSize, cornerSize);
    corners.fill({ color: 0xf9bc60, alpha: 0.55 });
    this.container.addChild(corners);

    content.x = cardX + pad - bounds.x;
    content.y = cardY + pad - bounds.y;
    this.container.addChild(content);

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
        fontFamily: "'Press Start 2P', monospace",
        fontSize,
        fill: 0x001e1d,
      },
    });
    label.anchor.set(0.5);

    const container = new PIXI.Container();
    container.addChild(bg);
    container.addChild(label);
    container.eventMode = "static";
    container.cursor = "pointer";

    container.on("pointerenter", () => {
      playButtonSound();
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
    container.on("pointerdown", () => {
      playButtonSound();
      container.scale.set(0.97);
    });
    container.on("pointerup", () => container.scale.set(1.03));
    container.on("pointerupoutside", () => container.scale.set(1));
    container.on("pointertap", () => {
      playButtonSound();
      onClick();
    });

    return container;
  }

  hide(): void {
    this.container.visible = false;
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
