import { Scene } from "phaser";
import { TitleScene } from "./TitleScene";

export class SplashScene extends Scene {
  public static readonly KEY: string = "SplashScene";

  constructor() {
    super({ key: SplashScene.KEY });
  }

  public init(): void{
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  public create(): void {
    this.scene.start(TitleScene.KEY);
  }
}