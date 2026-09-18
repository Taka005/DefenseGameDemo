import { Scene, Loader } from "phaser";
import { SplashScene } from "./scenes/SplashScene";

export class Preloader extends Scene {
  public static readonly KEY: string = "Preloader";

  constructor() {
    super({ key: Preloader.KEY });
  }

  public preload(): void{
    this.load.setPath("assets");

    //画像
    this.load.image("background", "background.png");
    this.load.image("road", "tiles/road.jpg");
    this.load.image("grass", "tiles/grass.png");
    this.load.image("enemy", "enemies/enemy.png");
    this.load.image("bullet", "bullet.png");
    this.load.image("facility", "facility.png");

    // フォント
    this.load.bitmapFont("DotGothic16_Black", "fonts/DotGothic16_Black.png", "fonts/DotGothic16_Black.xml");
    this.load.bitmapFont("DotGothic16_White", "fonts/DotGothic16_White.png", "fonts/DotGothic16_White.xml");

    this.load.on("progress", (progress: number) => {
        console.log("アセットロード中: " + Math.round(progress * 100) + "%");
    });

    this.load.on("loaderror", (fileObj: Loader.File) => {
      console.error("アセットエラー:", fileObj.key, fileObj.url);
    });
    
    this.load.on("complete", () => {
        console.log("アセットロード完了");
    });
  }

  public create(): void{
    this.scene.start(SplashScene.KEY);
  }
}