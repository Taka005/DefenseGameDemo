import { Scene } from "phaser";
import { MainScene } from "./MainScene";
import { HudScene } from "./HudScene";

export class GameOverScene extends Scene {
  public static readonly KEY: string = "GameOverScene";

  constructor() {
    super({ key: GameOverScene.KEY });
  }

  public create(): void {
    this.add.rectangle(
      0,
      this.scale.height / 2,
      this.scale.width,
      120,
      0xffffff
    ).setAlpha(.8).setOrigin(0, 0.5);

    this.add.rectangle(
      0,
      this.scale.height / 2 + 85,
      this.scale.width,
      50,
      0x000000
    ).setAlpha(.8).setOrigin(0, 0.5);

    const gameMsg = this.add.bitmapText(
      this.scale.width / 2,
      this.scale.height / 2,
      "DotGothic16_Black",
      "Game Over",
      72,
      1
    );

    gameMsg.setOrigin(0.5, 0.5);

    const startMsg = this.add.bitmapText(
      this.scale.width / 2,
      this.scale.height / 2 + 85,
      "DotGothic16_White",
      "クリックしてリトライ",
      24
    ).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: startMsg,
      alpha: 0,
      duration: 800,
      ease: (value: number) => Math.abs(Math.round(value)),
      yoyo: true,
      repeat: -1
    });

    this.input.on("pointerdown", () => {
      this.scene.stop(HudScene.KEY);
      this.scene.stop(GameOverScene.KEY);
      this.scene.stop(MainScene.KEY);
      this.scene.start(MainScene.KEY);
    });
  }
}