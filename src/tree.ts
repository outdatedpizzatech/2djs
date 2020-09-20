import { CAMERA_HEIGHT, CAMERA_WIDTH, GRID_INTERVAL } from "./common";
import { Camera } from "./camera";
import SpriteSheet from "./assets/tree_spritesheet.png";

export interface Tree {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
  canvas: HTMLCanvasElement;
  debug: {
    color?: string;
  };
}

export const treeFactory = (attributes: Partial<Tree>): Tree => {
  const canvas = _addCanvas();

  return {
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    canvas,
    debug: {
      color: attributes.debug?.color,
    },
  };
};

export const renderTree = (targetTree: Tree, camera: Camera) => {
  const ctx = targetTree.canvas.getContext("2d") as CanvasRenderingContext2D;

  const { x, y } = camera.offset();
  ctx.clearRect(0, 0, targetTree.canvas.width, targetTree.canvas.height);
  if (targetTree.debug.color) {
    ctx.fillStyle = targetTree.debug.color;
    ctx.fillRect(
      targetTree.worldX + x,
      targetTree.worldY + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }

  const img = new Image();
  img.src = SpriteSheet;

  ctx.drawImage(img, targetTree.worldX + x, targetTree.worldY + y);
};

const _addCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.style.zIndex = "2";
  canvas.style.position = "absolute";
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;

  return canvas;
};
