import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import sprites from "../sprite_collections/wall_sprite_collection";
import { HouseWall } from "../models/house_wall";

export const renderHouseWall = (
  targetHouseWall: HouseWall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number
) => {
  const { debug } = targetHouseWall;
  const { worldX, worldY } = camera.project(targetHouseWall);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (xCount > 1) {
    ctx.fillStyle = ctx.createPattern(sprites[2], "repeat") as CanvasPattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * xCount, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else {
    ctx.drawImage(sprites[2], worldX, worldY);
  }
};
