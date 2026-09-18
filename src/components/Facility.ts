import { Bullet } from "./Bullet";
import Phaser from "phaser";
import { Physics } from "phaser";

export class Facility extends Phaser.GameObjects.Sprite {
  public bullets: Phaser.GameObjects.Group;
  public angle: number;
  private fireTimer: number = 0;
  private fireInterval: number = 500;

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number, bulletGroup: Physics.Arcade.Group) {
    super(scene, x, y, "facility");
    this.angle = angle;
    this.bullets = bulletGroup;

    this.setOrigin(0.5, 0.5);
    this.setSize(30, 30);
    this.setDisplaySize(30, 30);

    scene.add.existing(this);
  }

  public fireBullet(): void {
    const bullet = this.bullets.get(this.x, this.y, "bullet") as Bullet;
    if (bullet) {
      bullet.fire(this.x, this.y, this.angle);
    }
  }

  public update(_time: number, delta: number): void {
    this.fireTimer += delta;

    if (this.fireTimer >= this.fireInterval) {
      this.fireBullet();
      
      this.fireTimer %= this.fireInterval;
    }
  }
}