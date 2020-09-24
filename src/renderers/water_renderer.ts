import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import sprites from "../sprite_collections/water_sprite_collection";
import { Water } from "../models/water";

export const renderWater = (
  targetWater: Water,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { debug } = targetWater;
  const { worldX, worldY } = camera.project(targetWater);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  ctx.drawImage(sprites[0], worldX, worldY);
};
