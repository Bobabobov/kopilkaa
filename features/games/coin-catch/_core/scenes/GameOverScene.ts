// Сцена Game Over — адаптивный визуал, карточки, кнопки

import * as PIXI from "pixi.js";
import { playButtonSound } from "../../_services/sfx";

type Viewport = { width: number; height: number };

export class GameOverScene {
  private container: PIXI.Container;
  private app: PIXI.Application;
  private onRestart: () => void;
  private onLeaderboard?: () => void;

  constructor(
    app: PIXI.Application,
    onRestart: () => void,
    onLeaderboard?: () => void,
  ) {
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
    let scale = Math.max(0.6, Math.min(2.5, minSide / 400));
    const margin = 48;
    const approxContentH = 104 * scale + 258;
    if (approxContentH + margin > height) {
      const scaleByHeight = Math.max(0.6, (height - margin - 258) / 104);
      scale = Math.min(scale, scaleByHeight);
    }

    const pixelFont = "'Press Start 2P', monospace";
    const titleFontSize = Math.max(14, Math.min(22, Math.floor(18 * scale)));
    const scoreValueFontSize = Math.max(
      18,
      Math.min(28, Math.floor(24 * scale)),
    );
    const scoreLabelFontSize = Math.max(
      10,
      Math.min(14, Math.floor(12 * scale)),
    );
    const buttonFontSize = Math.max(10, Math.min(14, Math.floor(12 * scale)));
    const pad = Math.max(20, Math.floor(24 * scale));
    const radius = Math.max(12, Math.floor(16 * scale));

    // Затемнённый фон — как в модалках (bg-black/60)
    const overlay = new PIXI.Graphics();
    overlay.rect(0, 0, width, height);
    overlay.fill({ color: 0x000000, alpha: 0.6 });
    this.container.addChild(overlay);

    const content = new PIXI.Container();
    let y = 0;

    // Иконка сверху — /coin/co/1.png как в модалках (загружаем явно, чтобы точно была)
    const iconSize = Math.max(48, Math.floor(56 * scale));
    const iconCenterY = y + iconSize / 2;
    const iconContainer = new PIXI.Container();
    const iconBg = new PIXI.Graphics();
    iconBg.roundRect(-iconSize / 2, 0, iconSize, iconSize, iconSize / 2);
    iconBg.fill({ color: 0xf9bc60, alpha: 0.15 });
    iconBg.stroke({ width: 2, color: 0xf9bc60, alpha: 0.3 });
    iconBg.y = y;
    iconContainer.addChild(iconBg);
    PIXI.Assets.load("/coin/co/1.png").catch(() => null).then((tex) => {
      if (!tex || !iconContainer.parent) return;
      const iconSprite = new PIXI.Sprite(tex);
      const iconScale = (iconSize * 0.6) / Math.max(iconSprite.width, iconSprite.height);
      iconSprite.scale.set(iconScale);
      iconSprite.anchor.set(0.5);
      iconSprite.x = 0;
      iconSprite.y = iconCenterY;
      iconContainer.addChild(iconSprite);
    });
    content.addChild(iconContainer);
    y += iconSize + Math.max(12, Math.floor(16 * scale));

    const title = new PIXI.Text({
      text: "Игра окончена",
      style: {
        fontFamily: pixelFont,
        fontSize: titleFontSize,
        fill: 0xfffffe,
        align: "center",
      },
    });
    title.anchor.set(0.5, 0);
    title.x = 0;
    title.y = y;
    content.addChild(title);
    y += title.height + Math.floor(14 * scale);

    // Блок счёта — компактная плашка (rounded-xl, золотая обводка)
    const scoreBlockW = Math.max(120, Math.floor(160 * scale));
    const scoreBlockH = Math.max(52, Math.floor(60 * scale));
    const scoreRadius = Math.max(8, Math.floor(12 * scale));

    const scoreBg = new PIXI.Graphics();
    scoreBg.roundRect(-scoreBlockW / 2, 0, scoreBlockW, scoreBlockH, scoreRadius);
    scoreBg.fill({ color: 0xf9bc60, alpha: 0.15 });
    scoreBg.stroke({ width: 2, color: 0xf9bc60, alpha: 0.4 });
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
    scoreLabel.y = y + Math.floor(8 * scale);
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
    scoreValue.y = y + Math.floor(26 * scale);
    content.addChild(scoreValue);

    scoreBg.y = y;
    y += scoreBlockH + Math.floor(16 * scale);

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
    y += buttonH + Math.floor(14 * scale);

    if (this.onLeaderboard) {
      const leaderboardBtn = this.createOutlineButton(
        "Таблица недели",
        buttonW,
        buttonH,
        btnRadius,
        scale,
        buttonFontSize,
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

    // Тень как у модалок: 0_0_0_1px + 0_24px_48px
    const cardShadow = new PIXI.Graphics();
    cardShadow.roundRect(cardX + 1, cardY + 2, cardW, cardH, radius + 1);
    cardShadow.fill({ color: 0x000000, alpha: 0.4 });
    this.container.addChild(cardShadow);
    const cardShadow2 = new PIXI.Graphics();
    cardShadow2.roundRect(cardX + 4, cardY + 12, cardW, cardH, radius + 2);
    cardShadow2.fill({ color: 0x000000, alpha: 0.5 });
    this.container.addChild(cardShadow2);

    const card = new PIXI.Graphics();
    card.roundRect(cardX, cardY, cardW, cardH, radius);
    card.fill(0x0e2422);
    card.stroke({ width: 2, color: 0x1e4a47 });
    this.container.addChild(card);

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
    const strokeW = 1;
    const bg = new PIXI.Graphics();
    bg.roundRect(-w / 2, -h / 2, w, h, radius);
    bg.fill(fillColor);
    bg.stroke({ width: strokeW, color: fillColor, alpha: 0.4 });

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

    const redraw = (hover: boolean) => {
      const c = hover ? hoverColor : fillColor;
      bg.clear();
      bg.roundRect(-w / 2, -h / 2, w, h, radius);
      bg.fill(c);
      bg.stroke({ width: strokeW, color: c, alpha: 0.4 });
    };

    container.on("pointerenter", () => {
      playButtonSound();
      redraw(true);
      container.scale.set(1.02);
    });
    container.on("pointerleave", () => {
      redraw(false);
      container.scale.set(1);
    });
    container.on("pointerdown", () => {
      playButtonSound();
      container.scale.set(0.98);
    });
    container.on("pointerup", () => container.scale.set(1.02));
    container.on("pointerupoutside", () => container.scale.set(1));
    container.on("pointertap", () => {
      playButtonSound();
      onClick();
    });

    return container;
  }

  private createOutlineButton(
    text: string,
    w: number,
    h: number,
    radius: number,
    scale: number,
    fontSize: number,
    onClick: () => void,
  ): PIXI.Container {
    const strokeW = Math.max(1, Math.floor(2 * scale));
    const borderColor = 0xf9bc60;
    const fillColor = 0x0e2422;
    const fillHoverAlpha = 0.08;

    const bg = new PIXI.Graphics();
    bg.roundRect(-w / 2, -h / 2, w, h, radius);
    bg.fill(fillColor);
    bg.stroke({ width: strokeW, color: borderColor, alpha: 0.5 });

    const label = new PIXI.Text({
      text,
      style: {
        fontFamily: "'Press Start 2P', monospace",
        fontSize,
        fill: borderColor,
      },
    });
    label.anchor.set(0.5);

    const container = new PIXI.Container();
    container.addChild(bg);
    container.addChild(label);
    container.eventMode = "static";
    container.cursor = "pointer";

    const redrawBg = (hover: boolean) => {
      bg.clear();
      bg.roundRect(-w / 2, -h / 2, w, h, radius);
      bg.fill(hover ? { color: borderColor, alpha: fillHoverAlpha } : fillColor);
      bg.stroke({ width: strokeW, color: borderColor, alpha: hover ? 0.75 : 0.5 });
    };

    container.on("pointerenter", () => {
      playButtonSound();
      redrawBg(true);
      container.scale.set(1.02);
    });
    container.on("pointerleave", () => {
      redrawBg(false);
      container.scale.set(1);
    });
    container.on("pointerdown", () => {
      playButtonSound();
      container.scale.set(0.98);
    });
    container.on("pointerup", () => container.scale.set(1.02));
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
