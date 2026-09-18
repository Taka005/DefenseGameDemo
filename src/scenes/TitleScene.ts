import { Scene } from "phaser";
import { MainScene } from "./MainScene";

export class TitleScene extends Scene {
  public static readonly KEY: string = "TitleScene";

  constructor() {
    super({ key: TitleScene.KEY });
  }

  public init(): void{
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  public create(): void {
    this.add.image(0, 0, "background").setOrigin(0, 0);

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

    const gameLogo = this.add.bitmapText(
      this.scale.width / 2,
      this.scale.height / 2,
      "DotGothic16_Black",
      "Defense Game(Demo)",
      72,
      1
    );

    gameLogo.setOrigin(0.5, 0.5);

    const startMsg = this.add.bitmapText(
      this.scale.width / 2,
      this.scale.height / 2 + 85,
      "DotGothic16_White",
      "クリックして開始",
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
      this.scene.start(MainScene.KEY);
    });
  }
}