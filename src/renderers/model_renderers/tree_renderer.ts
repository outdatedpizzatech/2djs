import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import { Tree } from "../../models/tree";
import sprites from "../../sprite_collections/tree_sprite_collection";
import { RenderOptions } from "./types";

export const renderTree = (
  model: Tree,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number,
  options: RenderOptions
) => {
  const { worldX, worldY } = project(camera, model);

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
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
};
