import { Game, Types } from "phaser";
import Phaser from "phaser";
import { Preloader } from "./preloader";
import { SplashScene } from "./scenes/SplashScene";
import { TitleScene } from "./scenes/TitleScene";
import { MainScene } from "./scenes/MainScene";
import { HudScene } from "./scenes/HudScene";
import { GameOverScene } from "./scenes/GameOverScene";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: 960,
  height: 540,
  backgroundColor: "#000000",
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  max: {
    width: 960,
    height: 540,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    Preloader,
    SplashScene,
    TitleScene,
    MainScene,
    HudScene,
    GameOverScene
  ]
};

new Game(config);