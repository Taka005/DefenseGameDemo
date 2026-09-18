import { Physics, Scene } from "phaser";
import Phaser from "phaser";
import { Stage } from "../models/Stage";

export class Bullet extends Physics.Arcade.Sprite{
    public damage: number = 10;
    private startX: number = 0;
    private startY: number = 0;

    constructor(scene: Scene, x: number, y: number) {
      super(scene, x, y, "bullet");

      this.setOrigin(0.5, 0.5);

      scene.add.existing(this);
      scene.physics.add.existing(this);
    }

    public fire (x: number, y: number, angle: number): void{
      this.setTexture("bullet");

      this.setPosition(x, y);
      this.setActive(true);
      this.setVisible(true);

      if (this.body) this.body.enable = true;

      this.startX = x;
      this.startY = y;

      this.scene.physics.velocityFromRotation(
        angle,
        300,
        (this.body as Physics.Arcade.Body).velocity
      );
    }

    public destroyBullet(): void{
      this.setActive(false);
      this.setVisible(false);

      if (this.body) {
        this.body.enable = false;
      }
    }

    public update (): void{
      if (!this.active) return;

      const distance = Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y);

      if (distance >= 200) {
        this.destroyBullet();
        return;
      }

      if (this.x > Stage.WIDTH*30 || this.x < 0 || this.y > Stage.HEIGHT*30 || this.y < 0) {
        this.destroyBullet();
      }
    }
}