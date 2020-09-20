import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import SpriteSheet from "../assets/wall_spritesheet.png";
import { Wall } from "../models/wall";

export const renderWall = (targetWall: Wall, camera: Camera) => {
  const { worldX, worldY, view, debug } = targetWall;
  const { worldX: cameraX, worldY: cameraY } = camera.offset();

  const ctx = view.getContext("2d") as CanvasRenderingContext2D;
  ctx.restore();

  ctx.clearRect(0, 0, view.width, view.height);
  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(
      worldX + cameraX,
      worldY + cameraY,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }

  ctx.save();

  ctx.beginPath();
  ctx.rect(worldX + cameraX, worldY + cameraY, GRID_INTERVAL, GRID_INTERVAL);
  ctx.clip();

  const img = new Image();
  img.src = SpriteSheet;

  ctx.drawImage(img, worldX + cameraX, worldY + cameraY);
};
