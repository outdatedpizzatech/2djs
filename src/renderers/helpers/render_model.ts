import { GRID_INTERVAL } from "../../common";
import { Debuggable } from "../../debug/grid_lines";
import { Camera, project } from "../../camera";
import { Positionable } from "../../positionable";
import { RenderOptions } from "../model_renderers/types";
import { GameObject } from "../../game_object";

interface Renderable extends Debuggable, GameObject {}

export const renderModel = (
  model: Renderable,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  count: number,
  options: RenderOptions
) => {
  const { debug } = model;
  const { worldX, worldY } = project(camera, model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (count > 0) {
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
