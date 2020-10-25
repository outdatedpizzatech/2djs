import { GRID_INTERVAL, GRID_MAGNITUDE, UNIT_BASE } from "../../common";
import { Camera, project } from "../../camera";
import { RenderOptions } from "../model_renderers/types";
import { GameObject } from "../../game_object";

interface Renderable extends GameObject {}

export const renderModel = (
  model: Renderable,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  options: RenderOptions
) => {
  const { worldX, worldY } = project(camera, model);

  const width = options.dimensions?.width || UNIT_BASE;
  const height = options.dimensions?.height || UNIT_BASE;
  const cropYStart = options.cropYStart || 0;
  const cropYLength = options.cropYLength
    ? options.cropYLength
    : height - cropYStart;

  ctx.drawImage(
    sprite,
    0,
    cropYStart,
    width,
    cropYLength,
    worldX,
    worldY +
      cropYStart * GRID_MAGNITUDE -
      (height - UNIT_BASE) * GRID_MAGNITUDE,
    width * GRID_MAGNITUDE,
    cropYLength * GRID_MAGNITUDE
  );

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, width, height);
  }
};
