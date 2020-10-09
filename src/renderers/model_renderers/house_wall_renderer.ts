import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { HouseWall, HouseWallRole } from "../../models/house_wall";

export const renderHouseWall = (
  model: HouseWall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number
) => {
  const { debug } = model;
  const { worldX, worldY } = project(camera, model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  const sprite = model.role == HouseWallRole.SIDE ? sprites[2] : sprites[3];

  if (xCount > 1) {
    ctx.fillStyle = ctx.createPattern(sprite, "repeat") as CanvasPattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * xCount, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else {
    ctx.drawImage(sprite, worldX, worldY);
  }
};
