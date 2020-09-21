import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import { Wall } from "../models/wall";
import sprites from "../sprite_collections/wall_sprite_collection";

export const renderWall = (
  targetWall: Wall,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { worldX, worldY, debug } = targetWall;
  const { worldX: cameraX, worldY: cameraY } = camera.offset();

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

  ctx.drawImage(sprites[0], worldX + cameraX, worldY + cameraY);
};
