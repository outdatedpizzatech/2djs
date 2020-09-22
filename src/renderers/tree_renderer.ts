import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import { Tree } from "../models/tree";
import sprites from "../sprite_collections/tree_sprite_collection";

export const renderTree = (
  targetTree: Tree,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { worldX, worldY } = camera.project(targetTree);

  if (targetTree.debug.color) {
    ctx.fillStyle = targetTree.debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  ctx.drawImage(sprites[0], worldX, worldY);
};
