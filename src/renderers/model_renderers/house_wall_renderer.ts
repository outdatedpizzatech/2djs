import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { HouseWall, HouseWallRole } from "../../models/house_wall";
import { RenderOptions } from "./types";

export const renderHouseWall = (
  model: HouseWall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number,
  options: RenderOptions
) => {
  const { debug } = model;
  const { worldX, worldY } = project(camera, model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  const sprite = model.role == HouseWallRole.SIDE ? sprites[2] : sprites[3];

  if (xCount > 1) {
    ctx.fillStyle = ctx.createPattern(sprite, "repeat") as CanvasPattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * xCount, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else if (xCount > 0) {
    ctx.drawImage(sprite, worldX, worldY);
  }
};
