import { GRID_INTERVAL } from "../../common";
import { Debuggable } from "../../debug/grid_lines";
import { Camera } from "../../camera";
import { Positionable } from "../../positionable";

interface Renderable extends Debuggable, Positionable {}

export const renderModel = (
  model: Renderable,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement
) => {
  const { debug } = model;
  const { worldX, worldY } = camera.project(model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  ctx.drawImage(sprite, worldX, worldY);
};
