import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import { Tree } from "../models/tree";
import sprites from "../sprite_collections/tree_sprite_collection";

export const renderTree = (
  targetTree: Tree,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number
) => {
  const { worldX, worldY } = camera.project(targetTree);

  if (targetTree.debug.color) {
    ctx.fillStyle = targetTree.debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (xCount > 1) {
    const pattern = ctx.createPattern(sprites[0], "repeat") as CanvasPattern;
    ctx.fillStyle = pattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * xCount, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else {
    ctx.drawImage(sprites[0], worldX, worldY);
  }
};
