import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import SpriteSheet from "../assets/tree_spritesheet.png";
import { Tree } from "../models/tree";

export const renderTree = (targetTree: Tree, camera: Camera) => {
  const ctx = targetTree.view.getContext("2d") as CanvasRenderingContext2D;

  const { worldX, worldY } = camera.offset();
  ctx.clearRect(0, 0, targetTree.view.width, targetTree.view.height);
  if (targetTree.debug.color) {
    ctx.fillStyle = targetTree.debug.color;
    ctx.fillRect(
      targetTree.worldX + worldX,
      targetTree.worldY + worldY,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }

  const img = new Image();
  img.src = SpriteSheet;

  ctx.drawImage(img, targetTree.worldX + worldX, targetTree.worldY + worldY);
};
