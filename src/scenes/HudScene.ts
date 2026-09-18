import { Scene, GameObjects } from "phaser";
import Phaser from "phaser";

export class HudScene extends Scene {
  public static readonly KEY: string = "HudScene";
  private lifeText!: GameObjects.BitmapText;
  private scoreText!: GameObjects.BitmapText;
  private angleText!: GameObjects.BitmapText;

  constructor() {
    super({ key: HudScene.KEY });
  }

  public create(): void {
    this.lifeText = this.add.bitmapText(
      10,
      10,
      "DotGothic16_Black",
      `Life: 10`,
      24
    ).setOrigin(0, 0);

    this.scoreText = this.add.bitmapText(
      10,
      40,
      "DotGothic16_Black",
      `Score: 0`,
      24
    ).setOrigin(0, 0);

    this.angleText = this.add.bitmapText(
      10,
      70,
      "DotGothic16_Black",
      `Angle: 0`,
      24
    ).setOrigin(0, 0);

    this.add.bitmapText(
      10,
      500,
      "DotGothic16_Black",
      `敵を全て倒そう! Spaceキーで角度を変更`,
      24
    ).setOrigin(0, 0);
  }

  public updateLife(newLife: number): void {
    this.lifeText.setText(`Life: ${newLife}`);
  }

  public updateAngle(newAngle: number): void {
    this.angleText.setText(`Angle: ${Math.round(newAngle * Phaser.Math.RAD_TO_DEG)}`);
  }

  public updateScore(newScore: number): void {
    this.scoreText.setText(`Score: ${newScore}`);
  }
}