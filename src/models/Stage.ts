export class Stage{
  public static readonly WIDTH: number = 32;
  public static readonly HEIGHT: number = 18;
  public roadMap: Position[] = [
    { x: 0, y: 8 },
    { x: 8, y: 8 },
    { x: 8, y: 4 },
    { x: 16, y: 4 },
    { x: 16, y: 12 },
    { x: 32, y: 12 }
  ]
  public path: boolean[][] = Stage.generatePath(this.roadMap);

  public static tileToPosition(tileX: number, tileY: number): Position {
    return { x: tileX*30 + 15, y: tileY*30 + 15 };
  }

  public static generatePath(roadMap: Position[]): boolean[][] {
   const grid: boolean[][] = Array.from({ length: Stage.HEIGHT }, () =>
      Array(Stage.WIDTH).fill(false)
    );

    if (roadMap.length === 0) return grid;

    for (let i = 0; i < roadMap.length - 1; i++) {
      const start = roadMap[i];
      const end = roadMap[i + 1];

      let currentX = start.x;
      let currentY = start.y;

      if (
        currentX >= 0 && currentX < Stage.WIDTH &&
        currentY >= 0 && currentY < Stage.HEIGHT
      ) {
        grid[currentY][currentX] = true;
      }

      const stepX = start.x === end.x ? 0 : (end.x > start.x ? 1 : -1);
      while (currentX !== end.x) {
        currentX += stepX;
        if (
          currentX >= 0 && currentX < Stage.WIDTH &&
          currentY >= 0 && currentY < Stage.HEIGHT
        ) {
          grid[currentY][currentX] = true;
        }
      }

      const stepY = start.y === end.y ? 0 : (end.y > start.y ? 1 : -1);
      while (currentY !== end.y) {
        currentY += stepY;
        if (
          currentX >= 0 && currentX < Stage.WIDTH &&
          currentY >= 0 && currentY < Stage.HEIGHT
        ) {
          grid[currentY][currentX] = true;
        }
      }
    }

    return grid;
  }
}

type Position = {
  x: number;
  y: number;
}