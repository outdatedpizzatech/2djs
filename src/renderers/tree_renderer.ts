import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import { Tree } from "../models/tree";
import sprites from "../sprite_collections/tree_sprite_collection";

export const renderTree = (
  targetTree: Tree,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { worldX, worldY } = camera.offset();

  if (targetTree.debug.color) {
    ctx.fillStyle = targetTree.debug.color;
    ctx.fillRect(
      targetTree.worldX + worldX,
      targetTree.worldY + worldY,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }

  ctx.drawImage(
    sprites[0],
    targetTree.worldX + worldX,
    targetTree.worldY + worldY
  );
};
