import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import { RenderOptions } from "../model_renderers/types";
import { GameObject } from "../../game_object";

interface Renderable extends GameObject {}

export const renderModel = (
  model: Renderable,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  count: number,
  options: RenderOptions
) => {
  const { worldX, worldY } = project(camera, model);

  if (count > 1) {
    ctx.fillStyle = ctx.createPattern(sprite, "repeat") as CanvasPattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * count, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else if (count > 0) {
    ctx.drawImage(sprite, worldX, worldY);
  }

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }
};
