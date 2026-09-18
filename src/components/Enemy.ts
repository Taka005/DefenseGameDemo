import { Physics, Scene, Curves } from "phaser";
import { Bullet } from "./Bullet";

export class Enemy extends Physics.Arcade.Sprite {
  private path?: Curves.Path;
  private t: number = 0;
  private speed: number = 0.00005;
  private health: number = 100;
  private onEndCallback?: () => void;
  private onKilledCallback?: () => void;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "enemy");

    this.setOrigin(0.5, 0.5);
    this.setScale(0.8);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public setsPath(path: Curves.Path): void{
    this.path = path;
    this.t = 0;

    this.health = 100;
    this.setAlpha(1);
    this.scene.tweens.killTweensOf(this);

    this.onEndCallback = undefined;
    this.onKilledCallback = undefined;
    
    if (this.path) {
      const startPoint = this.path.getPoint(0);
      this.setPosition(startPoint.x, startPoint.y);
    }
  }

  public update(_time: number, delta: number): void{
    if (!this.path) return;

    this.t += this.speed * delta;

    if (this.t >= 1) {
      this.t = 1;
      this.onEndCallback?.();

      this.setActive(false);
      this.setVisible(false);
      if (this.body) this.body.enable = false;

      return;
    }

    const point = this.path.getPoint(this.t);
    this.setPosition(point.x, point.y);
  }

  public start(): void{

  }

  public onEnd(callback: () => void) {
    this.onEndCallback = callback;
  }

  public onKilled(callback: () => void) {
    this.onKilledCallback = callback;
  }

  public damage(bullet: Bullet): void{
    if (!this.active || this.scene.tweens.isTweening(this)) return;

    this.health -= bullet.damage;

    if (this.health <= 0) {
      if (this.body) this.body.enable = false;

      this.scene.tweens.add({
        targets: this,
        alpha: 0.2,
        duration: 50,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.setActive(false);
          this.setVisible(false);
          this.onKilledCallback?.();
        }
      });
    }else{
      this.scene.tweens.add({
        targets: this,
        alpha: 0.2,
        duration: 50,
        yoyo: true,
        repeat: 2
      });
    }
  }
}