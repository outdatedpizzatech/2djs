import { Camera, project } from "../../camera";
import sprites from "../../sprite_collections/roof_sprite_collection";
import { Roof } from "../../models/roof";
import { GRID_INTERVAL } from "../../common";
import { LayerMaps } from "../../coordinate_map";
import { RenderOptions } from "./types";

export const renderRoof = (
  model: Roof,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number,
  options: RenderOptions
) => {
  const { worldX, worldY } = project(camera, model);

  if (model.debug.color) {
    ctx.fillStyle = model.debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (xCount > 1) {
    ctx.fillStyle = ctx.createPattern(sprites[0], "repeat") as CanvasPattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * xCount, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else if (xCount > 0) {
    ctx.drawImage(sprites[0], worldX, worldY);
  }

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }
};
