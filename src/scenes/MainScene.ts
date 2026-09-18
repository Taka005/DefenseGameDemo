import { Scene, Physics, Curves, GameObjects, Input } from "phaser";
import Phaser from "phaser";
import { Stage } from "../models/Stage";
import { Enemy } from "../components/Enemy";
import { Facility } from "../components/Facility";
import { Bullet } from "../components/Bullet";
import { HudScene } from "./HudScene";
import { GameOverScene } from "./GameOverScene";

export class MainScene extends Scene {
  public static readonly KEY: string = "MainScene";
  public stage!: Stage;
  public facilities: Facility[] = [];
  public enemies!: Physics.Arcade.Group;
  public bulletsGroup!: Physics.Arcade.Group;
  private enemyPath!: Curves.Path;
  public life!: number;
  private isGameOver: boolean = false;
  private highlightRect!: GameObjects.Rectangle;
  private killedCount: number = 0;
  private escapedCount: number = 0;
  private angle: number = 0;

  constructor() {
    super({ key: MainScene.KEY });
  }

  public init(): void{
    this.stage = new Stage();
    this.facilities = [];
    this.life = 10;
    this.isGameOver = false;
    this.killedCount = 0;
    this.escapedCount = 0;
    this.angle = 0;

    this.scene.launch(HudScene.KEY);
  }

  public create(): void{
    const spaceKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE);

    spaceKey?.on("down", () => {
      if (this.isGameOver) return;

      this.angle += 45 * Phaser.Math.DEG_TO_RAD;
      if (this.angle >= 2 * Math.PI) {
        this.angle -= 2 * Math.PI;
      }

      (this.scene.get(HudScene.KEY) as HudScene)?.updateAngle(this.angle);
    });

    for (let y = 0; y < Stage.HEIGHT; y++) {
      for (let x = 0; x < Stage.WIDTH; x++) {
        if (this.stage.path[y][x]) {
          this.add.image(
            x * 30,
            y * 30,
            "road"
          ).setOrigin(0, 0);
        } else {
          this.add.image(
            x * 30,
            y * 30,
            "grass"
          ).setOrigin(0, 0);
        }
      }
    }

    const startPos = this.stage.roadMap[0];
    this.enemyPath = new Curves.Path(startPos.x * 30 + 15, startPos.y * 30 + 15);
    
    for (let i = 1; i < this.stage.roadMap.length; i++) {
      const pt = this.stage.roadMap[i];

      this.enemyPath.lineTo(pt.x * 30 + 15, pt.y * 30 + 15);
    }

    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 100,
      runChildUpdate: true
    });

    this.bulletsGroup = this.physics.add.group({
      classType: Bullet,
      maxSize: 200,
      runChildUpdate: true
    });

    this.physics.add.overlap(this.bulletsGroup, this.enemies, (bullet, enemy) => {
      (bullet as Bullet).destroyBullet();
      (enemy as Enemy).damage(bullet as Bullet);
    });

    this.time.addEvent({
      delay: 800,               
      repeat: 15,
      callback: () => {
        this.spawnEnemy();
      }
    });

    this.highlightRect = this.add.rectangle(0, 0, 30, 30, 0xffffff, 0.4).setOrigin(0, 0);
    this.highlightRect.setVisible(false);

    this.input.on("pointermove", (pointer: Input.Pointer) => {
      if (this.isGameOver) return;

      const tileX = Math.floor(pointer.x / 30);
      const tileY = Math.floor(pointer.y / 30);

      if (tileX >= 0 && tileX < Stage.WIDTH && tileY >= 0 && tileY < Stage.HEIGHT) {
        this.highlightRect.setVisible(true);
        this.highlightRect.setPosition(tileX * 30, tileY * 30);

        const pos = Stage.tileToPosition(tileX, tileY);

        const exists = this.facilities.some(f => Math.abs(f.x - pos.x) < 1 && Math.abs(f.y - pos.y) < 1);

        if (this.stage.path[tileY][tileX]||exists) {
          this.highlightRect.setFillStyle(0xff0000, 0.3);
        } else {
          this.highlightRect.setFillStyle(0xffffff, 0.4);
        }
      } else {
        this.highlightRect.setVisible(false);
      }
    });

    this.input.on("pointerout", () => {
      this.highlightRect.setVisible(false);
    });

    this.input.on("pointerdown", (pointer: Input.Pointer) => {
      if (this.isGameOver) return;

      const tileX = Math.floor(pointer.x / 30);
      const tileY = Math.floor(pointer.y / 30);

      if (tileX >= 0 && tileX < Stage.WIDTH && tileY >= 0 && tileY < Stage.HEIGHT) {
        if (this.stage.path[tileY][tileX]) return;

        const pos = Stage.tileToPosition(tileX, tileY);

        const exists = this.facilities.some(f => Math.abs(f.x - pos.x) < 1 && Math.abs(f.y - pos.y) < 1);
        if (exists) return;

        const facility = new Facility(this, pos.x, pos.y, this.angle,this.bulletsGroup);
        this.facilities.push(facility);
      }
    });
  }

  private spawnEnemy() {
    const startPos = this.stage.roadMap[0];
      
    const startX = startPos.x * 30 + 15;
    const startY = startPos.y * 30 + 15;
    
    const enemy = this.enemies.get(startX, startY, "enemy") as Enemy;

    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      if (enemy.body) {
        enemy.body.enable = true;
      }
      
      enemy.setsPath(this.enemyPath);

      enemy.onEnd(() => {
        this.escapedCount++;
        this.life -= 1;

        this.cameras.main.shake(100, 0.01);
  
        (this.scene.get(HudScene.KEY) as HudScene)?.updateLife(this.life);
      });

      enemy.onKilled(() => {
        this.killedCount++;

        (this.scene.get(HudScene.KEY) as HudScene)?.updateScore(this.killedCount);
      });
    }
  }

  public update(time: number, delta: number): void {
    if (this.isGameOver) return;

    this.facilities.forEach(facility => {
      facility.update(time, delta);
    });

    if(this.killedCount >= 16) {
      this.isGameOver = true;

      this.highlightRect.setVisible(false);

      this.scene.pause(HudScene.KEY);
      this.scene.pause(MainScene.KEY);
      this.scene.launch(GameOverScene.KEY);
    }else if (this.life <= 0||this.escapedCount + this.killedCount >= 16) {
      this.isGameOver = true;

      this.highlightRect.setVisible(false);

      this.scene.pause(HudScene.KEY);
      this.scene.pause(MainScene.KEY);
      this.scene.launch(GameOverScene.KEY);
    }
  }
}